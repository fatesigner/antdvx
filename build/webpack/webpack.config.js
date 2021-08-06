/**
 * webpack.config
 */

const os = require('os');
const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');
const HappyPack = require('happypack');
const portfinder = require('portfinder');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { VueLoaderPlugin } = require('vue-loader/dist/index');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const tailwindcss = require('tailwindcss');

// const WebpackExternalEntryPlugin = require('./plugins/webpack-external-entry-plugin');
const WebpackCleanTerminalPlugin = require('./plugins/webpack-clean-terminal-plugin');
const WebpackHtmlEmbedSourcePlugin = require('./plugins/webpack-html-embed-source-plugin');

const Utils = require('../utils');

module.exports = async function (getOptions) {
  // 运行 dotenv 任务，加载环境变量
  const dotenvs = require('../tasks/dotenv');
  const env = require('../env')();

  const options = getOptions();

  const isProd = Utils.isProd();
  const isDevServer = process.argv.some((v) => v.includes('--hot')) && process.argv.some((v) => v.includes('serve'));

  const localIdentNameSet = Utils.createRandomIdentGetter(5, true);
  const urlLoaderSet = Utils.createRandomIdentGetter(5);

  const loaders = {
    cssExtract: {
      esModule: false,
      publicPath: '../'
    },
    css: {
      importLoaders: 1,
      modules: false,
      sourceMap: false
    },
    css_modules: {
      importLoaders: 1,
      modules: {
        // namedExport: true,
        // exportLocalsConvention: 'camelCaseOnly',
        localIdentContext: env.srcPath,
        // localIdentName: '[name]-[local]-[hash:base64:5]',
        // localIdentName: '[local]-[hash:base64:5]',
        /* getLocalIdent: (context, localIdentName, localName, options) => {
          return localIdentName.replace('-src', '').toLowerCase();
        } */
        getLocalIdent(context, localIdentName, localName) {
          return `${localName}-${localIdentNameSet(context.resourcePath + localName).toLowerCase()}`;
        }
      },
      sourceMap: false
    },
    less: _.merge(
      {
        lessOptions: {
          strictMath: false,
          noIeCompat: true,
          javascriptEnabled: true,
          modifyVars: null
        }
      },
      options.less
    ),
    sass: _.merge(
      {
        implementation: require('sass'),
        additionalData: ''
      },
      options.sass
    ),
    postcss: _.merge(
      {
        postcssOptions: {
          plugins: [tailwindcss, autoprefixer]
        }
      },
      options.postcss
    ),
    image: {
      test: ['gif', 'jpg', 'jpeg', 'png', 'ico'],
      mozjpeg: {
        quality: 65,
        progressive: true
      },
      gifsicle: {
        interlaced: false
      },
      // optipng.enabled: false will disable optipng
      optipng: {
        enabled: true,
        optimizationLevel: 7
      },
      pngquant: {
        quality: [0.65, 0.9],
        speed: 4
      },
      // the webp option will enable WEBP
      webp: {
        quality: 75
      }
    },
    ts: {
      // 禁用 Typescript 类型检查，只做转译，仅删除掉类型注释，可提升编译速度
      transpileOnly: false,
      experimentalWatchApi: true,
      // 使用 happyPackMode 模式加速编译，并减少 Webpack 报告的错误
      happyPackMode: true,
      // tsconfig.json 文件路径
      configFile: path.join(env.rootPath, 'tsconfig.json'),
      appendTsSuffixTo: [/\.vue$/],
      appendTsxSuffixTo: [/\.vue$/]
    },
    url: {
      esModule: false,
      test: ['eot', 'otf', 'svg', 'swf', 'ttf', 'woff', 'woff2', 'xap', 'cur', 'pdf'],
      limit: 1,
      publicPath: '',
      outputPath: '',
      /**
       * 将 node_modules 的文件 转移到指定目录
       * @param path
       * @returns {string}
       */
      name: (path) => {
        const pathArr = Utils.getNodeModulesRegexPath('', path);
        if (pathArr && pathArr.length) {
          // console.log('url pathArr', JSON.stringify(pathArr));
          const packageDir = pathArr[0];
          // 将长路径转换成 hash
          // const s = pathArr.join('/');
          const _hash = urlLoaderSet();
          return `packages/${packageDir}/[name].${_hash}.${isProd ? '[hash:' + 12 + '].' : ''}[ext]`;
        }
        return `[path][name].${isProd ? '[hash:' + 12 + '].' : ''}[ext]`;
      }
    },
    vue: null
  };

  const config = {
    mode: process.env.NODE_ENV,
    context: env.srcPath,
    cache:
      options.cache ??
      (isProd
        ? false
        : {
            type: 'filesystem',
            allowCollectingMemory: !isProd,
            buildDependencies: {
              config: [__filename, path.join(env.rootPath, '.browserslistrc'), path.join(env.rootPath, 'webpack.config.js')]
            },
            name: ''
          }),
    performance: {
      hints: 'warning',
      maxEntrypointSize: 2 * 1024 * 1024 * 1024,
      maxAssetSize: 2 * 1024 * 1024 * 1024
    }
  };

  // Entry
  config.entry = options.entry;

  // Output
  if (isProd) {
    config.output = {
      // Keep these assets under 'ignored/dir'.
      clean: {
        keep(asset) {
          return asset.includes('ignored/dir');
        }
      },
      pathinfo: false,
      publicPath: options.publicPath ?? '',
      filename: 'js/[name].[contenthash].js',
      chunkFilename: 'js/chunk-[name].[contenthash].js',
      path: options.outputPath,
      environment: {
        arrowFunction: false,
        destructuring: false
      }
    };
  } else {
    config.devtool = 'eval-source-map';
    config.output = {
      filename: 'js/[name].js',
      publicPath: options.publicPath ?? '/',
      chunkFilename: 'js/chunk-[name].js',
      hotUpdateChunkFilename: '[id].hot-update.js',
      path: options.outputPath,
      devtoolFallbackModuleFilenameTemplate: 'webpack:///[resource-path]?[hash]',
      devtoolModuleFilenameTemplate(info) {
        // const isJs = /\.js(x)?$/.test(info.resource);
        // const isTs = /\.ts(x)?$/.test(info.resource);
        // const isScript = /type=script/.test(info.resource);
        const isVue = /\.vue/.test(info.resource);

        // 简化路径
        const resourcePath = info.resourcePath.replace(/^(\.+[\/\\]+)+/g, '');
        if (fs.existsSync(path.join(config.context, info.resourcePath))) {
          if (isVue && info.resource !== info.resourcePath) {
            return `webpack-internal:///${resourcePath}`;
          } else {
            return `webpack-generated:///${resourcePath}`;
          }
        } else {
          // 不存在的文件
          return `webpack-internal:///${resourcePath}`;
        }
      }
    };
  }

  // The default target default is web
  config.target = isProd ? 'browserslist' : 'web';

  // rules
  config.module = {
    rules: [
      {
        test: /\.css$/,
        oneOf: [
          // 这里匹配 `<style module>`
          {
            resourceQuery: /module/,
            use: [
              isDevServer
                ? {
                    loader: 'style-loader'
                  }
                : {
                    loader: MiniCssExtractPlugin.loader,
                    options: loaders.cssExtract
                  },
              {
                loader: 'css-loader',
                options: loaders.css_modules
              },
              {
                loader: 'postcss-loader',
                options: loaders.postcss
              }
            ]
          },
          {
            use: [
              isDevServer
                ? {
                    loader: 'style-loader'
                  }
                : {
                    loader: MiniCssExtractPlugin.loader,
                    options: loaders.cssExtract
                  },
              {
                loader: 'css-loader',
                options: loaders.css
              },
              {
                loader: 'postcss-loader',
                options: loaders.postcss
              }
            ]
          }
        ]
      },
      {
        test: /\.s[a|c]ss$/,
        oneOf: [
          // 这里匹配 `<style module>`
          {
            resourceQuery: /module/,
            use: [
              isDevServer
                ? {
                    loader: 'style-loader'
                  }
                : {
                    loader: MiniCssExtractPlugin.loader,
                    options: loaders.cssExtract
                  },
              {
                loader: 'css-loader',
                options: loaders.css_modules
              },
              {
                loader: 'postcss-loader',
                options: loaders.postcss
              },
              {
                loader: 'sass-loader',
                options: loaders.sass
              }
            ]
          },
          {
            use: [
              isDevServer
                ? {
                    loader: 'style-loader'
                  }
                : {
                    loader: MiniCssExtractPlugin.loader,
                    options: loaders.cssExtract
                  },
              {
                loader: 'css-loader',
                options: loaders.css
              },
              {
                loader: 'postcss-loader',
                options: loaders.postcss
              },
              {
                loader: 'sass-loader',
                options: loaders.sass
              }
            ]
          }
        ]
      },
      {
        test: /\.less$/,
        oneOf: [
          // 这里匹配 `<style module>`
          {
            resourceQuery: /module/,
            use: [
              isDevServer
                ? {
                    loader: 'style-loader'
                  }
                : {
                    loader: MiniCssExtractPlugin.loader,
                    options: loaders.cssExtract
                  },
              {
                loader: 'css-loader',
                options: loaders.css_modules
              },
              {
                loader: 'postcss-loader',
                options: loaders.postcss
              },
              {
                loader: 'less-loader',
                options: loaders.less
              }
            ]
          },
          {
            use: [
              isDevServer
                ? {
                    loader: 'style-loader'
                  }
                : {
                    loader: MiniCssExtractPlugin.loader,
                    options: loaders.cssExtract
                  },
              {
                loader: 'css-loader',
                options: loaders.css
              },
              {
                loader: 'postcss-loader',
                options: loaders.postcss
              },
              {
                loader: 'less-loader',
                options: loaders.less
              }
            ]
          }
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.ts(x)?$/,
        use: 'happypack/loader?id=js'
      },
      {
        test: /\.js(x)?$/,
        exclude: [/\bcore-js\b/, /\bwebpack\/buildin\b/, /\b@babel\/runtime-corejs3\b/],
        use: 'happypack/loader?id=js'
      },
      {
        test: (function () {
          const exts = loaders.image.test;
          return new RegExp(`\\.(${exts.join('|')})\\??.*$`);
        })(),
        use: {
          loader: 'url-loader',
          options: _.merge({}, loaders.url, {
            // 2kb 以内转换成 base64
            limit: 2 * 1024
          })
        }
      },
      {
        test: (function () {
          const exts = loaders.url.test;
          return new RegExp(`\\.(${exts.join('|')})\\??.*$`);
        })(),
        use: {
          loader: 'url-loader',
          options: loaders.url
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024
          }
        }
      }
    ]
  };

  // resolve
  config.resolve = {
    alias: _.merge(
      {
        '@': env.srcPath
      },
      options.alias
    ),
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.scss', '.vue']
  };

  // optimization
  config.optimization = {
    // chunkIds: 'named',
    runtimeChunk: 'single',
    mergeDuplicateChunks: true,
    usedExports: true,
    minimizer: [],
    splitChunks: {
      // 分割参数权重排序 maxInitialRequest < maxAsyncRequests < maxSize < minSize
      // 选择哪些块进行优化。如果提供一个字符串，可能的值是 initial(初始块)、async(按需加载块)、all(默认，全部块)。
      // 提供 all 更强大，因为这意味着即使在异步和非异步块之间也可以共享块。
      chunks: 'all',
      // 被拆分的 chunk 的最小大小（byte），小于该值的 chunk 不会被拆分（对于按需引入的 chunk 无效，因为无论在什么情况下，按需引入的部分都会被拆分出来）
      minSize: 5 * 1024,
      // 被拆分的 chunk 的最大大小（byte），大于该值的 chunk 将会被拆分成更小的部分
      maxSize: 200 * 1024,
      // 分割前必须共享模块的最小块数
      minChunks: 1,
      // 按需加载时的最大并行请求数
      maxAsyncRequests: 20,
      // 入口点处的最大并行请求数
      maxInitialRequests: 20,
      // 打包分隔符，若改为'-'则分离后的js默认命名规则为[来源]-[入口key].js
      automaticNameDelimiter: '~',
      // 拆分块的名称，此选项可接受函数，默认 true, 由 chunk和 hash 值自动生成，
      // 当存在匹配的缓存组时，命名使用缓存组中的 name 值，若不在则为[来源]~[入口key].js
      name: false,
      cacheGroups: _.merge(
        {
          // 优先抽取出 node_modules 模块，无论其是否为公有代码
          defaultVendors: {
            // 缓存组优先级，当需要优先匹配缓存组的规则时，priority 需要设置为正数，当需要优先匹配默认设置时，缓存组需设置为负数，0为两者分割线
            priority: -10,
            // 表示是否使用已有的 chunk，如果为 true 则表示如果当前的 chunk 包含的模块已经被抽取出去了，那么将不会重新生成新的。
            reuseExistingChunk: true,
            // 正则规则验证，如符合就提取 chunk 放入当前缓存组，值可以是 function、boolean、string、RegExp，默认为空
            test: /[\\/]node_modules[\\/]/
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
        // 将指定的 package 拆分为独立的块
        /* Object.keys(options?.splitChunks ?? []).reduce(
          (prev, name) => {
            prev.groups[name] = {
              priority: (prev.priority += 10),
              reuseExistingChunk: true,
              test: options.splitChunks[name]
            };
            return prev;
          },
          {
            priority: 0,
            groups: {}
          }
        ).groups */
      )
    }
  };

  // plugins
  config.plugins = [
    new webpack.DefinePlugin({
      ...Object.keys(dotenvs).reduce((prev, key) => {
        prev[`process.env.${key}`] = JSON.stringify(dotenvs[key]);
        return prev;
      }, {}),
      __VUE_OPTIONS_API__: JSON.stringify(true),
      __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
      __INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false)
    }),
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin(
      _.merge(
        {
          baseHref: options.baseHref ?? '/',
          template: options.template,
          title: process.env.APP_TITLE,
          url: process.env.APP_WEBHOST
        },
        options?.plugins?.HtmlWebpackPlugin
      )
    ),
    new MiniCssExtractPlugin({
      filename: isProd ? 'css/[name].[contenthash].css' : 'css/[name].css',
      chunkFilename: isProd ? 'css/chunk-[name].[contenthash].css' : 'css/chunk-[name].css',
      ignoreOrder: true
    }),
    new HappyPack({
      id: 'js',
      threads: 4,
      debug: false,
      verbose: false,
      verboseWhenProfiling: false,
      threadPool: happyThreadPool,
      loaders: [
        {
          loader: 'babel-loader'
        }
      ]
    }),
    new VueLoaderPlugin(),
    new ForkTsCheckerWebpackPlugin({
      // async: true,
      typescript: {
        extensions: {
          vue: {
            enabled: true,
            compiler: '@vue/compiler-sfc'
          }
        },
        diagnosticOptions: {
          semantic: true,
          syntactic: true
        },
        vue: true,
        configFile: loaders.ts.configFile
      }
    }),
    new CopyWebpackPlugin(options?.plugins?.CopyWebpackPlugin),
    new WebpackHtmlEmbedSourcePlugin(options?.plugins?.WebpackHtmlEmbedSourcePlugin),
    // new WebpackExternalEntryPlugin(options?.plugins?.WebpackExternalEntryPlugin),
    new WebpackCleanTerminalPlugin(),
    // 排除 moment.js 的 locale 文件，以减少生成的包体积
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn$/),
    // 使用 dayjs 替代  moment.js
    new AntdDayjsWebpackPlugin({
      preset: 'antdv3'
    })
  ];

  if (isProd) {
    config.optimization.minimizer.push(new CssMinimizerPlugin());
    config.optimization.minimizer.push(
      new TerserPlugin({
        parallel: true,
        // 若为 true，将会生成一个 app.js.LICENSE.txt 文件，以存储特定格式的注释，规避法律问题
        extractComments: true,
        terserOptions: {
          // ecma: 8,
          warnings: false,
          parse: {},
          sourceMap: false,
          output: {
            // 美化输出
            beautify: false,
            // 是否保留注释 默认为 true
            comments: false,
            quote_keys: false,
            quote_style: 1
          },
          compress: {
            arrows: false,
            collapse_vars: false,
            comparisons: false,
            computed_props: false,
            hoist_funs: false,
            hoist_props: false,
            hoist_vars: false,
            inline: false,
            loops: false,
            negate_iife: false,
            properties: false,
            reduce_funcs: false,
            reduce_vars: false,
            switches: false,
            toplevel: false,
            typeofs: false,
            booleans: true,
            if_return: true,
            sequences: true,
            unused: true,
            conditionals: true,
            dead_code: true,
            evaluate: true
          }
        }
      })
    );
  }

  if (isDevServer) {
    let port;
    // Find available port.
    await portfinder
      .getPortPromise({
        port: options?.devServer?.port ?? 8080,
        stopPort: 65535
      })
      .then((_port) => {
        port = _port;
      })
      .catch((err) => {
        throw err;
      });
    config.devServer = _.merge(
      {
        host: 'localhost',
        open: true,
        hot: true,
        quiet: true,
        hotOnly: true,
        compress: true,
        progress: false,
        noInfo: true,
        // stats: 'errors-only',
        stats: {
          colors: true,
          errors: true,
          errorDetails: true,
          warnings: true,
          hash: false,
          version: false,
          timings: false,
          assets: false,
          chunks: false,
          modules: false,
          reasons: false,
          children: false,
          source: false,
          outputPath: false,
          publicPath: false
        },
        clientLogLevel: 'info',
        // clientLogLevel: 'silent',
        disableHostCheck: true,
        overlay: {
          warnings: false,
          errors: true
        }
      },
      options.devServer,
      {
        port
      }
    );
  } else {
    config.plugins.push({
      apply: (compiler) => {
        compiler.hooks.done.tap('EmitDoneWebpackPlugin ', (stats) => {
          // const hasWarnings = stats.hasWarnings();
          const hasErrors = stats.hasErrors();
          if (hasErrors) {
            options?.hooks?.failed();
          } else {
            options?.hooks?.done();
          }
        });
      }
    });

    config.plugins.push(new WebpackManifestPlugin());

    config.plugins.push(
      new BundleAnalyzerPlugin({
        // static | server
        analyzerMode: 'static',
        analyzerHost: '127.0.0.1',
        analyzerPort: 9018,
        reportFilename: '_BundleAnalyzerPlugin.html',
        defaultSizes: 'parsed',
        openAnalyzer: false,
        generateStatsFile: false,
        statsFilename: 'stats.json',
        logLevel: 'info'
      })
    );
  }

  return config;
};
