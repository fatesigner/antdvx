/**
 * run webpack
 */

const gulp = require('gulp');
const spawn = require('cross-spawn');

const clean = require('./clean');

gulp.task(
  'webpack',
  gulp.series('clean', async function () {
    const i = process.argv.indexOf('--serve');
    if (i > -1) {
      // webpack serve --config webpack.config.js --hot --progress
      spawn.sync('webpack serve', ['--config', 'webpack.config.js', '--hot', '--progress'], { stdio: 'inherit' });
    } else {
      // run clean
      await clean();
      // webpack --config webpack.config.js
      spawn.sync('webpack', ['--config', 'webpack.config.js'], { stdio: 'inherit' });
    }
  })
);
