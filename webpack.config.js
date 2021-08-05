/**
 * webpack.config
 */

const Path = require('path');
const Fs = require('fs');

const env = require('./build/env')();
const webpackConfig = require('./build/webpack/webpack.config');

module.exports = webpackConfig(function () {
  return {
    entry: {
      app: Path.join(env.srcPath, 'main.ts')
    },
    template: Path.join(env.srcPath, 'index.ejs'),
    outputPath: Path.join(env.rootPath, 'example'),
    publicPath: '',
    baseHref: '',
    less: {
      lessOptions: {
        strictMath: false,
        noIeCompat: true,
        javascriptEnabled: true,
        modifyVars: require(Path.join(env.srcPath, 'theme/antdv.theme'))
      }
    },
    sass: {
      implementation: require('sass'),
      additionalData: '@import "~@/theme/default.theme.scss";'
    },
    devServer: {
      // host: '0.0.0.0',
      host: 'localhost',
      port: 8080,
      open: true,
      https: {
        key: Fs.readFileSync('D:\\OneDrive\\ECS\\Windows\\localhost-key.pem'),
        cert: Fs.readFileSync('D:\\OneDrive\\ECS\\Windows\\localhost.crt'),
        ca: Fs.readFileSync('D:\\OneDrive\\ECS\\Windows\\localhost.pem')
      }
      /* proxy: {
        '/api': {
          target: 'http://localhost:8081',
          changeOrigin: true,
          pathRewrite: {
            '^/api': ''
          }
        }
      }, */
    },
    alias: {
      // vue$: 'vue/dist/vue.esm-bundler.js',
      vue$: 'vue/dist/vue.runtime.esm-bundler.js',
      'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
    },
    splitChunks: {
      axios: /[\\/]node_modules[\\/]_?axios[\\/](.*)/,
      corejs: /[\\/]node_modules[\\/]_?core-js[\\/](.*)/,
      crypto: /[\\/]node_modules[\\/]_?crypto-js[\\/](.*)/,
      fatesigner: /[\\/]node_modules[\\/]_?@fatesigner[\\/](.*)/,
      echarts: /[\\/]node_modules[\\/]_?echarts[\\/](.*)/,
      exceljs: /[\\/]node_modules[\\/]_?exceljs[\\/](.*)/,
      html2canvas: /[\\/]node_modules[\\/]_?html2canvas[\\/](.*)/,
      moment: /[\\/]node_modules[\\/]_?moment[\\/](.*)/,
      lodash: /[\\/]node_modules[\\/]_?lodash[\\/](.*)/,
      antd: /[\\/]node_modules[\\/]_?@ant-design[\\/](.*)/,
      antdv: /[\\/]node_modules[\\/]_?ant-design-vue[\\/](.*)/,
      rxjs: /[\\/]node_modules[\\/]_?rxjs[\\/](.*)/,
      vuei18n: /[\\/]node_modules[\\/]_?vue-i18n[\\/](.*)/,
      'vue-router': /[\\/]node_modules[\\/]_?vue-router[\\/](.*)/,
      'vee-validate': /[\\/]node_modules[\\/]_?@?vee-validate[\\/](.*)/,
      vue: /[\\/]node_modules[\\/]_?@?vue[\\/](.*)/
    },
    plugins: {
      CopyWebpackPlugin: {
        patterns: [
          {
            from: Path.join(env.srcPath, 'assets/img/favicon.ico'),
            to: ''
          },
          {
            from: Path.join(env.srcPath, 'assets/img/logo.png'),
            to: ''
          }
        ]
      },
      WebpackExternalEntryPlugin: {
        entry: {}
      },
      WebpackHtmlEmbedSourcePlugin: {
        prependHead: [Path.join(env.srcPath, 'shared/splash-screen/dist/splash-screen.css')],
        prependBody: [
          Path.join(env.srcPath, 'shared/splash-screen/dist/splash-screen.html'),
          Path.join(env.srcPath, 'shared/splash-screen/dist/splash-screen.js')
        ],
        tests: [
          // 将 runtime.js 输出到 index.html
          /// [\\/]runtime.*.js$/,
          /// [\\/]runtime.*.js.map$/
        ]
      }
    },
    hooks: {
      done() {},
      failed() {}
    }
  };
});
