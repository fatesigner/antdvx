/**
 * webpack-html-embed-source-plugin
 */

const _ = require('lodash');
const Fs = require('fs-extra');
const cheerio = require('cheerio');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { fireWebpackPluginEvent, createRandomIdentGetter } = require('../../utils');

const hashChunk = createRandomIdentGetter(5);

const REG_CSS = /\.(c|le|sa|sc)ss$/;
const REG_JS = /\.js$/i;
const REG_JS_MAP = /\.js(|\.map)$/i;
const REG_HTML = /\.html$/i;

const externalEntry = {};
const removes = {};

const pluginOptions = {
  name: 'WebpackHtmlEmbedSourcePlugin'
  // stage: Infinity
};

// 动态更新入口
function amendEntry(entry) {
  if (typeof entry === 'function') {
    return (...args) => Promise.resolve(entry(...args)).then(amendEntry.bind(this));
  }

  if (this.options.externals) {
    this.options.externals.forEach((path) => {
      const hash = hashChunk(path);
      externalEntry[hash] = path;
    });
  }

  if (typeof entry === 'string') {
    return _.merge(
      {},
      {
        main: entry
      },
      externalEntry
    );
  }
  if (Array.isArray(entry)) {
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
}

function getInlineTag(publicPath, assets, tag) {
  if (tag.tagName === 'link') {
    if (tag.attributes && tag.attributes.href) {
      const href = publicPath ? tag.attributes.href.replace(publicPath, '') : tag.attributes.href;
      if (REG_CSS.test(href)) {
        if (this.options.tests.some((test) => href.match(test))) {
          const asset = assets[href];
          if (asset) {
            return { tagName: 'style', innerHTML: asset.source(), closeTag: true };
          }
        }
      }
    }
  } else if (tag.tagName === 'script') {
    if (tag.attributes && tag.attributes.src) {
      const src = publicPath ? tag.attributes.src.replace(publicPath, '') : tag.attributes.src;
      if (REG_JS.test(src)) {
        if (this.options.tests.some((test) => src.match(test))) {
          const asset = assets[src];
          if (asset) {
            return { tagName: 'script', innerHTML: asset.source(), closeTag: true };
          }
        }
      }
    }
  } else if (tag.tagName === 'html') {
    if (tag.attributes && tag.attributes.src) {
      const src = publicPath ? tag.attributes.src.replace(publicPath, '') : tag.attributes.src;
      if (REG_JS.test(src)) {
        if (this.options.tests.some((test) => src.match(test))) {
          const asset = assets[src];
          if (asset) {
            return { tagName: 'script', innerHTML: asset.source(), closeTag: true };
          }
        }
      }
    }
  }

  return tag;
}

async function updateHtmlTags(html, headTags, bodyTags, tagFunction) {
  if (headTags && this.options.head) {
    const files = [...this.options.head.prepend, ...this.options.head.append];
    for await (const file of files) {
      if (REG_CSS.test(file)) {
        const source = await Fs.readFileSync(file, 'utf8');
        headTags.push({
          tagName: 'style',
          innerHTML: source,
          closeTag: true
        });
      } else if (REG_JS.test(file)) {
        const source = await Fs.readFileSync(file, 'utf8');
        headTags.unshift({
          tagName: 'script',
          innerHTML: source,
          closeTag: true
        });
      }
    }
  }

  if (bodyTags && this.options.body) {
    const files = [...this.options.body.prepend, ...this.options.body.append];

    for await (const file of files) {
      if (REG_JS.test(file)) {
        const source = await Fs.readFileSync(file, 'utf8');
        bodyTags.unshift({
          tagName: 'script',
          innerHTML: source,
          closeTag: true
        });
      }
    }
  }

  if (html) {
    const $ = cheerio.load(html);
    const $body = $('body');

    for await (const file of this.options.body.prepend.slice().reverse()) {
      if (REG_HTML.test(file)) {
        if ($body) {
          const source = await Fs.readFileSync(file, 'utf8');
          $body.prepend(source);
        }
      }
    }

    for await (const file of this.options.body.append) {
      if (REG_HTML.test(file)) {
        if ($body) {
          const source = await Fs.readFileSync(file, 'utf8');
          $body.append(source);
        }
      }
    }

    html = $.html();
  }

  if (headTags) {
    headTags = headTags.map(tagFunction);
  }

  if (bodyTags) {
    bodyTags = bodyTags.map(tagFunction);
  }

  return {
    html,
    headTags,
    bodyTags
  };
}

function afterCompileHandler(compilation, callback) {
  try {
    compilation.chunks.forEach((chunk) => {
      chunk.files.forEach((file) => {
        if (this.options.tests.some((test) => file.match(test))) {
          removes[file] = true;
        }
      });
    });
  } catch (e) {
    console.warn(e);
    compilation.errors.push(e);
    if (callback) {
      callback();
    }
  }
}

// 更新 HtmlWebpackPlugin 清单
function compilationHandler(publicPath, compilation, callback) {
  try {
    const tagFunction = (tag) => getInlineTag.call(this, publicPath, compilation.assets, tag);
    if (Object.prototype.hasOwnProperty.call(HtmlWebpackPlugin, 'getHooks')) {
      // HtmlWebpackPlugin v4
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(pluginOptions.name, async (assets, cb) => {
        const res = await updateHtmlTags.call(this, assets.html, assets.headTags, assets.bodyTags, tagFunction);
        assets.headTags = res.headTags;
        assets.bodyTags = res.bodyTags;
        cb(null, assets);
      });
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(pluginOptions.name, async (assets, cb) => {
        const res = await updateHtmlTags.call(this, assets.html, assets.head, assets.body, tagFunction);
        assets.html = res.html;
        cb(null, assets);
      });
    } else {
      // HtmlWebpackPlugin v3 or under
      fireWebpackPluginEvent(pluginOptions.name, 'htmlWebpackPluginAlterAssetTags', compilation, async (assets) => {
        const res = await updateHtmlTags.call(this, assets.html, assets.head, assets.body, tagFunction);
        assets.head = res.headTags;
        assets.body = res.bodyTags;
      });
      fireWebpackPluginEvent(pluginOptions.name, 'htmlWebpackPluginBeforeHtmlProcessing', compilation, async (assets) => {
        const res = await updateHtmlTags.call(this, assets.html, assets.head, assets.body, tagFunction);
        assets.html = res.html;
      });
    }
  } catch (e) {
    console.warn(e);
    compilation.errors.push(e);
    if (callback) {
      callback();
    }
  }
}

function emitHandler(compilation, callback) {
  try {
    // 删除待输出的文件，防止在 manifest-plugin 中生成
    compilation.chunks.forEach((chunk) => {
      if (Object.prototype.hasOwnProperty.call(externalEntry, chunk.name)) {
        // 删除 .js 或 .js.map 后缀的文件
        chunk.files = chunk.files.filter((file) => {
          if (REG_JS.test(file) || REG_JS_MAP.test(file)) {
            delete compilation.assets[file];
            return false;
          }
          return true;
        });
      } else {
        chunk.files = chunk.files.filter((file) => {
          if (this.options.tests.some((test) => file.match(test))) {
            delete compilation.assets[file];
            return false;
          }
          return true;
        });
      }
    });
    if (callback) {
      callback();
    }
  } catch (e) {
    console.warn(e);
    compilation.errors.push(e);
    if (callback) {
      callback();
    }
  }
}

module.exports = class WebpackHtmlEmbedSourcePlugin {
  // Default options
  options = {};

  constructor(options) {
    this.options = _.merge(
      {
        head: {
          prepend: [],
          append: []
        },
        body: {
          prepend: [],
          append: []
        },
        tests: []
      },
      options
    );
  }

  apply(compiler) {
    let publicPath = compiler.options.output.publicPath || '';
    if (publicPath && !publicPath.endsWith('/')) {
      publicPath += '/';
    }

    // amend entry
    compiler.options.entry = amendEntry.call(this, compiler.options.entry);

    if (compiler.hooks) {
      compiler.hooks.compilation.tap(pluginOptions, compilationHandler.bind(this, publicPath));
      compiler.hooks.afterCompile.tap(pluginOptions, afterCompileHandler.bind(this));
      compiler.hooks.emit.tapAsync(pluginOptions, emitHandler.bind(this));
    } else {
      compiler.plugin('compilation', compilationHandler.bind(this, publicPath));
      compiler.plugin('after-compile', afterCompileHandler.bind(this));
      compiler.plugin('emit', emitHandler.bind(this));
    }
  }
};
