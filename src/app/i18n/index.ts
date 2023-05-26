/**
 * index
 */

import { createVueI18n } from '@fatesigner/i18n';
import { ValueOf } from '@fatesigner/typed';
import { convertModelArrToEnum } from '@fatesigner/utils';

import { ENV } from '@/app/core/constants';

export * from './messages';

// 定义当前可切换的 language 类型
export const Languages = convertModelArrToEnum([
  {
    name: 'CN',
    value: 'zh-CN',
    text: '简体中文'
  },
  {
    name: 'US',
    value: 'en-US',
    text: 'English'
  }
]);

export type LanguageType = ValueOf<typeof Languages.enum>;

const modules = import.meta.glob('./locales/*.ts');
console.log(modules);

// 创建 i18n
export const i18n = createVueI18n(
  {
    locale: ENV.APP_LANG,
    messages: {
      // 同步加载默认语言包，因为使用按需加载的方式，所以在此不导入其他语言包
      // [ENV.APP_LANG]: modules[ENV.APP_LANG]
    },
    // 是否使用 vue-i18n Legacy API 模式，默认为 true
    legacy: true,
    // 当前不存在 message 键时，将会显式回退到指定的语言环境
    fallbackLocale: ENV.APP_LANG,
    // 只保留那些完全没有翻译给定关键字的警告
    silentFallbackWarn: true
  },
  {
    loadLocale(lang) {
      return import(`./locales/${lang}.ts`).then(async (msg) => {
        return msg.default;
      });
    }
  }
);

// 初始化语言
i18n.set(ENV.APP_LANG as any);

// 注册勾子，当语言包加载完成后执行
i18n.hooks.afterSet.tap(function (lang) {
  // request.headers['Accept-Language'] = lang;
  document.querySelector('html').setAttribute('lang', lang);
});
