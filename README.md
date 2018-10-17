[TOC]

## 框架设计
### 介绍
### 文件目录结构

```
├─build
│   └─build-icon.js // 用于icon生成
│   └─subproject-init.js // 用于拉取子项目
├─config
│   └─git-config.js // git账号配置
│   └─project-config.js // 需拉取的子项目
├─icon-font-svg // 生成字体原文件
├─node_modules // 第三方依赖包
├─projects
│  └─id // 子项目(id)
│  └─dashboard  // 子项目(dashboard)
├─public // 静态文件夹
│   └─favicon.ico // 网页图标
│   └─index.html // 主页面
└─src
    ├─assets
    │  └─custom-themes // 自定义主题样式
    │      └─common.scss // 公共样式
    │      └─common-variables.scss // 公共样式(含element变量)
    │      └─element-variables.scss // 自定义element-ui暴露出的变量样式：主题
    │      └─element-variables-2.scss // 自定义element-ui暴露出的变量样式：主题2
    │  └─icon-fonts // 存放icon生成后的文件
    ├─components // 公共功能组件
    ├─config
    │  └─interceptor.js // axios拦截器配置
    ├─plugins
    │  └─element.js // 引入element-ui @vue/cli3 vue add element
    ├─router
    │  └─index.js // 全局路由入口
    │  └─project-router.js // 暴露出各子组件路，由 project-init自动生成
    └─store // 仓库
    │  └─modules // 各类store
    │  └─index.js // 管理全局组件状态
    │  └─project-store.js // 暴露各自项目仓库，由 project-init自动生成 
    └─utils
    │  └─i18n // 国际化文件
    │  └─index.js // 全局工具方法
    └─App.vue // 顶级父组件，渲染路径匹配到的视图组件
    └─main.js // 项目入口，Vue实例化，可引入全局配置
    ├─.env // @vue-cli 3根据定义mode不同加载不同文件，用于各环境请求配置
    ├─.env.test
    ├─.env.production
    ├─.env.production.local // 配置子项目引用，只存在于本地
    └─.gitignore // git提交忽略
    └─babel.config.js // babel预设配置 babel 7正式采用
    └─package.json // 项目配置信息，npm脚本命令，依赖包管理
    └─package-lock.json // npm5+ 执行npm install会自动生成，仅npm
    └─readme.md // 项目说明文档
    └─vue.config.js // 可选，可用于项目构建配置，配置在根目录会被
                       @vue/cli-service自动加载
```

## 准备

### 初始化项目
    npm install
### 引入子项目
    npm run project-init
    引子项目需要两个基本配置文件：git-config和project-config，前者是个人git账号，后者是
    整个子项目列表，对于开发者本地引入方式都在.env.development.local中配置，配置方式是：
    VUE_APP_GIT_ACCOUNT=["xxxx", "xxxxxx"]，VUE_APP_PROJECT_ID=dev
    
## 功能说明
   
### 生成icon图标
    原svg文件在顶层目录icon-font-svg文件下，npm run build-icon执行build/build-icon
    文件生成适用多种浏览器的字体文件，如eot、svg、ttf和woff，生成后的文件在src/assets/
    icon-fonts下，我们在main.js中引入icon.css文件

### 场景切换(dev, test...)
    在根目录中配置.env、.env.development、.env.test和.env.production等文件，在
    vue-cli-service命令中加入--mode [mode]就会根据各模式加载相应的.env.[mode]文件，
    .env文件是各环境通用配置。

### 国际化
    在utils文件下逐级配置各个国家、各组件、各模块文件，例如id系统国际化，配置在id.js中，
    在id.js文件中再配置id模块下各页面，如login、mine的对应参数
    
### 主题切换
    根据命名空间的不同进行主题切换。各命名空间类下@import各主题样式，状态中保存当前主题
    类，通过切换类名实现主题切换。
    
### 合并子项目的多语言文件
### 加载个性化多语言文件
=======
### 开发准备
#### 下载框架项目(FIXME)

#### 引入子项目(FIXME)
除核心的子项目模块必须引入之外, 可配置引入不同的子项目
具体请参考: 场景配置

### 前端开发规范
#### 代码规范(CSS, JS, HTML, VUE)
     CSS：
     1、全局样式在custom-theme/common.scss中添加修改，存在引用element-ui变量在common-variable.scss
     中添加，修改element-ui暴露的变量在element-variable.scss中
     2、Vue组件中style标签统一只写一对，并且标签lang="scss",加作用域scoped，需要改变子组件
     样式，用深度选择器/deep/
     3、scss文件名命名采用kebab-case形式
     4、样式类名遵循BEM思想:B__E_M
     VUE：
     1、组件命名采用大驼峰法，倾向于完整单词而非缩写
     2、组件命名为了避免与现在或以后冲突，且尽量用多个单词
     3、组件命名以高级别一般化的单词开头，以修饰词结尾，如：
         |- SearchButtonClear.vue
         |- SearchButtonQuery.vue
     4、和父组件紧密耦合的子组件用父组件作用前缀命名，如：
         |- TodoList.vue
         |- TodoListItem.vue
         |- TodoListItemButton.vue
     5、组件中props中参数命名用小驼峰法camelCase
     6、组件中引用组件多特性分行写，每个特性一行。如：
        <MyComponent
          foo="a"
          bar="b"
          baz="c"
        />
     7、组件中指令缩写统一：
         v-on: @
         v-bind: :
     8、为v-for设置唯一的键值：key
     9、v-for和v-if不要用于同一个元素，对渲染是一种浪费
     JS:
     1、文件命名采用kebab-case形式
     HTML:
     1、文件命名采用kebab-case形式
     2、DOM模板中不要使用自闭合组件：<my-components/>
     3、DOM模板中组件kebab-case格式：<my-components></my-components>
#### 文件命名规范
     1、尽量语义化
     2、文件或文件夹命名都用kebab-case格式
#### 功能开发规范
#### 接口规范

### 配置文件管理(FIXME)
    使用全局统一的配置文件


### 场景配置(场景切换 FIXME)

### 功能说明

#### 主题切换

#### 使用自定义图标(FIXME)

#### 多语言设置(FIXME)
- 合并各子项目的多语言文件
多语言项的生效优先级
```
PAGECUSTOM.FIELD > PAGE.FIELD > SUBMODULE.FIELD > MAIN.FIELD
```

#### 统一的事件传播机制(上报, 分发)
     父子组件事件传播：子组件$emit，父组件$on监听子组件触发事件，再处理；
     非父子组件传播：定义一个Vue实例总线对象，在不同组件间通过该实例化总线对象$emit和$on，如：
     在各单据页面进行保存提交触发事件，在驾驶舱、待审单据和已审单据等各列表页监听后刷新获取最新
     列表

#### 统一的工具方法
     都维护在@/utils/index.js中，在main.js添加到Vue.prototype上，是Vue实例方法，直接调用

#### 前端存储设计
     用到的存储方式：浏览器存储sessionStorage和Vuex状态管理store
     sessionStorage: token
     store: 用户信息、主题参数、数据字典和国际化信息
