/**
 * 全局指令
 */

import { focus } from 'antdvx/directives';

export const Directives = {
  install(app) {
    app.directive('focus', focus);
  }
};
