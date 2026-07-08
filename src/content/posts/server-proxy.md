---
title: "服务器搭建代理环境"
published: 2026-01-22
category: "学习经历"
tags: ["Linux"]
description: "终于解决了服务器某些网络问题了QAQ"
draft: false
---
## Clash 代理服务在服务器上快速部署

### 上传文件到服务器主目录
将以下两个文件上传到服务器主目录：

- [clash](/files/clash)
- [cache.db](/files/cache.db)

### 准备配置文件
在本地的 Clash 客户端中找到你的代理配置文件（通常是 .yml 后缀），将其改名为 config.yaml，并上传到服务器主目录。
### 启动 Clash
在服务器终端执行以下命令：

```Bash
chmod +x clash
./clash -d .
```

如果能够弹出代理节点，说明 Clash 启动成功。(不能退出这个终端)
### 在终端中使用代理
在需要使用代理的终端输入以下命令（根据实际 IP 和端口调整）：

```Bash
export https_proxy=127.0.0.1:7890
export http_proxy=127.0.0.1:7890
```

设置成功后，终端的网络请求就会通过 Clash 代理。
