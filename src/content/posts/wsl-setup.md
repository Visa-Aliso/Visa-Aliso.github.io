---
title: "搭建WSL"
published: 2026-01-13
category: "学习经历"
tags: ["WSL", "Linux"]
description: "在Windows环境中搭建Linux环境"
draft: false
---

# Win11 下 WSL2 搭建记录

本文记录一次从零开始搭建 WSL2的完整过程，同时整理相关的关键命令。

---

## 一、什么是 WSL？

WSL（Windows Subsystem for Linux）是 Windows 提供的 Linux 子系统，使我们可以在 Windows 下直接运行原生 Linux 环境。其中：

WSL1：系统调用翻译层（已基本淘汰）

WSL2：基于轻量虚拟机，完整 Linux 内核（当前主流）

本文全部基于 WSL2 + Win11。

---

## 二、先安装，再迁移至 D 盘

### 2.1 安装 Ubuntu（默认在 C 盘）

```bash
wsl --install
```

安装完成后：首次启动会创建用户和密码

### 2.2 关闭 WSL

```bash
wsl --shutdown
```

### 2.3 导出 Ubuntu（生成 tar 备份）

先查看发行版名称：

```bash
wsl -l -v
```

然后导出：

```bash
wsl --export Ubuntu D:\WSL\ubuntu_backup.tar
```

该 tar 文件包含：
```bash
-系统
-用户
-home 目录
-已安装的软件和配置
```

### 2.4 注销原有 Ubuntu（删除 C 盘那份）

```bash
wsl --unregister Ubuntu
```

⚠️ 此操作会删除 C 盘里的 Ubuntu，但 tar 备份是完整的。

### 2.5 导入到 D 盘

先创建目标目录，例如：

```bash
D:\WSL\Ubuntu
```

然后执行：

```bash
wsl --import Ubuntu D:\WSL\Ubuntu D:\WSL\ubuntu_backup.tar --version 2
```

此时：Ubuntu 被重新注册，ext4.vhdx 会生成在 D 盘

---

## 三、成功标志与环境说明

当你看到类似提示：

```bash
username@HOSTNAME:~$
```

并伴随提示：

```bash
To run a command as administrator (user "root"), use "sudo <command>".
```

说明：Ubuntu 已正常启动，当前为普通用户，可通过 sudo 获取管理员权限

---

## 四、安装CUDA

在确认 WSL2 已正确启用、Ubuntu 子系统可正常运行，且 Windows 侧显卡驱动已支持 WSL GPU 后，下一步便是为 Linux 环境配置 CUDA 开发工具链。

考虑到 稳定性、维护成本以及 WSL 环境的兼容性，本文选择 Ubuntu 官方仓库提供的 CUDA Toolkit，而非 NVIDIA 官方 runfile 安装方式。

### 4.1 更新系统软件源

在安装 CUDA 之前，建议先同步系统的软件索引并升级已有组件，以避免依赖冲突：

```bash
sudo apt update

sudo apt upgrade
```

该步骤不会影响 Windows 系统，只作用于 WSL 内部的 Ubuntu 文件系统。如果提示可升级大量基础库，属于正常现象，建议确认执行。

### 4.2 查询可用的 CUDA Toolkit 版本

Ubuntu 官方仓库并不会提供所有 NVIDIA 官网的 CUDA 版本，而是提供 经过适配与验证的稳定版本。可以通过以下命令查看当前可用的 CUDA Toolkit：

```bash
apt search nvidia-cuda-toolkit
```

典型输出如下：

```bash
nvidia-cuda-toolkit 12.0.x
```

这意味着当前系统可直接安装 CUDA 12.0，对大多数深度学习与科研项目已经完全足够。

### 4.3 安装 CUDA Toolkit

直接通过 apt 安装即可：

```bash
sudo apt install nvidia-cuda-toolkit -y
```

该命令会自动安装以下内容：

CUDA 编译器（nvcc）

CUDA Runtime 与开发库

标准头文件与调试工具


安装过程中无需手动配置环境变量，这是官方仓库方案的一个重要优势。

### 4.4 验证 CUDA 安装状态

安装完成后，首先检查 CUDA 编译器是否可用：

```bash
nvcc --version
```

若输出类似以下内容，说明 CUDA Toolkit 已成功安装：

```bash
Cuda compilation tools, release 12.0
```

接着确认 nvcc 是否已加入系统 PATH：

```bash
which nvcc
```

在官方仓库方案下，返回路径通常为：

```bash
/usr/bin/nvcc
```

这是 完全正常且推荐的结果，无需额外修改 .bashrc 或手动添加环境变量。

### 4.6 小结

至此，WSL2 下的 CUDA 开发环境已经搭建完成：

无需手动配置环境变量

无需下载 NVIDIA runfile

可直接用于 PyTorch、CUDA C++ 或科研项目开发

后续只需根据具体项目需求，安装对应的深度学习框架或编译 CUDA 程序即可。

---

## 五、WSL 使用

## 推荐的长期结构：

```bash
内容
    -建议位置
Linux 系统
    D:\WSL\Ubuntu
项目代码
    /home/<user>/projects
大数据集
    /mnt/d/datasets
Python / Conda
    Linux 内部
```

## Windows 访问 Linux：

```bash
\\wsl$\Ubuntu\home\<user>
```

## Linux 访问 Windows：

```bash
/mnt/c
/mnt/d
```

## WSL（Windows 侧）管理命令【PowerShell / CMD】

