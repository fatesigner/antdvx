/**
 * build example
 */

const gulp = require('gulp');
const log = require('fancy-log');
const webpack = require('webpack');
const exec = require('child_process').exec;

gulp.task('build-example', async function () {
  return new Promise(function (resolve, reject) {
    exec('npm run build:example', function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
    /* webpack(require('../../webpack.config'), (err, stats) => {
      if (err || (stats && stats.compilation && stats.compilation.errors && stats.compilation.errors.length)) {
        if (!err) {
          err = stats.compilation.errors[0];
        }
        reject(err);
      } else {
        log('[webpack]', stats.toString({ colors: true }));
        resolve(stats);
      }
    }); */
  });
});
