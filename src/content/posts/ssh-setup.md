---
title: "配置ssh"
published: 2025-09-09
category: "学习经历"
tags: ["github"]
description: "配置ssh，以防以后需要"
draft: false
---

# Hexo 使用 SSH 部署到 GitHub 完整指南

## 生成 SSH Key

在命令行（CMD、PowerShell 或 Git Bash）执行：

```bash
ssh-keygen -t rsa -C "GitHub-Email@example.com"
```

## 测试ssh

```bash
ssh -T git@github.com
```

第一次连接时会提示：

```bash
The authenticity of host 'github.com (IP)' can't be established.
Are you sure you want to continue connecting (yes/no)?
```

输入yes并回车，如果显示：

```bash
Hi <用户名>! You've successfully authenticated...
```

说明SSH配置成功

### 注意事项

默认SSH端口会使用22端口，若22端口被墙，则用443端口。

22端口格式：

```bash
git@github.com:User/repo.git
```

443端口格式：

```bash
ssh://git@ssh.github.com:443/User/repo.git
```
