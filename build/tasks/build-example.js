/**
 * build example
 */

const gulp = require('gulp');
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
  });
});
