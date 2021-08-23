/**
 * env-cmd
 * 读取 .env 文件并加载环境变量至 process.env 中
 * npm i cross-spawn dotenv exit -D
 */

const _ = require('lodash');
const exit = require('exit');
const path = require('path');
const dotenv = require('dotenv');
const spawn = require('cross-spawn');

// envs 目录
const envsDir = path.join(__dirname, '../../src/envs');

let APP_ENV = 'development';
if (process.env.APP_ENV) {
  APP_ENV = process.env.APP_ENV;
}

const values = _.merge(
  {},
  dotenv.config({
    path: path.join(envsDir, '.env')
  }).parsed,
  dotenv.config({
    path: path.join(envsDir, '.env.' + APP_ENV)
  }).parsed,
  {
    APP_ENV
  }
);

/* Object.keys(parsed).forEach((cur) => {
  process.env[cur] = parsed[cur];
}); */

const args = process.argv.slice(2);

args.forEach((args__value, args__key) => {
  if (args__value[0] === '%' && args__value.substring(1) in values) {
    args[args__key] = values[args__value.substring(1)];
  }
});

const command = args.shift();

const proc = spawn.sync(command, args, { stdio: 'inherit' });

exit(proc.status);
