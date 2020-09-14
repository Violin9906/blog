---
title: 移植micropython到stm32（1）
date: 2020-09-14
author: Violin
tags:
  - stm32
  - micropython
location: Hefei
---

## 简介

Micropython是一个将Python 3.x移植到嵌入式系统的项目，官方网站：[micropython.org](http://www.micropython.org/)，代码仓库：[micropython/micropython](https://github.com/micropython/micropython)。本文尝试将其移植到自制的STM32开发板上。

我所使用的是基于STM32F413RGT6的自制开发板，硬件设计见[Violin9906/STM32F413MiniSys](https://github.com/Violin9906/STM32F413MiniSys)。编译环境为Ubuntu 20.04

## 安装依赖

```bash
sudo apt update
sudo apt install make gcc gcc-arm-none-eabi
```

## 下载项目

```bash
git clone https://github.com/micropython/micropython.git
cd micropython
git submodule update --init lib
```

## 编译交叉编译器

```bash
cd mpy-cross
make
```

## 移植开发板定义文件

官方有给出NUCLEO_F413ZH的支持，我们在此基础上进行修改。

```bash
cd ports/stm32/boards
cp NUCLEO_F413ZH/ STM32F413RG -r
cd STM32F413RG
```

在此目录下有4个文件，我们依次对它进行修改。

### pins.csv

这个文件是各种IO Pins的映射，采用CSV格式编写。我们使用的STM32F413RG系列比ZH系列少，所以需要删掉一些。

```csv
PA0,PA0
PA1,PA1
PA2,PA2
PA3,PA3
PA4,PA4
PA5,PA5
PA6,PA6
PA7,PA7
PA8,PA8
PA9,PA9
PA10,PA10
PA11,PA11
PA12,PA12
PA13,PA13
PA14,PA14
PA15,PA15
PB0,PB0
PB1,PB1
PB2,PB2
PB3,PB3
PB4,PB4
PB5,PB5
PB6,PB6
PB7,PB7
PB8,PB8
PB9,PB9
PB10,PB10
PB11,PB11
PB12,PB12
PB13,PB13
PB14,PB14
PB15,PB15
PC0,PC0
PC1,PC1
PC2,PC2
PC3,PC3
PC4,PC4
PC5,PC5
PC6,PC6
PC7,PC7
PC8,PC8
PC9,PC9
PC10,PC10
PC11,PC11
PC12,PC12
PC13,PC13
PD2,PD2
SW,C13
LED_BLUE,D2
```

### mpconfigboard.h

这个文件是一些关于开发板的初始化配置，一些选项的作用可以参考`ports/stm32/mpconfigboard_common.h`中的说明。有些选项的作用我也没搞明白，官方暂时还没有文档。

```c
#define MICROPY_HW_BOARD_NAME       "STM32F413RG"
#define MICROPY_HW_MCU_NAME         "STM32F413"

#define MICROPY_HW_HAS_SWITCH       (1)
#define MICROPY_HW_HAS_FLASH        (1)
#define MICROPY_HW_ENABLE_RNG       (1)
#define MICROPY_HW_ENABLE_RTC       (1)
#define MICROPY_HW_ENABLE_DAC       (1)
#define MICROPY_HW_ENABLE_USB       (0) // 暂时先停用，还没搞明白USB咋用

// HSE is 25MHz, CPU freq set to 48MHz
#define MICROPY_HW_CLK_PLLM (25)
#define MICROPY_HW_CLK_PLLN (192)
#define MICROPY_HW_CLK_PLLP (RCC_PLLP_DIV4)
#define MICROPY_HW_CLK_PLLQ (4)

// For 2.7 to 3.6 V, 75 to 100 MHz: 3 wait states.
#define MICROPY_HW_FLASH_LATENCY    FLASH_LATENCY_3

// UART config
#define MICROPY_HW_UART4_TX     (pin_A0)
#define MICROPY_HW_UART4_RX     (pin_A1)
#define MICROPY_HW_UART5_TX     (pin_B13)
#define MICROPY_HW_UART5_RX     (pin_B12)
#define MICROPY_HW_UART_REPL        PYB_UART_4
#define MICROPY_HW_UART_REPL_BAUD   115200

// I2C busses
#define MICROPY_HW_I2C1_SCL (pin_B6)
#define MICROPY_HW_I2C1_SDA (pin_B7)
#define MICROPY_HW_I2C2_SCL (pin_B10)
#define MICROPY_HW_I2C2_SDA (pin_B3)
#define MICROPY_HW_I2C3_SCL (pin_A8)
#define MICROPY_HW_I2C3_SDA (pin_C9)

// SPI busses
#define MICROPY_HW_SPI1_NSS     (pin_A4)
#define MICROPY_HW_SPI1_SCK     (pin_A5)
#define MICROPY_HW_SPI1_MISO    (pin_A6)
#define MICROPY_HW_SPI1_MOSI    (pin_A7)
#define MICROPY_HW_SPI2_NSS     (pin_A11)
#define MICROPY_HW_SPI2_SCK     (pin_C7)
#define MICROPY_HW_SPI2_MISO    (pin_C2)
#define MICROPY_HW_SPI2_MOSI    (pin_C3)

// CAN busses
#define MICROPY_HW_CAN1_TX (pin_A12)
#define MICROPY_HW_CAN1_RX (pin_B8)

// USRSW is pulled high. Pressing the button makes the input go low.
#define MICROPY_HW_USRSW_PIN        (pin_C13)
#define MICROPY_HW_USRSW_PULL       (GPIO_PULLUP)
#define MICROPY_HW_USRSW_EXTI_MODE  (GPIO_MODE_IT_FALLING)
#define MICROPY_HW_USRSW_PRESSED    (1)

// LEDs
#define MICROPY_HW_LED1             (pin_D2)
#define MICROPY_HW_LED_ON(pin)      (mp_hal_pin_high(pin))
#define MICROPY_HW_LED_OFF(pin)     (mp_hal_pin_low(pin))

```

简单起见我只配置了一小部分外设，以后再慢慢添加。

### mpconfigboard.mk

这里是一些编译时参数。需要修改的是LD_FILES。

```makefile
MCU_SERIES = f4
CMSIS_MCU = STM32F413xx
AF_FILE = boards/stm32f413_af.csv
LD_FILES = boards/stm32f413xg.ld boards/common_ifs.ld
TEXT0_ADDR = 0x08000000
TEXT1_ADDR = 0x08060000
```

### stm32f4xx_hal_conf.h

这个文件是一些基本配置，比如时钟频率之类的。

```c
/* This file is part of the MicroPython project, http://micropython.org/
 * The MIT License (MIT)
 * Copyright (c) 2019 Damien P. George
 */
#ifndef MICROPY_INCLUDED_STM32F4XX_HAL_CONF_H
#define MICROPY_INCLUDED_STM32F4XX_HAL_CONF_H

#include "boards/stm32f4xx_hal_conf_base.h"

// Oscillator values in Hz
#define HSE_VALUE (25000000)
#define LSE_VALUE (32768)
#define EXTERNAL_CLOCK_VALUE (12288000)

// Oscillator timeouts in ms
#define HSE_STARTUP_TIMEOUT (100)
#define LSE_STARTUP_TIMEOUT (5000)

#endif // MICROPY_INCLUDED_S
```

## 编译固件

以上配置好后，进入`/ports/stm32`目录，编译固件：

```bash
make BOARD=STM32F413RG -j8
```

编译完成后，在`/ports/stm32/build-STM32F413RF`下找到`firmware.hex`。

## 烧录固件并测试

使用ST-Link连接开发板，用STM32CubeProgrammer将固件烧录到单片机上，用USB线连接USB1端口（UART4）和电脑，用串口终端打开对应串口，即可看到micropython的命令行界面：

```text
MicroPython v1.13-48-gb31cb21a3 on 2020-09-14; STM32F413RG with STM32F413
Type "help()" for more information.
>>>
```

点个灯：

```python
import pyb
led = pyb.LED(1)
led.on()
```

按钮控制灯开关：

```python
import pyb
sw = pyb.Switch()
sw.callback(lambda:pyb.LED(1).toggle())
```

按下按钮PC13，LED的状态就会切换。