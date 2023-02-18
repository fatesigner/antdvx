/**
 * store for Vue
 */

import { merge } from 'lodash-es';
import { createStore } from 'antdvx/helpers';
import { IXDrawerRefType, IXModalRefType } from 'antdvx';

import { LanguageType, i18n } from '@/app/i18n';
import { localStorageService } from '@/app/core/services';
import { ProgressBarStore } from '@/app/shared/progress-bar';

const storageKey = 'APP_STORE';

// 加载已缓存的数据
const state = merge(
  {
    lang: i18n._.global.locale as LanguageType,
    theme: 'light' as 'light' | 'dark',
    collapsed: false
  },
  localStorageService.get(storageKey)
);

export const AppStore = createStore(state, function (state) {
  // 定义全局弹出层引用集合
  const popupRefs: {
    /**
     * 个性化
     */
    individuation?: IXDrawerRefType<any, any>;
    /**
     * 修改密码
     */
    updatePassword?: IXModalRefType<
      {
        readonly: boolean;
        username: string;
      },
      any
    >;
  } = {};

  let scrollRef: {
    scrollTo: (left: number, top: number, duration?: number) => Promise<void>;
  };

  /**
   * 获取弹出层引用
   */
  const getPopupRefs = () => {
    return popupRefs;
  };

  /**
   * 设置弹出层
   */
  const setPopupRefs = (refs: typeof popupRefs) => {
    Object.assign(popupRefs, refs);
  };

  // 显示进度条
  const presentProgressBar = () => {
    ProgressBarStore.present();
  };

  // 关闭进度条
  const dismissProgressBar = () => {
    ProgressBarStore.dismiss();
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

  /**
   * 切换 sidebar 展开/收起
   * @param collapsed
   */
  const setCollapsed = (collapsed: boolean) => {
    state.collapsed = collapsed;
    localStorageService.set(storageKey, state);
  };

  /**
   * 获取 滚动区域视图 的引用
   */
  const getScrollViewRef = () => {
    return scrollRef;
  };

  /**
   * 设置 滚动区域视图 的引用
   * @param ref
   */
  const setScrollViewRef = (ref: any) => {
    scrollRef = ref;
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
    getScrollViewRef,
    setScrollViewRef,
    presentProgressBar,
    dismissProgressBar,
    setLang,
    setTheme,
    setCollapsed,
    getPopupRefs,
    setPopupRefs
  };
});
