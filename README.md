# React实战之全球新闻发布系统

> 如果觉得不错，或者对你有帮助，点一个star

### 1.1. 项目简介

使用React编写的后台管理系统，接口来源db文见夹下的db.json。

项目已经完成功能如下：（你可以下载下来自己体验一下）

* 用户管理
* 权限管理
* 新闻管理
* 审核管理
* 发布管理

用户管理：

* 显示用户列表
* 对用户的修改权限和删除

![](C:\Users\ASUS\Desktop\imgs\user.jpg)

权限管理：

* 用户权限的修改

  ![](C:\Users\ASUS\Desktop\imgs\quxian.jpg)







### 1.2. 项目规范

**项目规范：项目中有一些开发规范和代码风格**

* 1.文件夹、文件名称统一小写、多个单词以连接符（-）连接；
* 2.JavaScript变量名称采用小驼峰标识，常量全部使用大写字母，组件采用大驼峰；
* 3.CSS采用普通CSS和styled-component结合来编写（全局采用普通CSS、局部采用styled-component）;
* 4.整个项目不再使用class组件，统一使用函数式组件，并且全面使用Hooks；
* 5.所有的函数式组件，为了避免不必要的渲染，全部使用memo进行包裹；
* 7.函数组件内部基本按照如下顺序编写代码：
  * 组件内部state管理；
  * redux的hooks代码；
  * 其他组件hooks代码；
  * 其他逻辑代码；
  * 返回JSX代码；
* 9.网络请求采用axios
  * 对axios进行二次封装；
  * 所有的模块请求会放到一个请求文件中单独管理；
* 10.项目使用AntDesign
  * 项目中某些AntDesign中的组件会被拿过来使用；
* 其他规范在项目中根据实际情况决定和编写；



### 1.3. 项目运行

clone项目：

```
git clone https://github.com/longmao520/react-system.git
```

安装项目依赖：

```shell
npm install
```

项目运行：

```shell
npm start
```

后台启动:(在db文件夹下启动)

```
json-server --watch db.json --port 5000
```

