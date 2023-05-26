import { computed, defineComponent, KeepAlive } from 'vue';
import { RouterView } from 'vue-router';
import { MenuOutlined } from '@ant-design/icons-vue';
import { TransitionSlide } from 'antdvx';
import { getMatchedRoute } from 'antdvx/helpers';

import { AppStore } from '@/app/core/store';
import { NavLanguage } from '@/app/layout/shared/language';
import { Sidebar } from '@/app/layout/shared/sidebar';
import { NavUser } from '@/app/layout/shared/user';

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
        <div class='tw-flex-initial tw-self-center tw-pb-2 tw-pt-2'>
          <div
            class={$styles.folder}
            onClick={() => {
              ctx.collapsed = !ctx.collapsed;
            }}>
            <MenuOutlined color='primary' />
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
export default defineComponent({
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
          <div class='tw-flex tw-h-full tw-flex-col'>
            <div class='tw-flex-initial'>
              <NavHeader />
            </div>
            <div class='tw-flex-1 tw-overflow-hidden tw-bg-gray-100'>
              <RouterView
                v-slots={{
                  default({ Component, route }) {
                    const { key, matchedRoute } = getMatchedRoute(Component, route);
                    return Component ? (
                      <TransitionSlide>
                        {matchedRoute?.meta?.keepAlive ? (
                          <KeepAlive>
                            <Component key={key} />
                          </KeepAlive>
                        ) : (
                          <Component />
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
