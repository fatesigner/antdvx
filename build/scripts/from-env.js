/**
 * from-env
 * 读取 .env 文件并导出环境变量
 */

const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const dotenv = require('dotenv');

// envs 目录
const envsDir = path.join(__dirname, '../../src/envs');

module.exports = function () {
  const APP_ENV = process.env.APP_ENV ? process.env.APP_ENV : 'development';

  return _.merge({}, dotenv.parse(fs.readFileSync(path.join(envsDir, '.env'))), dotenv.parse(fs.readFileSync(path.join(envsDir, '.env.' + APP_ENV))), {
    APP_ENV
  });
};
