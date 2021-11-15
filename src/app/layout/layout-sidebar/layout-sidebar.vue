<template>
  <div class="tw-flex tw-h-full tw-overflow-hidden">
    <Sidebar :theme="theme" />
    <div class="tw-flex-1 tw-overflow-hidden">
      <div class="tw-flex tw-flex-col tw-h-full">
        <div class="tw-flex-initial">
          <AppHeader />
        </div>
        <div class="tw-flex-1 tw-overflow-hidden tw-h-full">
          <TransitionSlide mode="out-in">
            <Unauthorized v-if="status.code === 403" />
          </TransitionSlide>
          <template v-if="status.code === 200">
            <RouterView v-slot="{ Component }">
              <TransitionSlide mode="out-in">
                <KeepAlive v-if="$route.meta && $route.meta.keepAlive">
                  <Component :is="Component" :key="$route.meta.key" />
                </KeepAlive>
                <Component :is="Component" v-else :key="$route.meta.key" />
              </TransitionSlide>
            </RouterView>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { TransitionSlide } from '@/antdvx';
import { computed, defineComponent } from 'vue';

import { Language } from '@/app/shared/language';
import { ProgressBar } from '@/app/shared/progress-bar';
import { NotFound, Unauthorized } from '@/app/shared/exception';
import { LayoutSidebarStore } from '@/app/layout/layout-sidebar/store';

import { User } from './components/user';
import { Sidebar } from './components/sidebar';
import { AppHeader } from './components/header';

export default defineComponent({
  components: {
    NotFound,
    Language,
    Unauthorized,
    ProgressBar,
    AppHeader,
    User,
    Sidebar,
    TransitionSlide
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
