import { RouterView } from 'vue-router';
import { IconMenuLine, TransitionSlide } from '@/antdvx';
import { KeepAlive, computed, defineComponent } from 'vue';

import { AppStore } from '@/app/core/store';
import { NavUser } from '@/app/layout/shared/user';
import { Sidebar } from '@/app/layout/shared/sidebar';
import { NavLanguage } from '@/app/layout/shared/language';

import $styles from './layout-sidebar.module.less';

const NavHeader = defineComponent({
  name: 'NavHeader',
  setup() {
    const collapsed = computed({
      get: () => AppStore.state.collapsed,
      set(val) {
        AppStore.setCollapsed(val);
      }
    });

    const theme = computed({
      get: () => AppStore.state.theme,
      set(val) {
        AppStore.setTheme(val);
      }
    });

    return {
      collapsed,
      theme
    };
  },
  render(ctx) {
    return (
      <header class={$styles.header}>
        <div class='tw-flex-initial tw-self-center tw-pt-2 tw-pb-2'>
          <div
            class={$styles.folder}
            onClick={() => {
              ctx.collapsed = !ctx.collapsed;
            }}>
            <IconMenuLine color='primary' />
          </div>
        </div>
        <div class='tw-flex-1 tw-self-center'></div>
        <div class='tw-flex-initial'>
          <NavUser />
        </div>
        <div class='tw-flex-initial'>
          <NavLanguage />
        </div>
      </header>
    );
  }
});

/**
 * 侧边导航栏 母版页
 */
export const LayoutSidebar = defineComponent({
  name: 'LayoutSidebar',
  setup() {
    const theme = computed({
      get: () => AppStore.state.theme,
      set(val) {
        AppStore.setTheme(val);
      }
    });

    return {
      theme
    };
  },
  render() {
    return (
      <div class={$styles.wrap}>
        <Sidebar />
        <div class='tw-flex-1 tw-overflow-hidden'>
          <div class='tw-flex tw-flex-col tw-h-full'>
            <div class='tw-flex-initial'>
              <NavHeader />
            </div>
            <div class='tw-flex-1 tw-bg-gray-100 tw-overflow-hidden'>
              <RouterView
                v-slots={{
                  default({ Component, route }) {
                    const matchedRoute = route.matched.find((x) => x.components.default.name === Component.type.name) ?? route;
                    return Component ? (
                      <TransitionSlide>
                        {matchedRoute?.meta?.keepAlive ? (
                          <KeepAlive>
                            <Component key={matchedRoute.fullPath} />
                          </KeepAlive>
                        ) : (
                          <Component key={matchedRoute.fullPath} />
                        )}
                      </TransitionSlide>
                    ) : undefined;
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
});
