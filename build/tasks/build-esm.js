/**
 * build esm module
 */

const path = require('path');
const gulp = require('gulp');
const merge = require('merge2');
const ts = require('gulp-typescript');

gulp.task('build-esm', async function () {
  const env = require('../env')();

  // Copy all files to output
  await new Promise((resolve) => {
    gulp.src(path.join(env.srcPath, '**/*')).pipe(gulp.dest(env.outputPath)).on('end', resolve);
  });

  // Build esm module
  /* const TsProject = ts.createProject(path.join(env.rootPath, 'tsconfig.json'), {
    declaration: true
  });
  const tsResult = gulp
    .src([path.join(env.srcPath, '**!/!*.ts'), '!' + path.join(env.srcPath, '**!/!*.d.ts'), '!' + path.join(env.srcPath, '**!/!*.spec.ts')], {
      allowEmpty: true
    })
    .pipe(TsProject());
  merge([tsResult.dts.pipe(gulp.dest(path.join(env.outputPath, 'esm'))), tsResult.js.pipe(gulp.dest(path.join(env.outputPath, 'esm')))]); */
});
