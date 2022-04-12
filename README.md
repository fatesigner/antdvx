# antdvx

[![npm][npm-image]][npm-url]
[![download][download-image]][download-url]
[![commitizen][commitizen-image]][commitizen-url]

[npm-image]: https://img.shields.io/npm/v/antdvx.svg?style=for-the-badge
[npm-url]: https://npmjs.com/package/antdvx
[download-image]: https://img.shields.io/npm/dw/antdvx.svg?style=for-the-badge
[download-url]: https://npmjs.com/package/antdvx
[commitizen-image]: https://img.shields.io/badge/commitizen-friendly-green.svg?style=for-the-badge
[commitizen-url]: http://commitizen.github.io/cz-cli/

### ant design + typescript + vue3
> 基于 ant design vue 的 Vue3 组件库，包含一些通用模板和服务。

## 安装

```bash
npm i -S antdvx
```

## 示例 [online](https://antdvx.repository.fatesigner.com/)
```vue
<template>
  <XButton size="small" @click="onClick">button</XButton>
</template>

<script lang="ts">
import { XButton } from '@/antdvx';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { XButton },
  setup(){
    const onClick = () => {
      console.log('button click.');
    };
    
    return {
      onClick
    };
  }
});
</script>
```

## 详细文档，待完善...

## Project setup
```
npm install
```

## Compiles and hot-reloads for development
```
npm start
```

## Compiles and minifies for production
```
npm run build
```

## Lints and fixes files
```
npm run lint
```

