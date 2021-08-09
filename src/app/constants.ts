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

// 颜色
export const COLORS = convertModelArrToEnum([
  {
    value: 'primary',
    text: 'primary',
    name: 'primary'
  },
  {
    value: 'secondary',
    text: 'secondary',
    name: 'secondary'
  },
  {
    value: 'tertiary',
    text: 'tertiary',
    name: 'tertiary'
  },
  {
    value: 'success',
    text: 'success',
    name: 'success'
  },
  {
    value: 'warning',
    text: 'warning',
    name: 'warning'
  },
  {
    value: 'danger',
    text: 'danger',
    name: 'danger'
  },
  {
    value: 'light',
    text: 'light',
    name: 'light'
  },
  {
    value: 'dark',
    text: 'dark',
    name: 'dark'
  },
  {
    value: 'purple',
    text: 'purple',
    name: 'purple'
  }
]);

// 尺寸
export const SIZES = convertModelArrToEnum([
  {
    value: 'default',
    text: 'default',
    name: 'default'
  },
  {
    value: 'large',
    text: 'large',
    name: 'large'
  },
  {
    value: 'small',
    text: 'small',
    name: 'small'
  }
]);

// 按钮类型
export const BUTTON_TYPES = convertModelArrToEnum([
  {
    value: 'default',
    text: 'default',
    name: 'default'
  },
  {
    value: 'primary',
    text: 'primary',
    name: 'primary'
  },
  {
    value: 'dashed',
    text: 'dashed',
    name: 'dashed'
  },
  {
    value: 'link',
    text: 'link',
    name: 'link'
  }
]);
