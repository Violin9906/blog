---
title: 嵌入式Debug日志（1）
date: 2021-04-24
author: Violin
tags:
  - 嵌入式系统
  - STM32
  - 自动化
location: Wugang
---

趁着腰伤赋闲在家，把前几天调试STM32的几个BUG给记录一下吧。

## 0x01 薛定谔的启动模式

在设计FOC驱动模块的时候，我把BLDC的HALL传感器引线和STM32的TIM4 CH1~3连在一起了。本来这个事情很正常，可是问题是我用的是STM32G474CEU6这款MCU，它的TIM4有一个通道和BOOT0是复用的。这个问题本来我没在意，可是当我开始调试的时候，发现有时候复位可以正常进main，有时候却进不去，而且在调试界面看不到代码。这个时候我发现PC的值不是在0x08000000附近，而是在一个奇怪的位置——Bootloader。

仔细一想这个问题很容易解释，在还没有启动的时候，BOOT0脚并没有被我配置成TIM4的输入通道，这个时候它还是BOOT0，所以如果此时转子的位置恰好把这个脚拉到高电平了的话，就无法正常启动了。

解决办法也很简单，在ST-Link Utility软件里面配置FLASH的用户配置区FLASH_OPTR，把硬件BOOT0给禁用掉就好了。参考RM0440 2.6节里面的内容如下：

| BOOT_LOCK | nBOOT1 | nBOOT0 | BOOT0 pin | nSWBOOT0 | 启动区     |
| --------- | ------ | ------ | --------- | -------- | ---------- |
| 1         | x      | x      | x         | x        | 主启动区   |
| 0         | x      | x      | 0         | 1        | 主启动区   |
| 0         | x      | 1      | x         | 0        | 主启动区   |
| 0         | 0      | x      | 1         | 1        | SRAM       |
| 0         | 0      | 0      | x         | 0        | SRAM       |
| 0         | 1      | x      | 1         | 1        | Bootloader |
| 0         | 1      | 0      | x         | 0        | Bootloader |

最简单的办法，只要把BOOT_LOCK配置为高电平，就可以强制从主启动区启动了。

## 0x02 HAL库垃圾的中断处理

为了用HALL传感器测量电机速度，我配置TIM4使用内部时钟计数，并设置为XOR/HALL模式。在此模式下，HALL传感器任一相的电平变化都会触发TIM4的捕获通道1，捕获此时计数器的值，同时清零计数器。

我的想法是，每次进入捕获中断后读取捕获寄存器的值，把这个值作为速度的观测量，值越大速度越慢。可是TIM4是一个16位计数器，最大计数值只有65536，如果在电机转的很慢甚至停转的情况下，计数器溢出了，我要怎么知道此时计数器溢出了呢？

最直接的想法是利用溢出时的更新中断，设置一个低速标记位，如果溢出进入更新中断，则将低速标记位置位。如果进入了捕获中断，则清除低速标记位。代码如下：

```c
void HAL_TIM_PeriodElapsedCallback(TIM_HandleTypeDef *htim) {
  if (htim == &htim4) {
    BLDC_SetSpeed(&hbldc, 65535);
    hbldc.LowSpeed = FLAG_SET;
  }
}

void HAL_TIM_IC_CaptureCallback(TIM_HandleTypeDef *htim) {
  if (htim == &htim4) {
    uint8_t ret = Motor_GetHall();
    Motor_6step(ret, hbldc.RefDirection);
    if (!hbldc.LowSpeed) {
      BLDC_SetSpeed(&hbldc, htim4.Instance->CCR1);
    }
    hbldc.LowSpeed = FLAG_RESET;
  }
}
```

然鹅我很快就发现了问题——这个`HAL_TIM_PeriodElapsedCallback()`函数，它进不去！

排查之后我发现了问题，我在main函数中调用的是`HAL_TIMEx_HallSensor_Start_IT(&htim4)`来启动定时器的XOR/HALL模式，然而，这个函数中只开启了`TIM_IT_CC1`这个中断源，并没有开启`TIM_IT_UPDATE`。找到问题后解决办法也就很简单了，在`MX_TIM4_Init()`的最后加上一行：

```c
__HAL_TIM_ENABLE_IT(&htim4, TIM_IT_UPDATE | TIM_IT_CC1);
```

本以为这样就完事大吉了，可谁知这下子问题更大了，不管电机转没转，低速标记位始终都被置位。其实更新中断并不只有在溢出的时候才会触发，而是在很多情况下都会触发，其中包括当CNT寄存器通过UG位软复位和被触发事件复位这两种情况。XOR/HALL模式下，CNT寄存器的复位是通过触发通道实现的，所以同时也会触发更新中断。

但是，天无绝人之路。RM0440 28.6.5节中指出，这两种情况需要URS=0才会触发中断。那什么是URS呢？它是TIMx_CR1中的bit2，Update Request Source。RM0440中是这样写的：

> This bit is set and cleared by software to select the UEV event sources.
>
> 0: Any of the following events generate an update interrupt or DMA request if enabled. These events can be: 
>
> ​	–   Counter overflow/underflow
>
> ​	–   Setting the UG bit
>
> ​	–   Update generation through the slave mode controller
>
> 1: Only counter overflow/underflow generates an update interrupt or DMA request if enabled

如果把URS位置位，就可以只在CNT寄存器溢出的时候，才触发更新中断。在`MX_TIM4_Init()`最后加上一行：

```c
SET_BIT(htim4.Instance->CR1, TIM_CR1_URS);
```

完美解决。

## 0x03 小结

遇事不决，查手册！