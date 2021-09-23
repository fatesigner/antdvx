/**
 * run webpack
 */

const gulp = require('gulp');
const spawn = require('cross-spawn');
const rimraf = require('rimraf');

gulp.task(
  'webpack',
  gulp.series(async function () {
    const { EXAMPLE_PATH } = require('../constants');

    const i = process.argv.indexOf('--serve');
    if (i > -1) {
      // webpack serve --config webpack.config.js --hot --progress
      spawn.sync('webpack serve', ['--config', 'webpack.config.js', '--hot', '--progress'], { stdio: 'inherit' });
    } else {
      rimraf.sync(EXAMPLE_PATH);
      // webpack --config webpack.config.js
      spawn.sync('webpack', ['--config', 'webpack.config.js'], { stdio: 'inherit' });
    }
  })
);
