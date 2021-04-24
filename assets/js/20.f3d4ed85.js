(window.webpackJsonp=window.webpackJsonp||[]).push([[20],{464:function(t,a,s){"use strict";s.r(a);var n=s(9),_=Object(n.a)({},(function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("p",[t._v("趁着腰伤赋闲在家，把前几天调试STM32的几个BUG给记录一下吧。")]),t._v(" "),s("h2",{attrs:{id:"_0x01-薛定谔的启动模式"}},[t._v("0x01 薛定谔的启动模式")]),t._v(" "),s("p",[t._v("在设计FOC驱动模块的时候，我把BLDC的HALL传感器引线和STM32的TIM4 CH1~3连在一起了。本来这个事情很正常，可是问题是我用的是STM32G474CEU6这款MCU，它的TIM4有一个通道和BOOT0是复用的。这个问题本来我没在意，可是当我开始调试的时候，发现有时候复位可以正常进main，有时候却进不去，而且在调试界面看不到代码。这个时候我发现PC的值不是在0x08000000附近，而是在一个奇怪的位置——Bootloader。")]),t._v(" "),s("p",[t._v("仔细一想这个问题很容易解释，在还没有启动的时候，BOOT0脚并没有被我配置成TIM4的输入通道，这个时候它还是BOOT0，所以如果此时转子的位置恰好把这个脚拉到高电平了的话，就无法正常启动了。")]),t._v(" "),s("p",[t._v("解决办法也很简单，在ST-Link Utility软件里面配置FLASH的用户配置区FLASH_OPTR，把硬件BOOT0给禁用掉就好了。参考RM0440 2.6节里面的内容如下：")]),t._v(" "),s("table",[s("thead",[s("tr",[s("th",[t._v("BOOT_LOCK")]),t._v(" "),s("th",[t._v("nBOOT1")]),t._v(" "),s("th",[t._v("nBOOT0")]),t._v(" "),s("th",[t._v("BOOT0 pin")]),t._v(" "),s("th",[t._v("nSWBOOT0")]),t._v(" "),s("th",[t._v("启动区")])])]),t._v(" "),s("tbody",[s("tr",[s("td",[t._v("1")]),t._v(" "),s("td",[t._v("x")]),t._v(" "),s("td",[t._v("x")]),t._v(" "),s("td",[t._v("x")]),t._v(" "),s("td",[t._v("x")]),t._v(" "),s("td",[t._v("主启动区")])]),t._v(" "),s("tr",[s("td",[t._v("0")]),t._v(" "),s("td",[t._v("x")]),t._v(" "),s("td",[t._v("x")]),t._v(" "),s("td",[t._v("0")]),t._v(" "),s("td",[t._v("1")]),t._v(" "),s("td",[t._v("主启动区")])]),t._v(" "),s("tr",[s("td",[t._v("0")]),t._v(" "),s("td",[t._v("x")]),t._v(" "),s("td",[t._v("1")]),t._v(" "),s("td",[t._v("x")]),t._v(" "),s("td",[t._v("0")]),t._v(" "),s("td",[t._v("主启动区")])]),t._v(" "),s("tr",[s("td",[t._v("0")]),t._v(" "),s("td",[t._v("0")]),t._v(" "),s("td",[t._v("x")]),t._v(" "),s("td",[t._v("1")]),t._v(" "),s("td",[t._v("1")]),t._v(" "),s("td",[t._v("SRAM")])]),t._v(" "),s("tr",[s("td",[t._v("0")]),t._v(" "),s("td",[t._v("0")]),t._v(" "),s("td",[t._v("0")]),t._v(" "),s("td",[t._v("x")]),t._v(" "),s("td",[t._v("0")]),t._v(" "),s("td",[t._v("SRAM")])]),t._v(" "),s("tr",[s("td",[t._v("0")]),t._v(" "),s("td",[t._v("1")]),t._v(" "),s("td",[t._v("x")]),t._v(" "),s("td",[t._v("1")]),t._v(" "),s("td",[t._v("1")]),t._v(" "),s("td",[t._v("Bootloader")])]),t._v(" "),s("tr",[s("td",[t._v("0")]),t._v(" "),s("td",[t._v("1")]),t._v(" "),s("td",[t._v("0")]),t._v(" "),s("td",[t._v("x")]),t._v(" "),s("td",[t._v("0")]),t._v(" "),s("td",[t._v("Bootloader")])])])]),t._v(" "),s("p",[t._v("最简单的办法，只要把BOOT_LOCK配置为高电平，就可以强制从主启动区启动了。")]),t._v(" "),s("h2",{attrs:{id:"_0x02-hal库垃圾的中断处理"}},[t._v("0x02 HAL库垃圾的中断处理")]),t._v(" "),s("p",[t._v("为了用HALL传感器测量电机速度，我配置TIM4使用内部时钟计数，并设置为XOR/HALL模式。在此模式下，HALL传感器任一相的电平变化都会触发TIM4的捕获通道1，捕获此时计数器的值，同时清零计数器。")]),t._v(" "),s("p",[t._v("我的想法是，每次进入捕获中断后读取捕获寄存器的值，把这个值作为速度的观测量，值越大速度越慢。可是TIM4是一个16位计数器，最大计数值只有65536，如果在电机转的很慢甚至停转的情况下，计数器溢出了，我要怎么知道此时计数器溢出了呢？")]),t._v(" "),s("p",[t._v("最直接的想法是利用溢出时的更新中断，设置一个低速标记位，如果溢出进入更新中断，则将低速标记位置位。如果进入了捕获中断，则清除低速标记位。代码如下：")]),t._v(" "),s("div",{staticClass:"language-c extra-class"},[s("pre",{pre:!0,attrs:{class:"language-c"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("HAL_TIM_PeriodElapsedCallback")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("TIM_HandleTypeDef "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("*")]),t._v("htim"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("htim "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("==")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("&")]),t._v("htim4"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("BLDC_SetSpeed")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("&")]),t._v("hbldc"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("65535")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    hbldc"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("LowSpeed "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" FLAG_SET"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("HAL_TIM_IC_CaptureCallback")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("TIM_HandleTypeDef "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("*")]),t._v("htim"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("htim "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("==")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("&")]),t._v("htim4"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("uint8_t")]),t._v(" ret "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("Motor_GetHall")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("Motor_6step")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("ret"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" hbldc"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("RefDirection"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("!")]),t._v("hbldc"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("LowSpeed"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("BLDC_SetSpeed")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("&")]),t._v("hbldc"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" htim4"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("Instance"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("->")]),t._v("CCR1"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n    hbldc"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("LowSpeed "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" FLAG_RESET"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[t._v("然鹅我很快就发现了问题——这个"),s("code",[t._v("HAL_TIM_PeriodElapsedCallback()")]),t._v("函数，它进不去！")]),t._v(" "),s("p",[t._v("排查之后我发现了问题，我在main函数中调用的是"),s("code",[t._v("HAL_TIMEx_HallSensor_Start_IT(&htim4)")]),t._v("来启动定时器的XOR/HALL模式，然而，这个函数中只开启了"),s("code",[t._v("TIM_IT_CC1")]),t._v("这个中断源，并没有开启"),s("code",[t._v("TIM_IT_UPDATE")]),t._v("。找到问题后解决办法也就很简单了，在"),s("code",[t._v("MX_TIM4_Init()")]),t._v("的最后加上一行：")]),t._v(" "),s("div",{staticClass:"language-c extra-class"},[s("pre",{pre:!0,attrs:{class:"language-c"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[t._v("__HAL_TIM_ENABLE_IT")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("&")]),t._v("htim4"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" TIM_IT_UPDATE "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("|")]),t._v(" TIM_IT_CC1"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),s("p",[t._v("本以为这样就完事大吉了，可谁知这下子问题更大了，不管电机转没转，低速标记位始终都被置位。其实更新中断并不只有在溢出的时候才会触发，而是在很多情况下都会触发，其中包括当CNT寄存器通过UG位软复位和被触发事件复位这两种情况。XOR/HALL模式下，CNT寄存器的复位是通过触发通道实现的，所以同时也会触发更新中断。")]),t._v(" "),s("p",[t._v("但是，天无绝人之路。RM0440 28.6.5节中指出，这两种情况需要URS=0才会触发中断。那什么是URS呢？它是TIMx_CR1中的bit2，Update Request Source。RM0440中是这样写的：")]),t._v(" "),s("blockquote",[s("p",[t._v("This bit is set and cleared by software to select the UEV event sources.")]),t._v(" "),s("p",[t._v("0: Any of the following events generate an update interrupt or DMA request if enabled. These events can be:")]),t._v(" "),s("p",[t._v("​\t–   Counter overflow/underflow")]),t._v(" "),s("p",[t._v("​\t–   Setting the UG bit")]),t._v(" "),s("p",[t._v("​\t–   Update generation through the slave mode controller")]),t._v(" "),s("p",[t._v("1: Only counter overflow/underflow generates an update interrupt or DMA request if enabled")])]),t._v(" "),s("p",[t._v("如果把URS位置位，就可以只在CNT寄存器溢出的时候，才触发更新中断。在"),s("code",[t._v("MX_TIM4_Init()")]),t._v("最后加上一行：")]),t._v(" "),s("div",{staticClass:"language-c extra-class"},[s("pre",{pre:!0,attrs:{class:"language-c"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[t._v("SET_BIT")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("htim4"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("Instance"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("->")]),t._v("CR1"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" TIM_CR1_URS"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),s("p",[t._v("完美解决。")]),t._v(" "),s("h2",{attrs:{id:"_0x03-小结"}},[t._v("0x03 小结")]),t._v(" "),s("p",[t._v("遇事不决，查手册！")])])}),[],!1,null,null,null);a.default=_.exports}}]);