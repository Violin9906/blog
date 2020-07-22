---
title: 基于Docker搭建Anaconda环境
date: 2020-05-09
author: Violin
tags:
  - Docker
  - Anaconda
location: Hefei
---

最近在写人工智能的大作业，顺手搭一个anaconda的环境出来，顺便记录一下过程，方便没有docker基础的同学参考。

## STEP 0x00 安装Docker

docker是一个开源的应用容器引擎，你可以简单地把它理解为虚拟机（其实和虚拟机还是有区别的）。不管你的电脑是windows，linux还是mac，只要使用相同的docker镜像运行一个容器，就可以在容器中运行你的程序，不必担心依赖和兼容性问题。

安装docker的步骤不是本文的重点，可以参考网络上其它教程。windows电脑可能需要开启hyper-v，并且有可能需要在bios中启用虚拟化技术，或者需要安装vbox等虚拟机软件。docker官网:[https://www.docker.com/products/docker-desktop](https://link.zhihu.com/?target=https%3A//www.docker.com/products/docker-desktop)

## STEP 0x01 启动anaconda容器并安装jupyter

安装好docker并确认服务启动后，直接运行如下命令就可以基于官方的anaconda3镜像实例化一个本地容器：

```bash
docker run -it --name="anaconda" -p 8888:8888 continuumio/anaconda3 /bin/bash
```

参数`-it`是启用交互式终端，`--name="anaconda"`是给容器起名字（只要你记得住，可以换成别的名字），`-p 8888:8888`是将容器的8888端口映射到本地的8888端口，便于访问jupyter。

docker会自动从docker hub下载最新的anaconda3镜像并创建容器，之后你就进入容器中了。在容器中，运行如下命令安装jupyter笔记本

```bash
conda install -c conda-forge jupyterlab
```

如果你需要传统的jupyter notebook，请参阅jupyter官网的教程。

## STEP 0x02 启动jupyter笔记本&玩耍

启动jupyter lab：

```bash
cd ~
jupyter lab --ip='*' --port=8888 --no-browser --allow-root
```

然后你应该能看到类似

```bash
[I 13:37:11.236 LabApp] Use Control-C to stop this server and shut down all kernels (twice to skip confirmation).
[C 13:37:11.239 LabApp] 
    
    To access the notebook, open this file in a browser:
        file:///root/.local/share/jupyter/runtime/nbserver-30-open.html
    Or copy and paste one of these URLs:
        http://10f788d1f6a3:8888/?token=***********
     or http://127.0.0.1:8888/?token=**********
```

的输出，把那个链接复制到浏览器打开，就能看到熟悉的jupyter lab界面了。

![img](https://pic4.zhimg.com/80/v2-a57740f2a4036ac508f61b9db49cf51a_720w.jpg)

尽情玩耍吧！

## STEP 0x03 退出容器

玩够了？

首先按Control+C退出jupyter笔记本，然后运行命令

```bash
exit
```

就这么简单。

## STEP 0x04 重启动容器

下次再使用这个容器，不需要再从头配置了，就像虚拟机一样，直接开机就好。

```bash
docker start anaconda
docker exec -it anaconda /bin/bash
```

第一行是运行容器anaconda（这是之前用--name参数起的名字，还记得不？），第二行是在容器anaconda中运行交互式终端（你也可以在容器启动后单独使用第二行命令创建更多的终端连接到容器，比如在不退出jupyter的情况下用pip安装某个模块）

然后，请参考STEP 0x02运行jupyter。

## STEP 0x05 删除容器

玩够了？

请确保你容器中没有重要数据了，否则请使用`docker cp`命令将它拷贝出来，用法类似普通的cp命令。

```bash
# 反过来也可以把本地文件拷贝到容器中
docker cp anaconda:你容器中数据的路径 你的本地路径
```

使用`docker rm`命令删除容器。

```bash
docker rm anaconda
```

如果还想删除下载的镜像，可以使用`docker image rm`命令。首先列出所有镜像，看一下image id。

```bash
docker image ls                                                          
REPOSITORY              TAG                 IMAGE ID            CREATED             SIZE
continuumio/anaconda3   latest              bdb4a7e92a49        8 weeks ago         2.7GB
```

然后

```bash
docker image rm bdb4a7e92a49
```

## STEP 0x06 更进一步

每次用完都要用`docker cp`拷贝文件太麻烦？可以在创建容器的时候指定文件系统映射。

```bash
docker run -it --name="anaconda_2" -p 8888:8888 -v `pwd`:/root continuumio/anaconda3 /bin/bash
```

参数`-v`将 当前目录`pwd`挂载到容器的`/root`目录，容器中对`/root`所做的改动会同步到主机。注意`pwd`两侧有反引号，表示此处使用命令`pwd`的输出 ，也可以指定本地的其它目录。不过，可能要注意一下本地目录的权限问题，以及在windows电脑上可能会有一些文件系统的冲突（比如不支持软连接啦等等，我也没试过，我的主力机是mac）。

## STEP 0x07 总结

把命令总结一下：

```bash
# 头一次用
docker run -it --name="anaconda" -p 8888:8888 continuumio/anaconda3 /bin/bash
conda install -c conda-forge jupyterlab
cd ~
jupyter lab --ip='*' --port=8888 --no-browser --allow-root

# 用完以后
# Ctrl+C退出jupyter
exit

# 以后再用
docker start anaconda
docker exec -it anaconda /bin/bash
cd ~
jupyter lab --ip='*' --port=8888 --no-browser --allow-root

# 不想要了
docker rm anaconda
```