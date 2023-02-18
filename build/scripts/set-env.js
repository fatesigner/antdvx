/**
 * set-env
 * 读取根目录下的 .env 文件的环境变量并将其加载至 process.env 中
 * npm i cross-spawn dotenv dotenv-expand exit -D
 */

const fs = require('fs');
const _ = require('lodash');
const exit = require('exit');
const path = require('path');
const dotenv = require('dotenv');
const spawn = require('cross-spawn');
const dotenvExpand = require('dotenv-expand');

// envs 目录
const envsDir = path.join(__dirname, '../../src/envs');

const mode = process.env.mode ? process.env.mode : 'dev';
const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';

const parsed = _.merge(
  {},
  dotenv.parse(fs.readFileSync(path.join(envsDir, '.env')), {
    debug: !!process.env.DEBUG || undefined
  }),
  dotenv.parse(fs.readFileSync(path.join(envsDir, '.env.' + mode)), {
    debug: !!process.env.DEBUG || undefined
  }),
  {
    mode,
    NODE_ENV
  }
);

// 写入至 process.env
dotenvExpand.expand({
  parsed,
  ignoreProcessEnv: false
});

/* Object.keys(parsed).forEach((cur) => {
  process.env[cur] = parsed[cur];
}); */

const args = process.argv.slice(2);

args.forEach((args__value, args__key) => {
  if (args__value[0] === '%' && args__value.substring(1) in parsed) {
    args[args__key] = parsed[args__value.substring(1)];
  }
});

const command = args.shift();

if (command) {
  // args.push('--mode', mode === 'prod' ? 'production' : 'development');
  const proc = spawn.sync(command, args, { stdio: 'inherit' });
  exit(proc.status);
}
