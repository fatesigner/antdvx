/**
 * utils
 */

const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const chalk = require('chalk');
const hash = require('object-hash');
const prettier = require('prettier');
const shortUuid = require('short-uuid');
const { readFile } = require('fs/promises');

const NODE_ENV_ENUM = {
  DEV: 'development',
  PROD: 'production'
};

/**
 * 获取开发模式
 * @returns {string}
 * @constructor
 */
exports.getNODE_ENV = function () {
  const env = (process.env.NODE_ENV || NODE_ENV_ENUM.DEV).trim();
  for (const v in NODE_ENV_ENUM) {
    if (Object.prototype.hasOwnProperty.call(NODE_ENV_ENUM, v) && env === NODE_ENV_ENUM[v]) {
      return env;
    }
  }
  return NODE_ENV_ENUM.DEV;
};

/**
 * 判断当前是否处于生产模式
 * @param env
 * @returns {boolean}
 * @constructor
 */
exports.isProd = function (env = null) {
  if (!env) {
    env = exports.getNODE_ENV();
  }
  return env === NODE_ENV_ENUM.PROD;
};

/**
 * 判断给定的值是否为 undefined
 * @return {boolean}
 */
exports.isUndefined = function (obj) {
  return Object.prototype.toString.call(obj) === '[object Undefined]';
};

/**
 * 判断给定的值是否为 null
 * @return {boolean}
 */
exports.isNull = function (obj) {
  return Object.prototype.toString.call(obj) === '[object Null]';
};

/**
 * 判断给定的值是否为 null or undefined
 * @return {boolean}
 */
exports.isNullOrUndefined = function (obj) {
  return exports.isNull(obj) || exports.isUndefined(obj);
};

/**
 * 判断是否为 number类型
 * @param obj
 * @return {boolean}
 */
exports.isNumber = function (obj) {
  return Object.prototype.toString.call(obj) === '[object Number]' && !isNaN(obj);
};

/**
 * 获取对象指定表达式的值
 * @param obj
 * @param propertyPath {string}
 * @param defaultVal 默认值
 * @returns {boolean}
 * @constructor
 */
exports.getOwnNestedProperty = function (obj, propertyPath, defaultVal) {
  if (!propertyPath) {
    return defaultVal;
  }

  const properties = propertyPath.split('.');

  let obj_ = obj;

  for (let i = 0; i < properties.length; i++) {
    const prop = properties[i];

    if (!exports.isNullOrUndefined(obj) && Object.prototype.hasOwnProperty.call(obj_, prop)) {
      obj_ = obj_[prop];
    } else {
      obj_ = undefined;
      break;
    }
  }

  if (exports.isNullOrUndefined(obj_)) {
    return defaultVal;
  }

  return obj_;
};

/**
 * 判断给定的值是否为数组
 * @return {boolean}
 */
exports.isArray = function (obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
};

/**
 * 将-连接字符串转换为驼峰式
 * @param {string} bridge
 * @param capitalize 首字母大写
 * @returns {string} hump
 */
exports.convertBridgeStrToHump = function (bridge, capitalize = false) {
  if (bridge) {
    const str = bridge.replace(/-(\w)/g, function (all, letter) {
      return letter.toUpperCase();
    });
    if (capitalize) {
      return str.substring(0, 1).toUpperCase() + str.substring(1);
    } else {
      return str;
    }
  }
  return '';
};

/**
 * Fire Webpack plugin event
 * @param pluginOptions
 * @param event
 * @param compilation
 * @param fn
 */
exports.fireWebpackPluginEvent = function (pluginOptions, event, compilation, fn) {
  const wrappedFn = (pluginArgs, callback) => {
    try {
      fn(pluginArgs);
      if (callback) {
        callback(null, pluginArgs);
      }
    } catch (err) {
      if (callback) {
        callback(err);
      } else {
        compilation.errors.push(err);
      }
    }
  };
  if (compilation.hooks) {
    if (Object.prototype.hasOwnProperty.call(compilation.hooks, event)) {
      compilation.hooks[event].tapAsync(pluginOptions, wrappedFn);
    }
  } else {
    compilation.plugin(event, wrappedFn);
  }
};

/**
 * 为指定 object 对象的属性排序
 * @param obj
 * @returns {{}}
 */
