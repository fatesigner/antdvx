/**
 * env
 */

const path = require('path');

module.exports = function () {
  const rootPath = path.resolve(__dirname, '..');
  const buildPath = path.join(rootPath, 'build');
  const srcPath = path.join(rootPath, 'src');
  const outputPath = path.join(rootPath, 'dist');
  const nodeModulesPath = path.resolve(rootPath, 'node_modules');
  return {
    rootPath,
    buildPath,
    srcPath,
    outputPath,
    nodeModulesPath
  };
};
