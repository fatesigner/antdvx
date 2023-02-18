/**
 * webpack.config
 */

const path = require('path');

const { SRC_PATH, OUTPUT_PATH } = require('./build/constants');
const webpackConfig = require('./build/webpack/webpack.config');

// 读取文件配置的环境变量
const ENV = require('./build/scripts/get-env')();

module.exports = webpackConfig({
  entry: {
    app: path.join(SRC_PATH, 'main.ts')
  },
  template: path.join(SRC_PATH, 'index.ejs'),
  outputPath: OUTPUT_PATH,
  publicPath: '',
  baseHref: '',
  less: {
    lessOptions: {
      strictMath: false,
      noIeCompat: true,
      javascriptEnabled: true
      // additionalData: '@import "~@/app/themes/default.less";'
      // modifyVars: require(path.join(SRC_PATH, 'app/themes/default.less'))
    }
  },
  sass: {
    implementation: require('sass')
    // additionalData: '@import "~@/app/themes/default.less";'
  },
  devServer: {
    // host: '0.0.0.0',
    host: 'localhost',
    port: 8080,
    open: true
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
    antdvx: path.join(SRC_PATH, 'antdvx'),
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
        /* {
          from: path.join(SRC_PATH, 'public'),
          to: ''
        }, */
        {
          from: path.join(SRC_PATH, 'assets/img/favicon.ico'),
          to: ''
        },
        {
          from: path.join(SRC_PATH, 'assets/img/logo.png'),
          to: ''
        }
      ]
    },
    WebpackExternalEntryPlugin: {
      entry: {}
    },
    HtmlWebpackPlugin: {
      minify: true,
      title: ENV.APP_TITLE,
      canonical: ENV.APP_TITLE
    },
    WebpackHtmlEmbedSourcePlugin: {
      prependHead: [
        // 将 ENV 写入 index.html
        {
          tagName: 'script',
          minify: true,
          content: `window.ENV = ${JSON.stringify(ENV, null, 2)};`
        },
        {
          tagName: 'style',
          minify: true,
          path: path.join(SRC_PATH, 'app/shared/splash-screen/dist/splash-screen.css')
        }
      ],
      prependBody: [
        {
          tagName: 'html',
          minify: true,
          path: path.join(SRC_PATH, 'app/shared/splash-screen/dist/splash-screen.html')
        },
        {
          tagName: 'script',
          minify: true,
          path: path.join(SRC_PATH, 'app/shared/splash-screen/dist/splash-screen.js')
        }
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
});