## 项目结构
``` bash
├── .github                                  // github actions
├── .husky                                   // husky 钩子，用于 lint 和 git 消息提交规范
│   ├── commit-msg                           // 验证 git 提交的消息规范
│   └── pre-commit                           // 提交消息前，执行 lint-staged
├── build                                    // build 目录，放置打包、编译的脚本
│   ├── scripts                              // 构建脚本
│   │   ├── env-cmd.js                       // 读取 .env 文件并加载环境变量至 process.env 中
│   │   └── from-env.js                      // 读取 .env 文件并导出环境变量
│   ├── tasks                                // Gulp 任务
│   │   ├── api.js                           // 生成 api 目录，使用 openapi-generator
│   │   ├── clean.js                         // 清空 dist 目录
│   │   ├── webpack.js                       // 运行 webpack
│   │   └── webpack-inspect.js               // 生成当前 webpack 配置的 json 文件，用于 webpack 调试
│   ├── utils                                // 放置一些工具函数
│   │   ├── colors.js                        // 颜色的格式化
│   │   ├── index.js                         // 通用工具函数
│   │   └── output.js                        // 格式化输出
│   ├── webpack                              // webpack
│   │   ├── plugins                          // webpack 本地插件
│   │   └── webpack.config.js                // webpack 配置
│   ├── constants.js                         // 定义用于 build 的常量
│   └── gulpfile.js                          // 管理 gulp 任务
├── coverage                                 // 执行测试后生成的代码覆盖率信息
├── src                                      // 项目源代码
│   ├── api                                  // Api 接口，可使用 openapi-generator 生成此目录
│   ├── app                                  // 应用的组件、模块及服务 
│   │   ├── core                             // 包含应用所需要的核心组件、模块及服务
│   │   │   ├── constants.ts                 // 全局常量
│   │   │   ├── event.ts                     // 全局事件
│   │   │   ├── inversify.ts                 // IOC 容器，注入依赖
│   │   │   ├── pipes.ts                     // 通用过滤器
│   │   │   ├── services.ts                  // 从 IOC 容器中获取服务实例
│   │   │   │   ├── auth.service.ts          // 授权服务，指定当前 App 路由的授权逻辑
│   │   │   │   ├── http.service.ts          // Http 服务，基于 Axios
│   │   │   │   ├── session.service.ts       // 用户信息管理服务，用于保存当前登录用户的信息
│   │   │   │   └── storage.service.ts       // 客户端持久化缓存服务（localstorage）
│   │   │   └── store.ts                     // 全局状态容器
│   │   ├── i18n                             // 国际化配置
│   │   │   ├── locales
│   │   │   │   ├── en-US.ts                 // 英语                    
│   │   │   │   └── zh-CN.ts                 // 中文
│   │   │   ├── startup.ts
│   │   │   └── messages.ts                  // 定义全局国际化字符串
│   │   ├── layout                           // 放置 layout（母版页）
│   │   │   ├── layout-sidebar               // 包含侧边栏的 layout
│   │   │   │   ├── components               // 组件
│   │   │   │   ├── layout-sidebar.vue
│   │   │   │   └── store.ts                 // store
│   │   │   ├── layout-empty.vue             // 空 layout（不包含任何组件，可用于登录、报表等界面的展示）
│   │   │   └── layout-exception.vue         // 显示异常的 layout（可用于界面出错后的展示）
│   │   ├── plugins                          // 放置组件库的配置（初始化）代码，将在 main.ts 中使用 app.use 引入
│   │   │   ├── antdvx
│   │   │   │   ├── icons                    // 自定义图标
│   │   │   │   ├── antdvx.less              // 导入 antdvx 样式库或者覆盖部分样式
│   │   │   │   └── startup.ts                 // 配置 antdvx，比如 notification 的 duration 参数
│   │   │   ├── tailwindcss                  // tailwindcss
│   │   │   │   ├── tailwindcss.config.js    // 配置 tailwindcss 插件
│   │   │   │   └── tailwindcss.less         // 导入 tailwindcss 模块
│   │   │   ├── vee-validate                 // 配置 vee-validate
│   │   │   │   ├── rules                    // 自定义验证规则
│   │   │   │   ├── startup.ts
│   │   │   │   └── vee-validate.less        // 配置 invalid 状态的样式
│   │   │   └── dayjs.ts                     // dayjs 配置，可在此指定当前 App 语言切换后，dayjs 的处理逻辑
│   │   ├── shared                           // 放置本地的一些通用组件
│   │   ├── styles                       
│   │   │   └── index.less                   // 全局样式 
│   │   ├── types                            // 接口、类型文件
│   │   │   ├── shims                        // 第三方模块                        
│   │   │   ├── env.ts                       // 环境变量
│   │   │   ├── menu.ts                      // 菜单
│   │   │   ├── router.ts                    // 路由
│   │   │   └── user.ts                      // 用户信息
│   │   ├── utils                            // 全局工具函数
│   │   └── views                            // 视图（路由）
│   │   │   ├── passport
│   │   │   │   ├── login-generic            // 登录页面
│   │   │   ├── auth                         // 授权模块
│   │   │   │   ├── menus                    // 菜单配置界面
│   │   │   │   ├── roles                    // 权限清单界面
│   │   │   │   ├── users                    // 用户清单界面
│   │   │   └── portal                       // 应用启动入口（起始页）
│   │   │   │   └──portal.vue
│   │   │   │
│   │   ├── app                              // app 根组件
│   │   └── router                           // 路由表及配置
│   ├── assets                               // 放置静态资源（image、json、font）
│   ├── envs                                 // 环境变量
│   │   ├── .env                             // 默认环境变量，可被覆盖
│   │   ├── .env.development                 // 开发环境变量
│   │   ├── .env.production                  // 生产环境变量
│   │   └── .env.test                        // 测试环境变量
│   ├── index.ejs                            // 入口 html
│   └── main.ts                              // 初始化、挂载 App
├── tests                                    // tests
│   └── main.spec.ts
├── .browserslistrc                          // 定义目标浏览器配置，可在不同前端工具之间共享
├── .cz-config.js                            // 定义 git 提交消息的类型
├── .editorconfig                            // 定义编辑代码时的风格（缩进）
├── .eslintignore                            // ESLint 忽略特定的文件和目录
├── .eslintrc.js                             // ESLint 配置
├── .npmignore                               // NPM 忽略特定的文件和目录
├── .npmrc                                   // NPM 配置下载源、是否忽略lock文件、日志类型
├── babel.config.js                          // Babel 配置
├── babel.test.config.js                     // Babel 配置（用于 test）
├── commitlint.config.js                     // commitlint 配置，定义 git 提交规范
├── jest.config.js                           // Jest 配置（测试）
├── jsconfig.json                            // 指定项目上下文以及 JavaScript 语言服务提供的功能选项（指定 alias、增强 IDE 提示）
├── lint-staged.config.js                    // 定义代码格式检查规范
├── package.json                             // 当前项目信息清单
├── postcss.config.js                        // postcss 配置
├── README.md                                // 当前项目文档 
├── stylelint.config.js                      // style 样式规范
├── tailwind.config.js                       // tailwindcss 配置
├── tsconfig.json                            // typescript 配置
├── tsconfig.test.json                       // typescript test 配置
└── webpack.config.js                        // webpack 配置
```