> ⚠️ 以下命令 在 Windows 终端 / PowerShell / CMD 中执行

```bash
wsl --list --verbose
# 列出所有已安装的 WSL 发行版，并显示使用的是 WSL1 还是 WSL2

wsl -l -v
# 上一条命令的简写形式，效果完全一致

wsl -d Ubuntu
# 启动名为 Ubuntu 的 WSL 发行版

wsl --set-default Ubuntu
# 将 Ubuntu 设置为默认发行版（直接输入 wsl 时启动它）

wsl --set-version Ubuntu 2
# 将 Ubuntu 切换为 WSL2（需要系统支持虚拟化）

wsl --shutdown
# 强制关闭所有正在运行的 WSL 实例（解决 90% 的异常问题）
```

## WSL 迁移到 D 盘的核心命令串（重点）

```bash
wsl --shutdown
# 确保所有 WSL 实例已完全关闭，否则 vhdx 文件会被占用

wsl --export Ubuntu D:\WSL\ubuntu.tar
# 将 Ubuntu 发行版导出为一个 tar 包（不包含运行状态）

wsl --unregister Ubuntu
# 从 WSL 中注销 Ubuntu（不会影响刚刚导出的 tar 包）

wsl --import Ubuntu D:\WSL\Ubuntu D:\WSL\ubuntu.tar --version 2
# 将 Ubuntu 重新导入到 D 盘指定目录，并指定使用 WSL2
```

📌 说明：

D:\WSL\Ubuntu 下会生成 ext4.vhdx

以后 Ubuntu 的所有 Linux 文件都物理存放在 D 盘

## WSL 内 Ubuntu：系统与软件管理

> ⚠️ 以下命令 在 Ubuntu 终端中执行

```bash
sudo apt update
# 更新软件包索引（不安装软件）

sudo apt upgrade -y
# 升级所有已安装的软件到最新版本

sudo apt install git vim curl wget -y
# 安装常用基础工具：git、vim、curl、wget

sudo apt autoremove
# 删除不再被依赖的软件包，释放空间
```

## 系统信息与资源查看

```bash
uname -a
# 查看 Linux 内核信息（WSL 内核版本）

lsb_release -a
# 查看 Ubuntu 发行版版本信息

df -h
# 查看磁盘使用情况（人类可读格式）

free -h
# 查看内存使用情况（单位自动换算）
```

## 目录与文件操作

```bash
pwd
# 显示当前所在的完整路径

ls
# 列出当前目录下的文件和文件夹

ls -lah
# 以详细形式列出文件（含隐藏文件），并显示文件大小

cd /path/to/dir
# 切换到指定目录

cd ~
# 回到当前用户的 home 目录（/home/用户名）

mkdir project
# 创建名为 project 的文件夹

rm file.txt
# 删除文件 file.txt

rm -rf folder
# 强制递归删除 folder 目录（危险命令）

cp a.txt b.txt
# 复制文件 a.txt 为 b.txt

mv old new
# 重命名或移动文件/目录
```

## Windows 与 WSL 文件互通

```bash
cd /mnt/c
# 进入 Windows 的 C 盘

cd /mnt/d/WSL
# 进入 Windows 的 D:\WSL 目录

explorer.exe .
# 用 Windows 资源管理器打开当前 Linux 目录

wsl
# 从 Windows 直接进入默认 WSL 发行版
```

## 权限与用户相关

```bash
whoami
# 显示当前登录的用户名

id
# 显示当前用户的 UID、GID 以及所属用户组

sudo command
# 以管理员（root）权限执行 command

sudo -i
# 切换到 root 用户（不建议长期使用）
```

## 开发常用（Git / Python）

Git
```bash
git clone https://github.com/user/repo.git
# 克隆远程仓库到本地

git status
# 查看当前仓库状态

git pull
# 拉取远程更新

git add .
# 将所有改动加入暂存区

git commit -m "message"
# 提交代码并添加提交说明
```

Python 虚拟环境
```bash
python3 --version
# 查看 Python 版本

sudo apt install python3-venv -y
# 安装 Python 虚拟环境模块

python3 -m venv venv
# 创建名为 venv 的虚拟环境

source venv/bin/activate
# 激活虚拟环境

deactivate
# 退出虚拟环境
```

## 更新

```bash
sudo apt update
# 从软件源同步可用软件列表

apt list --upgradable
# 查看当前有哪些软件可以升级

sudo apt upgrade
# 安全升级已安装的软件，不删除也不新增依赖

sudo apt full-upgrade
# 在必要时允许新增或删除依赖完成升级

sudo apt autoremove
# 删除升级后不再需要的旧依赖，释放磁盘空间

sudo apt clean
# 清空已下载的软件包缓存，不影响已安装的软件

df -h
# 查看磁盘剩余空间，避免升级或安装过程中空间不足

sudo apt update && sudo apt upgrade -y
# 一条命令完成日常系统更新（不需要逐条确认）
```

## 进程 / 网络 / 排错

```bash
top
# 实时查看系统进程和资源占用

htop
# 更友好的进程查看工具（需提前安装）

ps aux | grep python
# 查找包含 python 的进程

ping google.com
# 测试网络连通性

ip a
# 查看网络接口和 IP 地址
```

## WSL 救命级命令

```bash
wsl --shutdown
# WSL 出现任何奇怪问题，第一步永远是它

df -h
# 检查磁盘是否已满（ext4.vhdx 满了会导致大量异常）

sudo apt --fix-broken install
# 修复损坏的软件依赖关系
```
