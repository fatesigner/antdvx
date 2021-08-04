/**
 * webpack-external-entry-plugin
 */

const _ = require('lodash');

const { fireWebpackPluginEvent, createRandomIdentGetter } = require('../../utils');

const hashChunk = createRandomIdentGetter(5);

const RE_CSS = /\.(c|le|sa|sc)ss$/;
const RE_JS_MAP = /\.js(|\.map)$/i;

const pluginOptions = {
  name: 'WebpackExternalEntryPlugin'
  // stage: Infinity
};

const events = {
  before: 'html-webpack-plugin-before-html-processing'
};

const hookEvents = {
  before: 'htmlWebpackPluginBeforeHtmlProcessing'
};

const externalEntry = {};
let externalChunks = [];
const deles = {};

const afterCompileHandler = function (compilation, callback) {
  try {
    // 筛选出 external chunks
    externalChunks = compilation.chunks.filter((chunk) => {
      return Object.prototype.hasOwnProperty.call(externalEntry, chunk.name);
    });
    compilation.chunks = compilation.chunks.filter((chunk) => {
      if (Object.prototype.hasOwnProperty.call(externalEntry, chunk.id)) {
        let hasCssFile = false;
        chunk.files.forEach((file) => {
          if (RE_CSS.test(file)) {
            hasCssFile = true;
          }
          if (RE_JS_MAP.test(file)) {
            deles[file] = true;
          }
        });
        if (!hasCssFile) {
          // 若无 css 文件输出，则删除整个 chunk
          return false;
        }
      }
      return true;
    });
  } catch (e) {
    console.warn(e);
    compilation.errors.push(e);
    callback();
  }
};

const emitHandler = function (compilation, callback) {
  try {
    externalChunks.forEach((chunk) => {
      // 删除 .js 或 .js.map 后缀的文件
      chunk.files = chunk.files.filter((file) => {
        if (RE_JS_MAP.test(file)) {
          delete compilation.assets[file];
          return false;
        }
        return true;
      });
    });
    callback();
  } catch (e) {
    console.warn(e);
    compilation.errors.push(e);
    callback && callback();
  }
};

// 更新 html-webpack-plugin 清单
const compilationHandler = function (events, compilation, callback) {
  try {
    fireWebpackPluginEvent(pluginOptions, events.before, compilation, function (pluginArgs) {
      pluginArgs.assets.js.forEach((file, index) => {
        if (Object.prototype.hasOwnProperty.call(deles, file)) {
          pluginArgs.assets.js.splice(index, 1);
        }
      });
    });
  } catch (e) {
    console.warn(e);
    compilation.errors.push(e);
    callback && callback();
  }
};

// 更新 webpack-manifest-plugin 清单
const updateManifestPlugin = function (compiler) {
  if (compiler.hooks.webpackManifestPluginAfterEmit) {
    compiler.hooks.webpackManifestPluginAfterEmit.tap(pluginOptions, (manifest) => {
      for (const v in manifest) {
        if (Object.prototype.hasOwnProperty.call(manifest, v)) {
          if (Object.prototype.hasOwnProperty.call(deles, manifest[v])) {
            delete manifest[v];
          }
        }
      }
    });
  }
};

// 更新入口
const amendEntry = function (entry, options) {
  if (typeof entry === 'function') {
    return (...args) => Promise.resolve(entry(...args)).then(amendEntry.bind(this));
  }

  // const seen = new Set();

  if (options.css) {
    Object.keys(options.css).forEach((v) => {
      externalEntry[v] = options.css[v];
      // seen.add(v);
    });
  }

  if (options.assets) {
    options.assets.forEach((v) => {
      externalEntry[hashChunk(v)] = v;
    });
  }

  if (typeof entry === 'string') {
    // return [entry].concat(this.entry);
    return _.merge(
      {},
      {
        main: entry
      },
      externalEntry
    );
  }
  if (Array.isArray(entry)) {
    // return [...entry, ...this.entry];
    return _.merge(
      {},
      {
        main: entry
      },
      externalEntry
    );
  }
  if (typeof entry === 'object') {
    return _.merge({}, entry, externalEntry);
  }

  throw new Error('Cannot parse webpack `entry` option');
};

module.exports = class WebpackExternalEntryPlugin {
  constructor(options) {
    // Default options
    this.options = options;
    // externalEntry = {};
  }

  apply(compiler) {
    // amend entry
    compiler.options.entry = amendEntry(compiler.options.entry, this.options);

    // support webpack 4
    if (compiler.hooks) {
      compiler.hooks.compilation.tap(pluginOptions, compilationHandler.bind(this, hookEvents));
      compiler.hooks.afterCompile.tap(pluginOptions, afterCompileHandler.bind(this));
      compiler.hooks.emit.tapAsync(pluginOptions, emitHandler.bind(this));
      // UpdateManifestPlugin.call(this, compiler);
    } else {
      compiler.plugin('compilation', compilationHandler.bind(this, events));
      compiler.plugin('after-compile', afterCompileHandler.bind(this));
      compiler.plugin('emit', emitHandler.bind(this));
    }
  }
};
