/**
 * constants
 * 全局常量（大写和_连字符命名）
 */

import { convertModelArrToEnum } from '@fatesigner/utils';

import { IENV } from '@/types/env';

/**
 * environment 环境变量
 * 读取 .env 文件
 */
export const ENV: IENV = {
  APP_DEBUG: process.env.APP_DEBUG,
  APP_LANG: process.env.APP_LANG,
  APP_NAME: process.env.APP_NAME,
  APP_TITLE: process.env.APP_TITLE,
  APP_WEBHOST: process.env.APP_WEBHOST,
  APP_APIHOST: process.env.APP_APIHOST,
  APP_PRIMARY_COLOR: process.env.APP_PRIMARY_COLOR
};

// 定义可用的 ApiHost 集合，用于动态切换服务端环境
export const API_HOSTS = convertModelArrToEnum([
  // 开发环境
  {
    name: 'development',
    value: `${ENV.APP_APIHOST}`,
    text: '开发'
  },
  // 测试环境
  {
    name: 'test',
    value: `${ENV.APP_APIHOST}`,
    text: '测试'
  },
  // 生产环境
  {
    name: 'production',
    value: `${ENV.APP_APIHOST}`,
    text: '生产'
  }
] as const);

// 用户角色
export const ROLES = convertModelArrToEnum([
  // 管理员
  {
    name: 'admin',
    value: 'admin',
    text: '管理员',
    account: {
      username: 'Tom',
      password: '1234'
    }
  },
  // 用户
  {
    name: 'normal',
    value: 'normal',
    text: '用户',
    account: {
      username: 'normal',
      password: '123456'
    }
  }
]);
