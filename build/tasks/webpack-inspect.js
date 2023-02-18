/**
 * webpack-inspect
 * 生成当前 webpack 配置的 json 文件，用于 webpack 调试
 */

const fs = require('fs');
const path = require('path');
const gulp = require('gulp');

gulp.task('webpack-inspect', async function () {
  const { ROOT_PATH } = require('../constants');
  const { orderObject, isProd } = require('../utils');
  const webpackConfig = require('../../webpack.config');

  webpackConfig
    .then((config) => {
      const outputFile = isProd() ? 'webpack.prod.config.json' : 'webpack.dev.config.json';
      return fs.writeFileSync(path.join(ROOT_PATH, outputFile), JSON.stringify(orderObject(config), null, 2));
    })
    .catch((err) => {
      console.log(err);
    });
});
