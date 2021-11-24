/**
 * build example
 */

const path = require('path');
const gulp = require('gulp');
const rimraf = require('rimraf');
const exec = require('child_process').exec;

const { ROOT_PATH } = require('../constants');

gulp.task('build-example', async function () {
  await rimraf.sync(path.join(ROOT_PATH, 'example'));
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
  });
});
