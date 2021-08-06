/**
 * webpack-html-embed-source-plugin
 */

const _ = require('lodash');
const Fs = require('fs-extra');
const cheerio = require('cheerio');
const Webpack = require('webpack');
const { minify } = require('terser');
const CleanCSS = require('clean-css');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const REG_CSS = /\.(c|le|sa|sc)ss$/;
const REG_JS = /\.js$/i;
const REG_HTML = /\.html$/i;

const pluginName = 'WebpackHtmlEmbedSourcePlugin';

module.exports = class WebpackHtmlEmbedSourcePlugin {
  // Default options
  options = {};

  constructor(options) {
    this.options = _.merge(
      {
        prependHead: [],
        appendHead: [],
        prependBody: [],
        appendBody: [],
        tests: []
      },
      options
    );
  }

  isEmbedAsset(assetName) {
    return this.options.tests.some((test) => assetName.match(test));
  }

  processScriptTag(publicPath, assets, tag) {
    if (tag.tagName === 'link') {
      if (tag.attributes && tag.attributes.href) {
        const href = publicPath ? tag.attributes.href.replace(publicPath, '') : tag.attributes.href;
        if (REG_CSS.test(href)) {
          if (this.isEmbedAsset(href)) {
            const asset = assets[href];
            if (asset) {
              return { tagName: 'style', innerHTML: asset.source(), closeTag: true };
            }
          }
        }
      }
    } else if (tag.tagName === 'script') {
      const { src, ...attributesWithoutSrc } = tag.attributes;
      const assetName = publicPath ? src.replace(publicPath, '') : src;
      if (REG_JS.test(assetName)) {
        if (this.isEmbedAsset(assetName)) {
          const asset = assets[assetName];
          if (asset) {
            return { tagName: 'script', innerHTML: asset.source(), attributes: attributesWithoutSrc, closeTag: true };
          }
        }
      }
    }

    return tag;
  }

  async updateTag(html, headTags, bodyTags) {
    const $ = cheerio.load(html);
    const $body = $('body');
    const cleanCSS = new CleanCSS({});

    if (headTags) {
      for await (const asset of this.options.prependHead.slice().reverse()) {
        if (REG_CSS.test(asset)) {
          const source = await Fs.readFileSync(asset, 'utf8');
          headTags.unshift({
            tagName: 'style',
            innerHTML: cleanCSS.minify(source).styles,
            closeTag: true
          });
        } else if (REG_JS.test(file)) {
          const source = await Fs.readFileSync(file, 'utf8');
          headTags.unshift({
            tagName: 'script',
            innerHTML: minify(source).code,
            closeTag: true
          });
        }
      }
      for await (const asset of this.options.appendHead) {
        if (REG_CSS.test(asset)) {
          const source = await Fs.readFileSync(asset, 'utf8');
          headTags.push({
            tagName: 'style',
            innerHTML: cleanCSS.minify(source).styles,
            closeTag: true
          });
        } else if (REG_JS.test(file)) {
          const source = await Fs.readFileSync(file, 'utf8');
          headTags.push({
            tagName: 'script',
            innerHTML: minify(source).code,
            closeTag: true
          });
        }
      }
    }

    if (bodyTags) {
      for await (const asset of this.options.prependBody.slice().reverse()) {
        if (REG_CSS.test(asset)) {
          const source = await Fs.readFileSync(asset, 'utf8');
          bodyTags.unshift({
            tagName: 'style',
            innerHTML: cleanCSS.minify(source).styles,
            closeTag: true
          });
        } else if (REG_JS.test(asset)) {
          const source = await Fs.readFileSync(asset, 'utf8');
          bodyTags.unshift({
            tagName: 'script',
            innerHTML: minify(source).code,
            closeTag: true
          });
        } else if (REG_HTML.test(asset)) {
          const source = await Fs.readFileSync(asset, 'utf8');
          $body.prepend(source);
        }
      }
      for await (const asset of this.options.appendBody) {
        if (REG_CSS.test(asset)) {
          const source = await Fs.readFileSync(asset, 'utf8');
          bodyTags.push({
            tagName: 'style',
            innerHTML: cleanCSS.minify(source).styles,
            closeTag: true
          });
        } else if (REG_JS.test(file)) {
          const source = await Fs.readFileSync(asset, 'utf8');
          bodyTags.push({
            tagName: 'script',
            innerHTML: minify(source).code,
            closeTag: true
          });
        }
      }
    }

    return $.html();
  }

  apply(compiler) {
    let publicPath = compiler.options?.output?.publicPath || '';

    if (publicPath && !publicPath.endsWith('/')) {
      publicPath += '/';
    }

    // support webpack 4
    if (Webpack.version[0] === '4') {
      compiler.emit(pluginName, () => {});
    } else {
      compiler.hooks.compilation.tap(`${pluginName}_compilation`, (compilation) => {
        const hooks = HtmlWebpackPlugin.getHooks(compilation);

        hooks.alterAssetTags.tap(`${pluginName}_alterAssetTags`, (data) => {
          data.assetTags.scripts = data.assetTags.scripts.map((tag) => this.processScriptTag(publicPath, compilation.assets, tag));
          data.assetTags.styles = data.assetTags.styles.map((tag) => this.processScriptTag(publicPath, compilation.assets, tag));
          return data;
        });

        hooks.afterTemplateExecution.tapAsync(`${pluginName}_afterTemplateExecution`, (data, callback) => {
          this.updateTag(data.html, data.headTags, data.bodyTags).then((html) => {
            data.html = html;
            callback();
          });
        });

        compilation.hooks.processAssets.tap(
          {
            name: `${pluginName}_PROCESS_ASSETS_STAGE_SUMMARIZE`,
            stage: Webpack.Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE
          },
          (assets) => {
            Object.keys(assets).forEach((assetName) => {
              if (this.isEmbedAsset(assetName)) {
                delete assets[assetName];
              }
            });
          }
        );
      });
    }
  }
};
