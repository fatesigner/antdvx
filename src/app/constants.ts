/**
 * constants
 * 全局常量（大写和_连字符命名）
 */

import { convertModelArrToEnum } from '@fatesigner/utils';

import { env } from '@/env';

// 定义可用的 ApiHost 集合，用于动态切换服务端环境
export const API_HOSTS = convertModelArrToEnum([
  // 开发环境
  {
    name: 'development',
    value: `${env.APP_APIHOST}`,
    text: '开发'
  },
  // 测试环境
  {
    name: 'test',
    value: `${env.APP_APIHOST}`,
    text: '测试'
  },
  // 生产环境
  {
    name: 'production',
    value: `${env.APP_APIHOST}`,
    text: '生产'
  }
]);

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

// 定义排序方式
export const SORTORDS = convertModelArrToEnum([
  {
    value: 1,
    text: '最新排序',
    name: 'latest'
  },
  {
    value: 2,
    text: '从低到高',
    name: 'ASC'
  },
  {
    value: 3,
    text: '从高到底',
    name: 'DESC'
  }
]);
