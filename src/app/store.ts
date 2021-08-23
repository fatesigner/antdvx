/**
 * store
 */

import { merge } from 'lodash-es';
import { createStore } from 'antdvx';

import { LanguageType, i18n } from '@/i18n';
import { localStorageService } from '@/app/services';

const storageKey = 'APP_STORE';

// 加载已缓存的数据
const state: {
  lang: LanguageType;
} = merge(
  {
    lang: i18n._.global.locale as any
  },
  localStorageService.get(storageKey)
);

export const AppStore = createStore(state, function (state) {
  const setLang = (lang: LanguageType) => {
    state.lang = lang;
    i18n.set(lang);
    localStorageService.set(storageKey, state);
  };

  // 若已缓存的语言与 i18n 初始语言不同
  if (state.lang !== i18n._.global.locale) {
    setLang(state.lang);
  }

  // 注册勾子，当语言包加载完成后更新 state
  i18n.hooks.afterSet.tap(function (lang) {
    state.lang = lang as any;
  });

  return {
    setLang
  };
});
