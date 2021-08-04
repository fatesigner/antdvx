/**
 * dotenv
 * 从 .env 文件加载环境变量到 process.env 中
 */

const _ = require('lodash');
const path = require('path');
const dotenv = require('dotenv');

const env = require('../env')();

const parsed = _.merge(
  {},
  dotenv.config({
    path: path.join(env.srcPath, 'env', '.env')
  }).parsed,
  dotenv.config({
    path: path.join(env.srcPath, 'env', '.env.' + process.env.NODE_ENV)
  }).parsed
);

Object.keys(parsed).forEach((cur) => {
  process.env[cur] = parsed[cur];
});

module.exports = parsed;
