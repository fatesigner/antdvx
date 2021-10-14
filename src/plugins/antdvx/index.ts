/**
 * Antdvx
 */

import { merge } from 'lodash-es';
import { message, notification } from 'ant-design-vue';
import { setAntdvxPipesConfig, setRequestAdapter } from '@/antdvx';

import { i18n } from '@/i18n';
import { httpService } from '@/app/services';

import './theme.less';

export const Antdvx = {
  install() {
    // 设置 Http 适配器
    setRequestAdapter((options) => {
      return httpService.request(options);
    });

    // 配置 pipes
    setAntdvxPipesConfig({
      dateFormat: 'YYYY',
      fixed: {
        digits: 3,
        mode: 'normal'
      },
      currencyFormat: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 3,
        maximumFractionDigits: 3
      })
    });

    notification.config({
      duration: 2,
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
        return import('@/antdvx/i18n/locales/zh-CN').then((res) => {
          return res.default;
        });
      } else {
        return import('@/antdvx/i18n/locales/en-US').then((res) => {
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