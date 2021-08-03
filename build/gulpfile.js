/**
 * gulpfile
 */

const path = require('path');
const requireDir = require('require-dir');

// 工作目录改为根目录
process.chdir(path.join(__dirname, '..'));

requireDir('./tasks');
