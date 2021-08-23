/**
 * clean
 * clean build dir
 */

const gulp = require('gulp');
const rimraf = require('rimraf');

const clean = async function () {
  const { OUTPUT_PATH } = require('../constants');
  rimraf.sync(OUTPUT_PATH);
};

gulp.task('clean', clean);

module.exports = clean;
