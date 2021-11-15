/**
 * dayjs
 */

import dayjs from 'dayjs';

import { i18n } from '@/app/i18n';

export const Dayjs = {
  install() {
    const duration = require('dayjs/plugin/duration');
    dayjs.extend(duration);

    const loadLang = async (lang) => {
      // 导入 language，非中文环境统一使用英文
      if (lang === 'zh-CN') {
        import('dayjs/locale/zh-cn').then(() => {
          dayjs.locale('zh-cn');
        });
      } else {
        import('dayjs/locale/es-us').then(() => {
          dayjs.locale('es-us');
        });
      }
    };

    // 加载初始语言
    loadLang(i18n._.global.locale);

    // 注册 i18n 勾子，每当切换语言之后，将会执行
    i18n.hooks.afterSet.tapAsync(loadLang);
  }
};
