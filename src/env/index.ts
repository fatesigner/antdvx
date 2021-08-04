/**
 * environment
 * 全局环境变量
 */

import { IENV } from '@/types/env';

// 读取 .env 文件中的变量至内存
export const env: IENV = {
  LANG: process.env.LANG,
  APP_NAME: process.env.APP_NAME,
  APP_TITLE: process.env.APP_TITLE,
  APP_APIHOST: process.env.APP_APIHOST,
  APP_WEBHOST: process.env.APP_WEBHOST,
  PRIMARY_COLOR: process.env.PRIMARY_COLOR
};
