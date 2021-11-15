import { merge } from 'lodash-es';
import { IXDrawerRefType, createStore } from '@/antdvx';

import { LanguageType, i18n } from '@/app/i18n';
import { localStorageService } from '@/app/core/services';

const storageKey = 'APP_STORE';

// 加载已缓存的数据
const state: {
  // 语言
  lang: LanguageType;
  theme: 'light' | 'dark';
} = merge(
  {
    lang: i18n._.global.locale as any,
    theme: 'light'
  },
  localStorageService.get(storageKey)
);

export const AppStore = createStore(state, function (state) {
  // 创建弹出层引用集合
  const popupRefs: {
    individuationDrawer: IXDrawerRefType<any, any>;
  } = {
    individuationDrawer: undefined
  };

  /**
   * 获取弹出层集合
   */
  const getPopupRefs = () => {
    return popupRefs;
  };

  /**
   * 设置语言
   * @param lang
   */
  const setLang = (lang: LanguageType) => {
    state.lang = lang;
    i18n.set(lang);
    localStorageService.set(storageKey, state);
  };

  /**
   * 设置主题
   * @param theme
   */
  const setTheme = (theme) => {
    state.theme = theme;
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
    setLang,
    setTheme,
    getPopupRefs
  };
});
