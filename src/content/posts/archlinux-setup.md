---
title: "Arch Linux 安装与折腾记录"
published: 2026-07-15
category: "学习经历"
tags: ["Arch Linux", "Linux"]
description: "从零安装 Arch Linux"
draft: false
---

前阵子心血来潮，想在笔记本上给 Arch Linux 腾个位置。机器原本是 Ubuntu + Windows 双系统，Ubuntu 的 grub 做总引导，不想动它，所以分区只能在空闲区域里挤一挤。这篇记录就是我从零装 Arch、再到后来折腾各种桌面环境的一个月流水账——算不上教程，更多是给自己留个档，要是能顺便帮到走类似弯路的人就更好了。

## Arch Linux 基础安装

连接网络是老步骤，iwctl 走一遍：

```bash
iwctl
device list
station wlan0 scan
station wlan0 get-networks
station wlan0 connect XXXX
```

然后运行 `archinstall`，关键配置如下：

- Language：English
- Locale：en_US UTF-8
- Mirrors：China
- Disk configuration：manual partitioning，空闲区域挂载 `/`，boot 分区挂载 `/boot/efi`，ext4
- Swap：no（内存足够）
- Bootloader：Grub，UKI disabled（否则 Ubuntu grub 无法正常启动 Arch）
- Authentication：按要求填写
- Profile：Type 按需求选桌面，Graphics 默认，Greeter 按实际情况选
- Applications：Audio 选 pipewire，Power management 选 power-profile-daemon，字体全选
- Network configuration：NetworkManager（default）
- Time zone：Asia/Shanghai

完成后直接 install 即可，未提及的保持默认。

装完进系统，先把 konsole 和 dolphin 安排上——KDE 不带这两个我浑身难受。然后配中文：

```bash
sudo nano /etc/locale.gen
```

找到 `#zh_CN.UTF-8 UTF-8`，去掉注释，保存后生成：

```bash
sudo locale-gen
```

再到系统设置里把语言改成简体中文。这里有个小讲究：`locale.conf` 最好别动，它改的是整个系统的语言环境，有些终端工具会因此输出乱码；只改桌面环境的显示语言就够了。

最后装 paru，Arch 用户应该不陌生：

```bash
sudo pacman -S --needed base-devel
git clone https://aur.archlinux.org/paru.git
cd paru
makepkg -si
```

## Fcitx5 + Rime 输入法配置

输入法我选的是 Fcitx5 配 Rime。Rime 的可定制程度很高，词库调教好了之后输入体验极好，而且这套方案在 GNOME、KDE、Niri 下都能跑，换桌面不用重新配置。

### 安装

```bash
sudo pacman -S fcitx5 fcitx5-rime fcitx5-configtool fcitx5-gtk fcitx5-qt
sudo pacman -S fcitx5-im fcitx5-rime
```

### 环境变量

为了让系统认出 Fcitx5，需要把输入法模块写进 `/etc/environment`：

```
GTK_IM_MODULE=fcitx
QT_IM_MODULE=fcitx
XMODIFIERS=@im=fcitx
```

### 开机自启

创建一个 desktop entry 让它跟着桌面一起启动：

`~/.config/autostart/fcitx5.desktop`：

```desktop
[Desktop Entry]
Name=Fcitx5
Exec=fcitx5 -d
Type=Application
```

### Rime 默认简体中文

Rime 默认是繁简混合的，我习惯全程简体，所以在 `~/.local/share/fcitx5/rime/default.custom.yaml` 里指定只加载明月拼音简化字方案：

```yaml
patch:
  schema_list:
    - schema: luna_pinyin_simp
```

### Shift 键行为

我不喜欢 Shift 切换中英时把正在输入的拼音清掉，所以配置了左右 Shift 先把拼音字母作为英文上屏、再切换：

```yaml
patch:
  schema_list:
    - schema: luna_pinyin_simp
  ascii_composer/switch_key:
    Shift_L: commit_code
    Shift_R: commit_code
```

### 部署

改完配置后重新部署让它生效：

```bash
fcitx5-remote -r
```

### Flatpak 应用输入法

有一个容易忽略的坑：flatpak 的权限隔离会导致输入法环境变量透传不过去，需要手动 override。例如 Typora：

```bash
flatpak override --user \
  --env=GTK_IM_MODULE=fcitx \
  --env=QT_IM_MODULE=fcitx \
  --env=XMODIFIERS=@im=fcitx \
  io.typora.Typora
```

这不是某个桌面环境的特有问题，所有跑 flatpak 的 Wayland 桌面都会遇到。

## Niri 窗口管理器安装

Niri 是最近挺受关注的一个 Wayland 平铺 compositor。它跟 Hyprland、Sway 最大的区别在于 **scrollable-tiling**——工作区不是固定的网格排列，而是在水平方向上无限滚动，窗口从左到右依次排开，超出的部分可以滚过去。这个交互很新颖，用起来有种"桌面空间无限大"的感觉。

