/**
 * build esm module
 */

const path = require('path');
const gulp = require('gulp');

gulp.task('build-esm', async function () {
  const { SRC_PATH, OUTPUT_PATH } = require('../constants');

  // Copy all files to output
  await new Promise((resolve) => {
    gulp.src(path.join(SRC_PATH, 'antdvx/**/*')).pipe(gulp.dest(OUTPUT_PATH)).on('end', resolve);
  });
});
