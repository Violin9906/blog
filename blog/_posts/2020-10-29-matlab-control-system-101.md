---
title: Matlab 控制系统工具箱 101
date: 2020-10-29
author: Violin
tags:
  - Matlab
  - 自动化
location: Hefei
---

本文作为10系自动控制原理课程的Matlab快速入门指南。

## Matlab 基础

### 基础知识

[MathWorks帮助中心：桌面基础知识](https://ww2.mathworks.cn/help/matlab/learn_matlab/desktop.html)

![desktop](https://ww2.mathworks.cn/help/matlab/learn_matlab/desktop_zh_CN.png)

启动Matlab时，默认以上图所示的界面显示。中间的区域为命令行窗口，在提示符`>>`后可以输入Matlab命令并通过按下回车执行。

Matlab也可以将一系列命令保存为[脚本(Script)](https://ww2.mathworks.cn/help/matlab/learn_matlab/scripts.html)或函数(Function)，并可以通过命令行[调用它们](https://ww2.mathworks.cn/help/matlab/learn_matlab/scripts-and-functions.html)。

命令行中计算的结果默认会直接输出在命令行窗口中，如果不希望结果直接显示出来（比如一个非常大的矩阵），可以通过在命令结尾加上分号`;`来办到。

### 表达式

[MathWorks帮助中心：表达式](https://ww2.mathworks.cn/help/matlab/learn_matlab/expressions.html)

Matlab可以使用下列运算符：

| 运算符 | 说明           |
| ------ | -------------- |
| `+`    | 加法           |
| `-`    | 减法           |
| `*`    | 乘法           |
| `.*`   | 逐元素乘法     |
| `/`    | 除法           |
| `./`   | 逐元素除法     |
| `\`    | 左除           |
| `.\`   | 逐元素左除     |
| `^`    | 幂             |
| `.^`   | 逐元素幂       |
| `'`    | 复共轭转置     |
| `.'`   | 非共轭数组转置 |
| `( )`  | 指定计算顺序   |

说明：

- 除法$A/B=AB^{-1}$，左除$A\backslash B=A^{-1}B$

- 逐元素计算是指两个相同大小的矩阵，各对应位置的元素分别进行相应计算。例如：
  
$$
\left[\begin{matrix} 1 & 2 \\ 3 & 4 \end{matrix}\right].*\left[ \begin{matrix} 1 & 2 \\ 3 & 4 \end{matrix}\right]=\left[\begin{matrix} 1 & 4 \\ 9 & 16 \end{matrix} \right]
$$

- 对于实数矩阵，复共轭转置和非共轭转置相同。

### 变量和常量

可以通过`=`将一个值赋给一个变量。变量名称区分大小写，以字母开头并可以跟任意数量的字母、数字和下划线，但是matlab默认只取前63个字符作为变量的唯一识别方式。

当安装了Matlab符号计算工具箱后，可以通过syms命令定义符号变量：

```matlab
>> syms a b;
>> expand((a+2)*(b+3)) % expand()作用是展开并化简一个表达式。百分号是行注释符号。
 
ans =
 
3*a + 2*b + a*b + 6
```

一些常用的常量：

| 常量 | 值                | 说明        |
| ---- | ----------------- | ----------- |
| `pi` | $3.14159265\dots$ | 圆周率$\pi$ |
| `i`  | $\sqrt{-1}$       | 虚数单位    |
| `j`  | $\sqrt{-1}$       | 虚数单位    |

没有预定义自然常数e，需要时可以使用`exp(1)`代替。

### 数组和矩阵

[MathWorks帮助中心：数组和矩阵](https://ww2.mathworks.cn/help/matlab/learn_matlab/matrices-and-arrays.html#MatricesAndArraysGSExample-3)

Matlab把所有变量当作数组进行处理，矩阵是二维数组，标量是1x1的特殊数组。

定义一个数组：使用逗号`,`或空格分隔行内元素，使用分号`;`分隔不同的行。例如：

```matlab
>> a = [1 2 3; 4 5 6; 7 8 10]

a = 3×3

     1     2     3
     4     5     6
     7     8    10
```

创建特殊矩阵：

```matlab
% ones创建所有元素都是1的矩阵
>> ones(2)

ans =

     1     1
     1     1

>> ones(3,2)

ans =

     1     1
     1     1
     1     1

% eye创建单位阵
>> eye(2)

ans =

     1     0
     0     1

% zeros创建0阵
>> zeros(2)

ans =

     0     0
     0     0

>> zeros(2,3)

ans =

     0     0     0
     0     0     0
```

也可以用方括号`[]`加上逗号`,`或分号`;`将矩阵拼接起来：

```matlab
>> [eye(2),ones(2)]

ans =

     1     0     1     1
     0     1     1     1

>> [eye(2);ones(2)]

ans =

     1     0
     0     1
     1     1
     1     1
```

通过冒号`:`可以创建一个序列（向量）：

```matlab
>> t=0:0.2:1

t =

         0    0.2000    0.4000    0.6000    0.8000    1.0000

```

## 绘图

### 二维线图

基本的绘图命令是`plot()`。

[MathWorks帮助中心：plot](https://ww2.mathworks.cn/help/matlab/ref/plot.html)

`plot()`的基本用法是`plot(X,Y)`：

```matlab
>> x = 0:pi/100:2*pi;
>> y = sin(x);
>> plot(x,y)
```

![plot](https://ww2.mathworks.cn/help/matlab/ref/createlineplotexample_01_zh_CN.png)

更多用法，参阅上面的帮助中心链接。

### 子图

通过`subplot()`可以将多幅图拼成一个图组。

[MathWorks帮助中心：subplot](https://ww2.mathworks.cn/help/matlab/ref/subplot.html)

```matlab
subplot(2,1,1);
x = linspace(0,10);
y1 = sin(x);
plot(x,y1)

subplot(2,1,2); 
y2 = sin(5*x);
plot(x,y2)
```

![subplot](https://ww2.mathworks.cn/help/matlab/ref/upperandlowersubplotsexample_01_zh_CN.png)

## 控制系统工具箱

### 创建传递函数

创建传递函数可以使用`tf()`

```matlab
>> tf([1 2],[1 3 5])

ans =
 
      s + 2
  -------------
  s^2 + 3 s + 5
 
Continuous-time transfer function.

```

`tf()`的第一个参数是传递函数分子多项式系数的降幂排列矩阵，第二个参数是传递函数分母多项式系数的降幂排列矩阵。

或者使用`zpk()`

```matlab
>> zpk([-1 -2],[-3 -4],5)

ans =
 
  5 (s+1) (s+2)
  -------------
   (s+3) (s+4)
 
Continuous-time zero/pole/gain model.

```

`zpk()`第一个参数是所有零点的矩阵，第二个参数是所有极点的矩阵，第三个参数是增益。

### 对传递函数的变换

两个传递函数串联，直接使用`*`相乘即可。

```matlab
>> G1=tf([1,2],[1,3]);
>> G2=tf([1,4],[1,5]);
>> G1*G2

ans =
 
  s^2 + 6 s + 8
  --------------
  s^2 + 8 s + 15
 
Continuous-time transfer function.

```

如果已经有了开环传递函数，可以直接使用`feedback()`得到闭环传递函数。feedback的基本用法是`feedback(sys1, sys2)`，如下图。注意这里已经是负反馈，因此sys2不需要加负号。对于单位负反馈，直接取sys2=1即可。

![feedback](https://ww2.mathworks.cn/help/control/ref/feedback7.png)

```matlab
>> G1=tf([1,2],[1,3]);
>> feedback(G1,1)

ans =
 
   s + 2
  -------
  2 s + 5
 
Continuous-time transfer function.

```

### Bode图、增益裕量与相位裕量

[MathWorks帮助中心：bode](https://ww2.mathworks.cn/help/control/ref/bode.htm)

[MathWorks帮助中心：margin](https://ww2.mathworks.cn/help/control/ref/margin.html)

使用`bode()`绘制一个传递函数的Bode图：

```matlab
H = tf([1 0.1 7.5],[1 0.12 9 0 0]);
bode(H)
```

![bode1](https://ww2.mathworks.cn/help/examples/controls_id/win64/BodePlotOfDynamicSystemExample_01.png)

可以指定Bode图的频率范围。还可以通过`grid`打开坐标网格（对于其它图也适用，要关闭网格使用`grid off`）：

```matlab
H = tf([-0.1,-2.4,-181,-1950],[1,3.3,990,2600]);
bode(H,{1,100})
grid
```

![bode2](https://ww2.mathworks.cn/help/examples/controls_id/win64/BodePlotAtSpecifiedFrequenciesExample_01.png)

如果要求单位负反馈系统的增益裕量和相位裕量，可以使用`margin()`代替`bode()`，注意这里的参数是**开环**传递函数：

```matlab
sys = tf(1,[1 2 1 0]);
margin(sys)
```

![margin](https://ww2.mathworks.cn/help/examples/control/win64/PlotGainAndPhaseMarginsOfTransferFunctionExample_01.png)

### 根轨迹图

[MathWorks帮助中心: rlocus](https://ww2.mathworks.cn/help/control/ref/tf.rlocus.html)

使用`rlocus()`绘制根轨迹图：

![rlocus1](https://ww2.mathworks.cn/help/control/ref/rlocus.png)

```matlab
>> sys = tf([2 5 1],[1 2 3]);
>> rlocus(sys)
```

![rlocus2](https://ww2.mathworks.cn/help/examples/control/win64/RootLocusPlotOfDynamicSystemExample_01.png)

`rlocus()`的参数是系统的开环传递函数，绘制出系统的零极点随反馈增益`k`的变化轨迹。使用`grid`命令或`sgrid`命令可以在图上显示等阻尼比线和等自然振荡频率线。

![rlocus3](https://ww2.mathworks.cn/help/examples/controls_id/win64/GenerateSPlaneGridOnRootLocusPlotExample_02.png)



### Nyquist图

[MathWorks帮助中心：nyquist](https://ww2.mathworks.cn/help/ident/ref/nyquist.html)

使用`nyquist()`绘制Nyquist图：

```matlab
H = tf([2 5 1],[1 2 3]);
nyquist(H)
grid % 显示等增益网格
```

![nyquist](https://ww2.mathworks.cn/help/examples/controls_id/win64/NyquistPlotOfDynamicSystemExample_02.png)

### Nichols图

[MathWorks帮助中心：nochols](https://ww2.mathworks.cn/help/control/ref/nichols.html)

使用`nochols()`绘制Nichols图，通过`grid`或`ngrid`显示闭环增益和相位网格。

```matlab
H = tf([-4 48 -18 250 600],[1 30 282 525 60]);
nichols(H)
grid
```

![nichols](https://ww2.mathworks.cn/help/examples/control/win64/NicholsResponseWithNicholsGridLinesExample_01.png)

### 单位阶跃响应

[MathWorks帮助中心：step](https://ww2.mathworks.cn/help/control/ref/lti.step.html)

使用`step()`绘制系统的单位阶跃响应：

```matlab
sys = tf(4,[1 2 10]);
step(sys)
```

![step1](https://ww2.mathworks.cn/help/examples/controls_id/win64/StepResponseOfDynamicSystemExample_01.png)

可以使用第二个参数指定要绘制的时间范围：

```matlab
sys = zpk(-1,[-0.2+3j,-0.2-3j],1) * tf([1 1],[1 0.05])
step(sys,15)
```

![step2](https://ww2.mathworks.cn/help/examples/controls_id/win64/StepResponseAtSpecifiedTimesExample_02.png)

或者，也可以使用一个向量指定时间范围和分辨率：

```matlab
t = 20:0.2:120;
step(sys,t)
```

![step3](https://ww2.mathworks.cn/help/examples/controls_id/win64/StepResponseAtSpecifiedTimesExample_03.png)

