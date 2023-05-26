/**
 * babel.config（js 代码转换配置）
 * node_module
 * npm i -D @babel/core @babel/preset-env @babel/plugin-transform-runtime @babel/runtime-corejs3
 *
 * @babel/plugin-transform-runtime 主要作用是将 helper 和 polyfill 都改为从一个统一的地方引入，且引入的对象和全局变量是完全隔离的
 * 1、避免因引入 polyfill 而带来的全局变量被污染的副作用
 * 2、避免生成重复的 helper 函数
 * 支持 jsx
 * react：需安装 @babel/preset-react @babel/plugin-transform-react-jsx
 * vue：  需安装 @vue/babel-preset-jsx
 */

module.exports = {
  compact: false,
  sourceType: 'unambiguous',
  presets: [
    [
      '@babel/preset-env',
      {
        spec: false,
        loose: false,
        modules: false,
        debug: false,
        include: [],
        exclude: [],
        // 指示 babel 如何处理 api
        useBuiltIns: 'usage',
        corejs: {
          // 使用的 core-js 版本，推荐使用 v3
          version: 3,
          // 是否注入 proposal polyfill
          proposals: true
        },
        forceAllTransforms: false,
        ignoreBrowserslistConfig: false,
        shippedProposals: false
      }
    ],
    ['@babel/preset-typescript', { isTSX: true, allExtensions: true }]
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: false,
        helpers: true,
        regenerator: false,
        useESModules: false,
        absoluteRuntime: false
      }
    ],
    'babel-plugin-transform-typescript-metadata',
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true
      }
    ],
    [
      '@babel/plugin-proposal-class-properties',
      {
        /**
         * 指示编译类属性时，使用赋值表达式（loose: false）或者 Object.defineProperty（loose: true）
         */
        loose: false
      }
    ],
    ['@babel/plugin-proposal-object-rest-spread'],
    /* [
      'import',
      {
        libraryName: 'ant-design-vue',
        libraryDirectory: 'es',
        style: true
      }
    ], */
    ['@babel/plugin-proposal-private-methods', { loose: false }],
    '@vue/babel-plugin-jsx'
  ]
};