exports.orderObject = function (obj) {
  return Object.keys(obj)
    .sort()
    .reduce((prev, key) => {
      if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
        prev[key] = exports.orderObject(obj[key]);
      } else {
        prev[key] = obj[key];
      }
      return prev;
    }, {});
};

exports.getNodeModulesRegexPath = function (moduleName, _path) {
  // 确定路径分隔符
  let sepRegStr;
  if (path.sep === '/') {
    // 替换 正斜杠 为 反斜杠+正斜杠
    sepRegStr = path.sep.replace(/\//g, '\\/');
  } else {
    // 替换 反斜杠 为 四个反斜杠
    sepRegStr = path.sep.replace(/\\/g, '\\\\');
  }

  // 正则尾部加上路径分隔符
  let regStr = '';
  if (moduleName) {
    regStr = `${sepRegStr}node_modules${sepRegStr}_?${moduleName}[${sepRegStr}](.*)`;
  } else {
    regStr = `${sepRegStr}node_modules${sepRegStr}(.*)`;
  }

  const regR = _path.match(new RegExp(regStr, 'i'));
  if (regR && regR.length > 1) {
    const splits = regR[1].split(path.sep);
    if (splits.length) {
      // ignore css module
      if (
        splits[0] === 'babel-loader' ||
        splits[0] === 'ts-loader' ||
        splits[0] === 'css-loader' ||
        splits[0] === 'mini-css-extract-plugin' ||
        splits[0] === 'happypack'
      ) {
        return null;
      }
    }
    return regR[1].split(path.sep);
  }
  return null;
};

/**
 * 生成指定范围内的随机整数
 * @param min
 * @param max
 * @returns {*}
 */
exports.getRandomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min)) + min;
};

/**
 * 创建一个自增长随机序列的算法
 * @param length
 * @param letter
 * @returns {function(*=): string}
 */
exports.createRandomIdentGetter = function (length = 1, letter = false) {
  // const allowedCharactersFirst = 'abcdefghijklmnopqrstuvwxyz';
  // const allowedCharactersAfter = allowedCharactersFirst + '0123456789';

  const seen = new Set();
  const idents = new Map();

  return function (key = '') {
    let ident = '';

    if (key) {
      if (idents.has(key)) {
        return idents.get(key);
      } else {
        ident = hash.sha1(key).substr(0, length);
      }
    }

    // 校验碰撞
    // eslint-disable-next-line no-unmodified-loop-condition
    while (seen.has(ident) || (letter && !/^[a-zA-Z]+/.test(ident))) {
      ident = shortUuid.generate().substring(0, length, true);
    }

    if (key) {
      idents.set(key, ident);
    }

    seen.add(ident);

    return ident;
  };
};

/**
 * 首字母大写
 * @param {string} str
 * @returns {string} str
 */
exports.capitalize = function (str) {
  return str.substring(0, 1).toUpperCase() + str.substring(1);
};

/**
 * 将-连接字符串转换为驼峰式
 * @param {string} bridge
 * @returns {string} hump
 */
exports.convertBridgeStrToHump = function (bridge) {
  if (bridge) {
    return bridge.replace(/-(\w)/g, function (all, letter) {
      return letter.toUpperCase();
    });
  }
  return '';
};

/**
 * 将驼峰式字符串转换为-连接
 * @param {string} hump
 * @param {boolean} lowercase
 * @returns {string} bridge
 */
exports.convertHumpStrToBridge = function (hump, lowercase = false) {
  if (hump) {
    // 处理整个字符串都是大写的情况
    if (!/[a-z]+/.test(hump)) {
      return hump.toLowerCase();
    }
    // 处理连续大写的情况
    hump = hump.replace(/([A-Z]{2,})/g, function (match, p1) {
      return exports.capitalize(p1.substring(0, p1.length - 1).toLowerCase()) + p1.substring(p1.length - 1, p1.length);
    });
    let s = hump.replace(/([A-Z])/g, '-$1');
    if (lowercase && s) {
      s = s.toLowerCase();
    }
    if (s?.[0] === '-') {
      s = s.substring(1);
    }
    return s;
  }
  return '';
};

/**
 * 将驼峰式字符串转换为空格隔开
 * @param {string} hump
 * @param {boolean} lowercase
 * @returns {string} bridge
 */
