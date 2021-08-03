/**
 * clean
 * clean build dir
 */

const gulp = require('gulp');
const rimraf = require('rimraf');

gulp.task('clean', async function () {
  const ENV = require('../env')();
  rimraf.sync(ENV.outputPath);
});
