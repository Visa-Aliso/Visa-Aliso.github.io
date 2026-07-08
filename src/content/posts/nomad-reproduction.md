---
title: "NoMaD项目复现"
published: 2026-02-04
category: "学习经历"
tags: ["ObjNav", "NoMaD", "Server", "Linux"]
description: "完成 NoMaD 模型的训练，并在不依赖实机平台的条件下，实现轨迹的生成。"
draft: false
---

# NoMaD项目复现

[NoMaD: Goal Masked Diffusion Policies for Navigation and Exploration](https://arxiv.org/abs/2310.07896)提出了一种基于 Transformer 与扩散模型的统一导航策略，能够在未知的环境中同时进行无目标探索和目标条件导航，并以更高效率实现更强泛化能力。

## Train

最初训练模型是在本地电脑上进行，但是遇到训练速度过慢的问题，于是后续训练在服务器中进行。配置好环境之后，进行数据处理，此次训练采用 go_stanford 数据集（数据量小，适合学习用），但是因为 go_stanford 数据里的 yaw 和 position 在格式上不稳定（常见是多一维、不是标量、长度不够），而原始 _compute_actions 默认它们是形状固定的一维数组。结果在数据处理阶段做切片、拼接和 padding 时，yaw 会因为多出来的一维或类型不一致直接导致 shape 不匹配、np.concatenate / np.repeat 报错。所以要将以下文件的代码进行修改：

**file：train/vint_train/data/vint_dataset.py**
```bash
# Original code:
    def _compute_actions(self, traj_data, curr_time, goal_time):
        start_index = curr_time
        end_index = curr_time + self.len_traj_pred * self.waypoint_spacing + 1
        yaw = traj_data["yaw"][start_index:end_index:self.waypoint_spacing]
        positions = traj_data["position"][start_index:end_index:self.waypoint_spacing]
        goal_pos = traj_data["position"][min(goal_time, len(traj_data["position"]) - 1)]

        if len(yaw.shape) == 2:
            yaw = yaw.squeeze(1)

        if yaw.shape != (self.len_traj_pred + 1,):
            const_len = self.len_traj_pred + 1 - yaw.shape[0]
            yaw = np.concatenate([yaw, np.repeat(yaw[-1], const_len)])
            positions = np.concatenate([positions, np.repeat(positions[-1][None], const_len, axis=0)], axis=0)

        assert yaw.shape == (self.len_traj_pred + 1,), f"{yaw.shape} and {(self.len_traj_pred + 1,)} should be equal"
        assert positions.shape == (self.len_traj_pred + 1, 2), f"{positions.shape} and {(self.len_traj_pred + 1, 2)} should be equal"

        waypoints = to_local_coords(positions, positions[0], yaw[0])
        goal_pos = to_local_coords(goal_pos, positions[0], yaw[0])

        assert waypoints.shape == (self.len_traj_pred + 1, 2), f"{waypoints.shape} and {(self.len_traj_pred + 1, 2)} should be equal"

        if self.learn_angle:
            yaw = yaw[1:] - yaw[0]
            actions = np.concatenate([waypoints[1:], yaw[:, None]], axis=-1)
        else:
            actions = waypoints[1:]
        
        if self.normalize:
            actions[:, :2] /= self.data_config["metric_waypoint_spacing"] * self.waypoint_spacing
            goal_pos /= self.data_config["metric_waypoint_spacing"] * self.waypoint_spacing

        assert actions.shape == (self.len_traj_pred, self.num_action_params), f"{actions.shape} and {(self.len_traj_pred, self.num_action_params)} should be equal"

        return actions, goal_pos

# Modified code:
    def _compute_actions(self, traj_data, curr_time, goal_time):
        start_index = curr_time
        end_index = curr_time + self.len_traj_pred * self.waypoint_spacing + 1

        yaw = np.array(traj_data["yaw"][start_index:end_index:self.waypoint_spacing], dtype=np.float32).flatten()
        positions = np.array(traj_data["position"][start_index:end_index:self.waypoint_spacing], dtype=np.float32)
        goal_pos = np.array(traj_data["position"][min(goal_time, len(traj_data["position"]) - 1)], dtype=np.float32)

        # 补齐长度
        if yaw.shape[0] != self.len_traj_pred + 1:
            const_len = self.len_traj_pred + 1 - yaw.shape[0]
            yaw = np.concatenate([yaw, np.repeat(yaw[-1], const_len)])
            positions = np.concatenate([positions, np.repeat(positions[-1][None], const_len, axis=0)], axis=0)

        # 确保都是 float32
        yaw = yaw.astype(np.float32)
        positions = positions.astype(np.float32)

        waypoints = to_local_coords(positions, positions[0], float(yaw[0]))
        goal_pos = to_local_coords(goal_pos, positions[0], float(yaw[0]))

        if self.learn_angle:
            yaw_delta = (yaw[1:] - yaw[0]).astype(np.float32)
            actions = np.concatenate([waypoints[1:], yaw_delta[:, None]], axis=-1)
        else:
            actions = waypoints[1:]

        # 标准化
        if self.normalize:
            actions[:, :2] /= self.data_config["metric_waypoint_spacing"] * self.waypoint_spacing
            goal_pos /= self.data_config["metric_waypoint_spacing"] * self.waypoint_spacing

        # 最终确保是 float32
        actions = np.asarray(actions, dtype=np.float32)
        goal_pos = np.asarray(goal_pos, dtype=np.float32)

        return actions, goal_pos
```

在完成数据处理后，进行了模型训练，共训练 30 epochs，最终得到模型权重文件（.pth）。训练过程中，各项参数的变化情况均可在 Weights & Biases（wandb）中进行可视化查看。

## Deployment

由于没有实机部署的条件，于是采用[https://github.com/Mrakas/nomad](https://github.com/Mrakas/nomad)的方案。

配置好环境之后，需要导入权重文件（.pth）并将代码结构统一，主要是修改相关文件中的路径设置。需要注意的是，diffusion_policy 是通过直接 git clone 得到的：外层是一个大文件夹，里面又包含一个同名的 diffusion_policy 子文件夹，这种结构很容易导致路径重复或引用混乱。因此，可能需要在多个地方进行调整，包括 diffusion_policy 内部的文件以及 deployment 相关文件中的路径引用。

相关代码完成之后，选择图片文件进行处理即可运行。目前程序最初的执行逻辑是：只取某一条轨迹中的某一个点，因此只会返回一个二维的 waypoint。需要对这部分逻辑进行如下修改：

**api_explore_RGB.py**
```python
    # ...

    def navigate(self,
                 single_img = None,# priority
                 num_samples: int = 8, 
                 waypoint_index: int = 2,
                 return_traj: bool = False) -> np.ndarray:
        """
        Main navigation method to generate navigation actions.

        Args:
            context_images (List[str]): List of image paths for context
            num_samples (int, optional): Number of action samples. Defaults to 8.
            waypoint_index (int, optional): Waypoint to use for navigation. Defaults to 2.
            return_traj (bool, optional): Whether to return full trajectory. Defaults to False.

        Returns:
            np.ndarray: Chosen navigation waypoint
        """
        # Check context size
        
        # Load and transform images
        
        if len(self.context_queue) < 4:
            self.context_queue = [single_img,single_img,single_img,single_img] # 4imgs !!
        else:
            self.context_queue = self.context_queue[1:] + [single_img]

        context_queue = self.context_queue
        
        obs_images = transform_images(context_queue, self.model_params["image_size"], center_crop=False)
        obs_images = obs_images.to(self.device)

        # Prepare goal and mask
        fake_goal = torch.randn((1, 3, *self.model_params["image_size"])).to(self.device)
        mask = torch.ones(1).long().to(self.device)

        # Inference
        with torch.no_grad():
            # Encode vision features
            obs_cond = self.model('vision_encoder', obs_img=obs_images, goal_img=fake_goal, input_goal_mask=mask)
            
            # Repeat condition for multiple samples
            obs_cond = obs_cond.repeat(num_samples, 1) if len(obs_cond.shape) == 2 else obs_cond.repeat(num_samples, 1, 1)
            
            # Initialize noisy action
            noisy_action = torch.randn(
                (num_samples, self.model_params["len_traj_pred"], 2), device=self.device)
            naction = noisy_action

            # Run noise scheduler
            self.noise_scheduler.set_timesteps(self.num_diffusion_iters)
            for k in self.noise_scheduler.timesteps[:]:
                noise_pred = self.model(
                    'noise_pred_net',
                    sample=naction,
                    timestep=k,
                    global_cond=obs_cond
                )
                naction = self.noise_scheduler.step(
                    model_output=noise_pred,
                    timestep=k,
                    sample=naction
                ).prev_sample

        # Process actions
        naction = to_numpy(get_action(naction))

        if return_traj:
            return naction  # (num_samples, T, 2)

        naction = naction[0]  # Select first sample
        chosen_waypoint = naction[waypoint_index]

        # Normalize if required
        if self.model_params.get("normalize", False):
            chosen_waypoint *= (self.MAX_V / self.RATE)

        return chosen_waypoint

    # ...
```

**api_test_RGB.py**
```python
import sys
sys.path.append('../vint_release/deployment')

from deployment.src.api_explore_RGB import VisualNavigationAPI
import PIL.Image as PILImage
import numpy as np

def main():
    single_img_path = 'path/to/0.jpg'
    single_img = PILImage.open(single_img_path).convert("RGB")

    nav_api = VisualNavigationAPI(model_name="nomad")

    # 核心：返回整条轨迹
    naction = nav_api.navigate(
        single_img=single_img,
        num_samples=8,
        return_traj=True
    )

    print("naction shape:", naction.shape)  # (8, 8, 2)
    np.save("naction.npy", naction)
    print("saved naction.npy")

if __name__ == "__main__":
    main()
```

最后，利用 show.py 生成轨迹。

```python
import numpy as np
import matplotlib.pyplot as plt

naction = np.load("naction.npy")

plt.figure(figsize=(6, 6))
for i in range(naction.shape[0]):
    x = naction[i, :, 0]
    y = naction[i, :, 1]
    plt.plot(x, y, marker='o', alpha=0.8)

plt.axis("equal")
plt.grid(True)
plt.title("Predicted Trajectories")
plt.show()
```

---
尽管代码改的十分丑陋，但好在是完成了 ಥ_ಥ 。