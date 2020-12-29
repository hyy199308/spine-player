# 造轮子系列2: 骨骼动画播放


今天的造轮子系列, 介绍的是通过从零开始编写Spine骨骼动画的播放代码，从而更深入了解骨骼动画的基本原理。


Spine骨骼动画是2D的骨骼动画软件，常用于2D游戏, 不过它内部蕴含的骨骼动画原理在3D模型动画里也同样适用。


这次造的轮子还是跟以前一样，不使用任何渲染引擎(Unity,Cocos)， 使用Typescript编写骨骼动画的核心代码, 渲染层通过自己封装webgl的接口进行渲染即可。


 


### 一. 骨骼动画的核心原理














简单来讲就是为了更深入的理解渲染管线。

我们平时在使用Unity/Cocos/Unreal 这些引擎开发游戏的时候， 会用到很多引擎的图形相关API，这些引擎的接口虽然都各不相同，但是在更底层一点的地方， 它们毫无例外都是使用opengl/d3d或者其他类似的图形接口去驱动显卡绘制图形。

我们通过opengl 喂很多三角形数据和其他相关数据给显卡， 显卡就可以渲染出一张2D的图片， 这中间究竟发生了事情?

如果让我们暂时忘记opengl等等这些别人已经造好的轮子,  给你同样的数据, 你能否造出一个轮子来渲染出这张图片？

在编程领域, 我们习惯了使用各种轮子, 然而有一条实践经验是我认为值得推荐给大家的， 就是

`想要深度理解一个轮子， 就试着造一个轮子吧` 

即使你造出来的轮子非常简陋, 它也有价值。 


这个轮子， 就是我们本文中会提到的`软件渲染器`。

在CPU层面, 用纯应用层代码的方式， 对输入的三角形数据进行光栅化, 着色， 这就是最简单的软件渲染器。



### 二. 我造的小轮子：toy-raster

下面是我在工作之余写的一个软件渲染器

https://github.com/laomoi/toy-raster


核心渲染代码(src/core)不超过1000行, 目前渲染效果图如下:

![](head.png) 







