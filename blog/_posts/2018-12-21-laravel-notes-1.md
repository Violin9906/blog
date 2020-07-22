---
title: Laravel学习笔记|在Cloud Studio中搭建开发环境
date: 2018-12-21
author: Violin
tags:
  - Laravel
  - PHP
location: Hefei
---

此前一直使用LAMP环境，对nginx没有多少了解。这次初次LNMP环境下搭建laravel开发环境，踩了不少坑，集齐了502，500，404，403，200五种状态码（滑稽），特此记录，供以后查阅。
## 1.在Cloud Studio中建立[工作空间](https://dev.tencent.com/help/cloud-studio/workspace-introduction)
Cloud Studio是腾讯云提供的基于浏览器的IDE，用户可以基于coding中的项目建立工作空间，相当于一个半临时的服务器。
为了建立所需的开发环境，在coding中建立项目test(不是必须的)，然后建立工作空间。运行环境选择Default(Ubuntu 16.04)。创建后启动并进入工作空间（示意图）。
![Cloud Studio界面](https://img-blog.csdnimg.cn/20181221131616731.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM0OTIwNDE1,size_16,color_FFFFFF,t_70)
## 2.安装并配置LNMP环境
首先更新apt：
```shell
sudo apt-get update
```
然后就可以安装nginx了：
```shell
sudo apt-get install nginx
sudo service nginx start
```
此时nginx已经安装好。点击页面最右侧的访问链接，建立一个80端口的临时链接，打开应该可以看到nginx的默认页面了。

----------
下面安装PHP7.1。最新的laravel需要php7.1及以上版本的支持，同时还需要一些其他的php扩展包（将在下面列出).
首先添加ppa源，因为ubuntu的apt-get软件源只有php7.0版本
```shell
sudo apt-add-repository ppa:ondrej/php
sudo apt-get update
```
然后安装php7.1和相关扩展
```shell
sudo apt-get install php7.1 php7.1-fpm php7.1-mcrypt php7.1-gd php7.1-mbstring php7.1-mysql php7.1-zip php7.1-xml
```
下面修改nginx的配置文件使其支持php
```shell
sudo vim /etc/nginx/sites-available/default
```
修改如下内容
```ini
	location ~ \.php$ {
                include snippets/fastcgi-php.conf;
        #
        #       # With php7.0-cgi alone:
        #       fastcgi_pass 127.0.0.1:9000;
        #       # With php7.1-fpm:
                fastcgi_pass unix:/run/php/php7.1-fpm.sock;
                fastcgi_split_path_info ^((?U).+\.php)(/?.+)$;
                fastcgi_param PATH_INFO $fastcgi_path_info;
                fastcgi_param PATH_TRANSLATED $document_root$fastcgi_path_info;

        }
```
 最后三行是为了启用pathinfo的功能
 以及添加默认打开文件index.php
 ```ini
 		# Add index.php to the list if you are using PHP
			index index.php index.html index.htm index.nginx-debian.html;
 ```
 另外，我们还要修改这里
 ```ini
         location / {
                # First attempt to serve request as file, then
                # as directory, then fall back to displaying a 404.
                try_files $uri $uri/ /index.php?$query_string;
        }
 ```
 这里是按照[laravel的document要求](https://laravel.com/docs/5.7/installation#web-server-configuration)，否则之后设置route会出404。
 最好再修改一下`/etc/php/7.1/fpm/php.ini`，把`display_errors`设置为`On`，方便以后调试php程序。
 重启服务：
 ```shell
 sudo service php7.1-fpm restart
 sudo service nginx restart
 ```
 现在我们进入`/var/www/html`建立`test.php`，输入
 ```php
 <?php phpinfo();?>
 ```
 再打开访问链接，访问`test.php`，如果一切正常应该能看到php的信息页了。

---------
最后安装mySQL，这不是重点，如果有需要再启动服务就好了，先装上。
```shell
sudo apt-get install mysql-server mysql-client
```
## 3.安装composer和laravel
laravel是需要通过composer安装的。为了获得最新版本，我们不通过`apt-get`安装composer（那个安装出来貌似是`1.0.0-beta`），而是这样：
```shell
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```
可以查看一下版本
```shell
composer -v
```
然后我们要安装laravel。由于国内网络环境的问题（严肃脸），我们是几乎没办法访问composer的软件源的，需要使用国内镜像[Packagist](https://pkg.phpcomposer.com/).
```shell
composer config -g repo.packagist composer https://packagist.phpcomposer.com
```
然后就可以愉快的安装laravel了～(先装一下unzip，否则会报warning)
```shell
sudo apt-get install unzip
composer global require laravel/installer
```
这样就安装好了。确认一下刚才没有出现警告或者报错。
然后我们要让laravel可以直接以命令的形式运行而不是每次都要到`~/.composer/vendor/bin`下面去找那个`laravel`程序。首先可能会想到环境变量，然而Cloud Studio的这个终端比较特殊，我们知道环境变量在登出后是会重置的，而Cloud Studio的终端由于网络不稳定或其他一些原因经常悄悄登出，到你用的时候再悄悄登录。如果修改登录时自动运行的脚本，貌似也不行（我也不知道为什么）。总之，环境变量弄起来很麻烦。我采用的办法是把laravel文件软链接到`/usr/local/bin`
```shell
cd /usr/local/bin
sudo ln -s /home/coding/.composer/vendor/bin/laravel laravel
```
可以试试在随便什么目录下运行laravel
```shell
cd ~
laravel
```
应该能看到彩色的输出而不是`command not found`一类的东西

## 4.建立测试项目
准备工作已经完成了，可以建立一个项目测试了。
```shell
cd ~/workspace
laravel new test
```
如果一切顺利的话，应该能在Cloud Studio左侧的文件树中看到项目文件了。注意！留意终端的输出，不要被最后那行`Build something amazing`还是什么的骗了！如果发现有不正常的地方，比如fail, error, warning之类的，一定要先解决，免得后续步骤中浪费时间。可以直接把建立的项目目录`rm -rf`掉，解决了以后再重新建立一个。按照我自己的情况，到这里都没什么问题。
然后要修改目录权限，否则会报403.关于权限的具体要求可以参看laravel的文档，我这里懒省事直接设置777了
```shell
sudo chmod -R 777 ~/workspace/test
```
接下来，我们要设置nginx的网页根目录位置，否则是没办法通过那个访问链接访问项目的。
```shell
sudo vim /etc/nginx/sites-available/default
```
把`root /var/www/html;`改成`root /home/coding/workspace/test/public`，不一定完全一样，总之就是刚刚建立的项目文件夹下面的`public`目录。
再次启动80端口的访问链接，如果一切正常，应该能看到Laravel的欢迎页了。这个小清新风格的页面还是很符合我的审美的(\^_\^)
![Laravel欢迎页](https://img-blog.csdnimg.cn/20181221141059812.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM0OTIwNDE1,size_16,color_FFFFFF,t_70)
* 如果出现502错误，首先重启`php7.1-fpm`和`nginx`两个服务，因为Cloud Studio很会抽风，你一段时间不动它它就悄悄重启了。
```shell
sudo service php7.1-fpm restart
sudo service nginx restart
```
如果还是不行，检查第2步中LNMP环境的配置是否有问题。
* 如果出现500错误，检查第3步和第4步，尤其是第4步中建立项目时的输出内容，如果有任何的fail/error/warning等一定要解决。
* 如果出现403错误，那八成是目录权限的问题，实在不行就简单粗暴777吧。如果还不行，检查一下nginx的配置文件里面有没有加入默认打开`index.php`的配置（我第二次部署的时候就忘掉了）

到这里如果成功了，就基本没什么问题了。可以到项目文件夹下的`routes/web.php`添加一个新路由，测试一下路由功能是否正常。

Have fun!