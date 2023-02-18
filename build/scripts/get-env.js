/**
 * get-env
 * 读取根目录下的 .env 文件的环境变量并将其导出
 */

const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const dotenv = require('dotenv');

// envs 目录
const envsDir = path.join(__dirname, '../../src/envs');

module.exports = function () {
  const mode = process.env.mode ? process.env.mode : 'dev';
  const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';

  return _.merge(
    {},
    dotenv.parse(fs.readFileSync(path.join(envsDir, '.env'))),
    dotenv.parse(fs.readFileSync(path.join(envsDir, '.env.' + mode))),
    {
      NODE_ENV
    }
  );
};
