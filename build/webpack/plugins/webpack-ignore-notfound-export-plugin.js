/**
 * webpackIgnoreNotFoundExportPlugin
 */

const ModuleDependencyWarning = require('webpack/lib/ModuleDependencyWarning');

module.exports = class WebpackIgnoreNotfoundExportPlugin {
  apply(compiler) {
    const messageRegExp = /export '.*'( \(reexported as '.*'\))? was not found in/;
    function doneHook(stats) {
      stats.compilation.warnings = stats.compilation.warnings.filter(function (warn) {
        return !(warn instanceof ModuleDependencyWarning && messageRegExp.test(warn.message));
      });
    }
    if (compiler.hooks) {
      compiler.hooks.done.tap('IgnoreNotFoundExportPlugin', doneHook);
    } else {
      compiler.plugin('done', doneHook);
    }
  }
};
