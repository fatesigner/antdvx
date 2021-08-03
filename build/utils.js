/**
 * utils
 */

exports.NODE_ENV_ENUM = {
  DEV: 'development',
  PROD: 'production'
};

/**
 * 获取开发模式
 * @returns {string}
 * @constructor
 */
exports.getNODE_ENV = function () {
  const env = (process.env.NODE_ENV || exports.NODE_ENV_ENUM.DEV).trim();
  for (const v in exports.NODE_ENV_ENUM) {
    if (Object.prototype.hasOwnProperty.call(exports.NODE_ENV_ENUM, v) && env === exports.NODE_ENV_ENUM[v]) {
      return env;
    }
  }
  return exports.NODE_ENV_ENUM.DEV;
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
  return env === exports.NODE_ENV_ENUM.PROD;
};