exports.convertHumpStrToSpace = function (hump, lowercase = false) {
  if (hump) {
    // 处理整个字符串都是大写的情况
    if (!/[a-z]+/.test(hump)) {
      return hump;
    }
    // 处理连续大写的情况
    if (hump === 'DLA') {
      console.log(
        hump.replace(/([A-Z]{2,})/g, function (match, p1) {
          // p1 is non-digits, p2 digits, and p3 non-alphanumerics
          return (
            exports.capitalize(p1.substring(0, p1.length - 1).toLowerCase()) + p1.substring(p1.length - 1, p1.length)
          );
        })
      );
    }
    hump = hump.replace(/([A-Z]{2,})/g, function (match, p1) {
      return p1.substring(0, p1.length - 1) + ' ' + p1.substring(p1.length - 1, p1.length);
    });
    let s = hump.replace(/([A-Z]+)/g, ' $1').replace(/ +/g, ' ');
    if (lowercase && s) {
      s = s.toLowerCase();
    }
    if (s?.[0] === ' ') {
      s = s.substring(1);
    }
    return s;
  }
  return '';
};

/**
 * 为字节数添加具体的单位 GB、MB、KB
 * @param {number} value 字节数
 * @param {number} digits 指定小数点保留位数，默认为 2
 * @param {boolean} capital 是否显示为大写的单位
 * @returns {Array} size
 */
exports.convertToBytesUnit = function (value, digits = 2, capital = false) {
  if (value == null) {
    return '0 Bytes';
  }
  const unitArr = ['bytes', 'kb', 'mb', 'gb', 'tb', 'pb', 'eb', 'zb', 'yb'];
  const srcsize = parseFloat(value.toString());
  const index = Math.floor(Math.log(srcsize) / Math.log(1024));
  let size = srcsize / Math.pow(1024, index);

  if (exports.isNumber(digits)) {
    size = size.toFixed(digits);
  }

  let res = size + unitArr[index];

  if (capital) {
    res = res.toUpperCase();
  }

  return res;
};

/**
 * 使用 prettier 格式化文件内容
 * @param content
 */
exports.formatFile = async function (content) {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line promise/catch-or-return
    prettier.resolveConfig(process.cwd()).then((options) => {
      // eslint-disable-next-line promise/always-return
      if (options) {
        try {
          const content_ = prettier.format(content, {
            ...options,
            parser: 'typescript'
          });
          resolve(content_);
        } catch (err) {
          reject(err);
        }
      } else {
        // 未找到 prettier 配置文件，跳过
        resolve(content);
      }
    });
  });
};

/**
 * 写入文件
 * @returns fileContent
 */
exports.writeFileSafely = async function (writeLocation, content, options, format = false) {
  const dir = path.dirname(writeLocation);

  // 目录不存在，则创建目录
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // format content
  if (format) {
    content = await exports.formatFile(content).catch((err) => {
      console.log(err);
    });
  }

  await fs.promises.writeFile(writeLocation, content, options);
};

/**
 * 渲染模板文件
 * @param variables  变量
 * @param inputPath  源文件路径
 * @param outputPath  输出文件路径
 * @param filename   文件名
 * @param writeOptions
 * @param format 是否格式化代码
 * @returns fileContent
 */
exports.compileTemplate = async function (
  variables,
  inputPath,
  outputPath = '',
  filename = '',
  writeOptions = null,
  format = false
) {
  if (!fs.existsSync(inputPath)) {
    throw new Error('The file does not exist: ' + inputPath);
  }

  if (outputPath && !filename) {
    filename = path.basename(outputPath);
  }

  const data = await readFile(inputPath, 'utf8').catch((err) => {
    if (err) {
      throw err;
    }
  });
  const fn = ejs.compile(data);
  const content = fn(variables);

  if (outputPath) {
    // 写入文件
    return exports
      .writeFileSafely(outputPath, content, Object.assign({ encoding: 'utf8', flag: 'wx' }, writeOptions), format)
      .then(() => {
        // 创建成功，输出消息
        const stats = fs.statSync(outputPath);
        // eslint-disable-next-line promise/always-return
        // console.info(`${chalk.green('Created')} ${filename} (${exports.convertToBytesUnit(stats.size)})`);
        return `${chalk.green('Created')} ${filename} (${exports.convertToBytesUnit(stats.size)})`;
      })
      .catch((err) => {
        console.log(err.message);
        // console.info(`${chalk.red('Failed')} EEXIST: file already exists, open '${outputPath}'`);
        throw new Error(`${chalk.red('Failed')} EEXIST: file already exists, open '${outputPath}'`);
      });
  }

  return content;
};
