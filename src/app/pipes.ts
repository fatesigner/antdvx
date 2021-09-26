/**
 * 全局过滤器
 */

import { AntdvxPipes } from '@/antdvx';

export const Pipes = {
  install(app) {
    app.config.globalProperties.$pipes = {
      ...AntdvxPipes
    };
  }
};
