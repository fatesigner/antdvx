/**
 * Antdvx
 */

import { merge } from 'lodash-es';
import { setRequestAdapter } from 'antdvx';
import { message, notification } from 'ant-design-vue';

// VxeTable
import 'xe-utils';
import VXETable from 'vxe-table';
import 'vxe-table/lib/style.css';

import { i18n } from '@/i18n';
import { httpService } from '@/app/services';

// 因为涉及到样式覆盖，所以这里不做按需加载，直接导入所有样式
import 'ant-design-vue/dist/antd.less';
import 'antdvx/components/iconfont/css/iconfont.css';
import 'antdvx/styles/classic.less';

export const Antdvx = {
  install(app) {
    app.use(VXETable);

    // 设置 Http 适配器
    setRequestAdapter((options) => {
      return httpService.request(options);
    });

    notification.config({
      duration: 3,
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
