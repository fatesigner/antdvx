/**
 * store
 */

import { merge } from 'lodash-es';
import { createStore } from '@/antdvx';

import { localStorageService } from '@/app/services';

const storageKey = 'layout-sidebar';

const state = {
  collapsed: false,
  theme: 'light'
};

// 加载已缓存的数据
merge(state, localStorageService.get(storageKey));

export const LayoutSidebarStore = createStore(state, function (state) {
  return {
    setCollapsed(collapsed: boolean) {
      state.collapsed = collapsed;
      localStorageService.set(storageKey, state);
    },
    setTheme(theme: string) {
      state.theme = theme;
      localStorageService.set(storageKey, state);
    }
  };
});
