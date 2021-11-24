<template>
  <div class="tw-flex tw-h-full tw-overflow-hidden">
    <Sidebar :theme="theme" />
    <div class="tw-flex-1 tw-overflow-hidden">
      <div class="tw-flex tw-flex-col tw-h-full">
        <div class="tw-flex-initial">
          <AppHeader />
        </div>
        <div class="tw-flex-1 tw-bg-gray-100 tw-overflow-hidden">
          <ScrollView fill-y scroll-y native>
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
            <XBackTop />
          </ScrollView>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue';
import { ScrollView, TransitionSlide, XBackTop } from '@/antdvx';

import { AppStore } from '@/app/core/store';
import { User } from '@/app/shared/user';
import { Sidebar } from '@/app/shared/sidebar';
import { AppHeader } from '@/app/shared/header';
import { Language } from '@/app/shared/language';
import { ProgressBar } from '@/app/shared/progress-bar';
import { NotFound, Unauthorized } from '@/app/shared/exception';

export default defineComponent({
  components: {
    User,
    Sidebar,
    AppHeader,
    NotFound,
    Language,
    ProgressBar,
    Unauthorized,
    XBackTop,
    ScrollView,
    TransitionSlide
  },
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
  computed: {
    status() {
      return { code: 200 };
    }
  }
});
</script>
