<template>
  <div class="tw-flex tw-h-full tw-overflow-hidden">
    <Sidebar :theme="theme" />
    <div class="tw-flex-1 tw-overflow-hidden">
      <div class="tw-flex tw-flex-col tw-h-full">
        <div class="tw-flex-initial">
          <AppHeader />
        </div>
        <div class="tw-flex-1 tw-overflow-hidden tw-h-full">
          <TransitionRouter>
            <Unauthorized v-if="status.code === 403" />
          </TransitionRouter>
          <template v-if="status.code === 200">
            <RouterView v-slot="{ Component }">
              <TransitionRouter>
                <KeepAlive v-if="$route.meta && $route.meta.keepAlive">
                  <Component :is="Component" :key="$route.meta.key" />
                </KeepAlive>
                <Component :is="Component" v-else :key="$route.meta.key" />
              </TransitionRouter>
            </RouterView>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue';

import NotFound from '@/shared/error/not-found.vue';
import Unauthorized from '@/shared/error/unauthorized.vue';
import ProgressBar from '@/shared/progress-bar/progress-bar.vue';
import Language from '@/shared/language/language.vue';

import User from './components/user/user.vue';
import Header from './components/header/header.vue';
import Sidebar from './components/sidebar/sidebar.vue';
import { LayoutSidebarStore } from '@/layout/layout-sidebar/store';

export default defineComponent({
  components: {
    NotFound,
    Language,
    Unauthorized,
    ProgressBar,
    AppHeader: Header,
    User,
    Sidebar
  },
  setup() {
    const theme = computed({
      get: () => LayoutSidebarStore.state.theme,
      set(val) {
        LayoutSidebarStore.setTheme(val);
      }
    });

    return {
      theme
    };
  },
  computed: {
    status() {
      return { code: 200 };
    }
  }
});
</script>

<style lang="scss" module>
@import '@/theme/default.theme';

.wrap {
  height: 100%;
}

.header {
  position: relative;

  &::after {
    position: absolute;
    right: 0;
    bottom: -3px;
    left: 0;
    z-index: 3;
    height: 3px;
    pointer-events: none;
    content: '';
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0, rgba(0, 0, 0, 0.2) 1px, rgba(0, 0, 0, 0.1) 0, transparent);
    opacity: 0.6;
    transition-timing-function: cubic-bezier(0.2, 0, 0, 1);
    transition-duration: 0.22s;
    transition-property: left, opacity, width;
  }
}

.icon {
  font-size: 20px;
}

.title {
  margin-bottom: 0;
  font-size: 18px;
  color: inherit;
}

.logo {
  color: #ff4500;

  &:hover {
    color: #096dd9;
  }
}
</style>
