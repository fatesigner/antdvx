/**
 * utils
 */

const path = require('path');
const hash = require('object-hash');

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

const hexDigits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

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
 * 生成类似 GUID的 随机字符串
 * 说明：全局唯一标识符（GUID，Globally Unique Identifier）也称作 UUID(Universally Unique IDentifier)
 * GUID是一种由算法生成的二进制长度为128位的数字标识符。GUID 的格式为“xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx”，
 * 其中的 x 是 0-9 或 a-f 范围内的一个32位十六进制数。在理想情况下，任何计算机和计算机集群都不会生成两个相同的GUID。
 * GUID 的总数达到了2^128（3.4×10^38）个，所以随机生成两个相同GUID的可能性非常小，但并不为0。
 * @param {number} length
 * @param letter
 * @returns {string} GUID
 */
exports.getGUID = function (length = 32, letter = false) {
  const s = [];
  let standard = false;
  if (length === 32) {
    standard = true;
    length = 36;
  }
  for (let i = 0; i < length; i++) {
    if (letter && i === 0) {
      s[i] = hexDigits.substr(exports.getRandomNumber(10, hexDigits.length), 1);
    } else {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
  }
  if (standard) {
    s[14] = '4';
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = '-';
  }
  return s.join('');
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
      ident = exports.getGUID(length, true);
    }

    if (key) {
      idents.set(key, ident);
    }

    seen.add(ident);

    return ident;
  };
};
