/**
 * build
 * copy src files to output path
 */

const fs = require('fs');
const path = require('path');
const gulp = require('gulp');

require('./clean');
require('./build-esm');
require('./build-icons');

gulp.task(
  'build',
  gulp.series('clean', 'build-icons', 'build-esm', async function () {
    const { ROOT_PATH, OUTPUT_PATH } = require('../constants');

    // Copy npm publish files to output
    await new Promise((resolve) => {
      gulp
        .src(['README.md'].map((x) => path.join(ROOT_PATH, x)))
        .pipe(gulp.dest(OUTPUT_PATH))
        .on('end', resolve);
    });

    // Write package.json file to output
    const pkg = require('../../package.json');
    if (pkg.scripts) {
      pkg.scripts = Object.keys(pkg.scripts).reduce((prev, key) => {
        if (key !== 'prepare' || pkg.scripts[key].indexOf('husky install') < 0) {
          prev[key] = pkg.scripts[key];
        }
        return prev;
      }, {});
    }
    if (pkg.dependencies) {
      pkg.dependencies = Object.keys(pkg.dependencies).reduce((prev, key) => {
        if (key !== 'antdvx') {
          prev[key] = pkg.dependencies[key];
        }
        return prev;
      }, {});
    }
    // Add sideEffects
    pkg.sideEffects = false;
    fs.writeFileSync(path.join(OUTPUT_PATH, 'package.json'), JSON.stringify(pkg, null, 2), { encoding: 'utf8' });
  })
);