当时我在 GNOME 上通过 DankLinux 仓库装上了 niri，安装过程很顺利，几分钟就进了 niri 的 session。

实际体验了大概一周，说说感受。平铺操作本身很顺畅，scrollable 的概念也确实比传统 workspace 切换更符合直觉——不需要记"我在第几个工作区"，只需要沿着一条线滑过去就行。但日常使用中还是遇到了一些不太顺的地方，主要是软件兼容性问题，比如后面要写的 WPS 缩放问题，以及其他一些 X11-only 的应用在 niri 下体验打折扣。

最终还是回到了 KDE Plasma。不是说 niri 不好——它的设计理念很前卫，作为尝鲜很过瘾——但作为一台每天要写代码、写文档的主力机器，我更需要的是"什么软件拿来就能用"的省心，而不是反复折腾配置。等 niri 再成熟一些，我一定还会再回来的。

## Niri 下 WPS Office 缩放修复

### 问题

在 niri 下打开 Flatpak 版的 WPS Office（`cn.wps.wps_365`），界面明显偏小，跟 GNOME 下看到的完全不是一个大小。WPS 是老式 X11 程序，自带 Qt5-xcb，所以它的绘制尺寸不归 Wayland compositor 管，而是看 Xwayland 给了多少 DPI。

**根因** 出在 niri 的 xwayland-satellite 上。它启动的 Xwayland 是 rootless 模式，固定给 X 程序报告 96 DPI，不会跟随 niri 的 output scale 变化。而 GNOME 的 Mutter 会主动把缩放比例换算成 `Xft.dpi` 写入 X 的根属性（比如 scale=2 时写 192），所以 WPS 在 GNOME 下尺寸是正常的。niri 没有做这件事，WPS 读到默认的 96 DPI，界面自然就缩水了。

### 方案

思路很简单：模仿 Mutter 的做法，登录时直接把正确的 `Xft.dpi` 写进 X 根资源。我选了 168——因为我的 niri scale 是 1.75，96 × 1.75 = 168。同时把光标大小锁在 24，避免被放大。

纯静态方案，不跑脚本、不做定时同步，改一次管到下次换 scale。

### 配置步骤

`~/.Xresources`：

```xresources
Xcursor.theme: BreezeX-Light
Xcursor.size: 24
Xft.dpi: 168
```

然后在 niri 配置中加一行启动时注入：

`~/.config/niri/config.kdl`：

```kdl
spawn-sh-at-startup "xrdb -merge $HOME/.Xresources"
```

### 生效

下次登录会自动执行。想立刻生效的话手动跑一次：

```bash
xrdb -merge ~/.Xresources
```

验证也很简单：

```bash
xprop -root RESOURCE_MANAGER
```

输出里能看到 `Xft.dpi:\t168` 就说明写进去了。打开 WPS，界面大小和 1.75 缩放吻合，字体清晰，光标也正常。

### 退路方案

如果 WPS 的 Kso-Qt 核心不认 `Xft.dpi` 而只认 `QT_FONT_DPI` 环境变量（这种情况在某些版本里确实存在），可以用环境变量再补一刀：

```bash
printf 'QT_FONT_DPI=168\n' >> ~/.config/environment.d/90-dms.conf
export QT_FONT_DPI=168
```

这个变量只影响 Qt 程序，和 `Xft.dpi`（作用于其他 X11 程序）互不干扰，不会翻倍。光标已经被 `Xcursor.size: 24` 锁住了，单独设 `QT_FONT_DPI` 也不会影响光标大小。

## Zsh 终端配置

装完桌面和输入法，终端也得舒服点才行。我一直用 zsh 配 oh-my-zsh，再叠上 powerlevel10k 主题，这套组合拳打了好几年没换过。

先装 zsh，然后切默认 shell：

```bash
sudo pacman -S zsh
chsh -s $(which zsh)
```

重启后装 oh-my-zsh。国内网络 curl 镜像地址走一个：

```bash
sh -c "$(curl -fsSL https://install.ohmyz.sh)"
```

插件我只加了两个，一个自动建议、一个语法高亮：

```bash
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

然后在 `~/.zshrc` 里把插件打开：

```
plugins=(git zsh-autosuggestions zsh-syntax-highlighting)
```

主题用的是 powerlevel10k，我选了纯色极简风格：

```bash
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
```

`~/.zshrc` 里把主题改成 `ZSH_THEME="powerlevel10k/powerlevel10k"`，首次加载会自动进配置向导，选自己顺眼的就行。以后想改随时跑 `p10k configure`。

## 尾声：回到 KDE

兜兜转转一大圈，最后还是回到了 KDE Plasma。Niri 作为主力桌面，细碎的小 bug 还是不少，日常用起来不太省心，加上花哨的动画看久了也有些审美疲劳（不是 。折腾了一段时间，最终还是回到了 KDE。
