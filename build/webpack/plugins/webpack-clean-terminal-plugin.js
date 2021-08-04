/**
 * webpack-clean-terminal-plugin
 */

const chalk = require('chalk');

const output = require('../../utils/output');

const pluginName = 'webpack-clean-terminal-plugin';

module.exports = class WebpackCleanTerminalPlugin {
  mode = '';
  devServerUrl = '';

  constructor(options = {}) {
    const { message, onlyInWatchMode = true, skipFirstRun = true, beforeCompile = false } = options;

    this.message = message;
    this.onlyInWatchMode = onlyInWatchMode;
    this.skipFirstRun = skipFirstRun;
    this.beforeCompile = beforeCompile;
    this.firstRun = true;
    this.previousEndTimes = {};
  }

  apply(compiler) {
    this.mode = compiler.options?.mode || 'development';
    this.devServerUrl =
      (compiler.options?.devServer?.host ? 'https://' : 'http://') + (compiler.options?.devServer?.host || '') + (compiler.options?.devServer?.port || '');

    const handler = () => {
      if (this.shouldClearConsole(compiler)) {
        this.clearConsole();
      }
    };
    if (this.beforeCompile) {
      compiler.hooks.beforeCompile.tap(pluginName, handler);
    } else {
      compiler.hooks.done.tap(pluginName, (stats) => {
        const time = stats.stats ? this.getMultiStatsCompileTime(stats) : this.getStatsCompileTime(stats);
        console.log('\n');
        output.title('success', 'DONE', 'Compiled successfully in ' + time + 'ms');
      });
    }
  }

  getStatsCompileTime(stats, statsIndex) {
    // When we have multi compilations but only one of them is rebuilt, we need to skip the
    // unchanged compilers to report the true rebuild time.
    if (statsIndex !== undefined) {
      if (this.previousEndTimes[statsIndex] === stats.endTime) {
        return 0;
      }
      this.previousEndTimes[statsIndex] = stats.endTime;
    }
    return stats.endTime - stats.startTime;
  }

  getMultiStatsCompileTime(stats) {
    // Webpack multi compilations run in parallel so using the longest duration.
    // https://webpack.github.io/docs/configuration.html#multiple-configurations
    return stats.stats.reduce((time, stats, index) => Math.max(time, this.getStatsCompileTime(stats, index)), 0);
  }

  shouldClearConsole(compiler) {
    if (this.firstRun) {
      this.firstRun = false;

      if (this.skipFirstRun) {
        return false;
      }
    }

    if (this.onlyInWatchMode) {
      return Boolean(compiler.watchMode);
    }

    const isNodeEnvProduction = process.env.NODE_ENV === 'production';
    const isOptionsModeProduction = Boolean(compiler.options && compiler.options.mode === 'production');

    return !isNodeEnvProduction && !isOptionsModeProduction;
  }

  clearConsole() {
    // const clear = '\x1B[2J\x1B[3J\x1B[H';
    // const output = this.message ? `${clear + this.message}\n\n` : clear;

    const time = stats.stats ? this.getMultiStatsCompileTime(stats) : this.getStatsCompileTime(stats);

    console.log();
    console.log(`${chalk.bgGreen('Done')}`);
    if (this.devServerUrl) {
      console.log(`  ${chalk.green('Webpack is build in')} ${chalk.blue('server')} ${chalk.green('mode.')}`);
      console.log(`  ${chalk.green('App running at: ')} ${chalk.underline(chalk.blue(this.devServerUrl))}`);
    } else {
      console.log(`  ${chalk.green('Webpack is build in')} ${chalk.blue(this.mode)} ${chalk.green('mode.')}`);
    }
    console.log();

    // process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');

    // process.stdout.write(output);
  }
};
