/**
 * Antdvx
 */

import { message, notification } from 'ant-design-vue';
import { setRequestAdapter, setStorageService } from 'antdvx';
import { setAntdvxPipesConfig } from 'antdvx/pipes';
import { merge } from 'lodash-es';

import { httpService, localStorageService } from '@/app/core/services';
import { i18n } from '@/app/i18n';

export const Antdvx = {
  install() {
    // 设置 Http 适配器
    setRequestAdapter((options) => {
      return httpService.request(options);
    });

    setStorageService(localStorageService);

    // 配置 pipes
    setAntdvxPipesConfig({
      dateFormat: 'YYYY-MM-DD',
      fixed: {
        digits: 2,
        mode: 'round'
      },
      currencyFormat: new Intl.NumberFormat('en-US', {
        style: 'decimal',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      })
    });

    notification.config({
      duration: 1,
      placement: 'topRight',
      bottom: '50px'
    });

    message.config({
      duration: 1,
      top: '26px',
      maxCount: 5
    });

    // 导入 antdvx 主题
    const classes = document.body.className.split(' ');
    classes.push('antdvx-theme-classic');
    document.body.className = classes.filter((x: any) => !!x).join(' ');

    const loadLang = async (lang) => {
      // 导入 language，非中文环境统一使用英文
      if (lang === 'zh-CN') {
        return import('antdvx/i18n/locales/zh-CN').then((res) => {
          return res.default;
        });
      } else {
        return import('antdvx/i18n/locales/en-US').then((res) => {
          return res.default;
        });
      }
    };

    // 加载初始语言
    loadLang(i18n._.global.locale).then((res) => {
      merge(i18n._.global.messages[i18n._.global.locale], res);
    });

    // 注册 i18n 勾子，每当切换语言之前，将会执行
    i18n.hooks.beforeSet.tapAsync((lang, locale) => {
      return loadLang(lang).then((res) => {
        return merge(locale, res);
      });
    });
  }
};
