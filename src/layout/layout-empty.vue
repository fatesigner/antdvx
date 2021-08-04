<template>
  <div :class="$style.language">
    <Language />
  </div>
  <template v-if="status.code === 404">
    <NotFound :title="status.message" />
  </template>
  <template v-else>
    <RouterView v-slot="{ Component }">
      <Transition name="router-fade" mode="out-in">
        <KeepAlive v-if="$route.meta && $route.meta.keepAlive">
          <Component :is="Component" />
        </KeepAlive>
        <Component v-else :is="Component" />
      </Transition>
    </RouterView>
  </template>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import NotFound from '@/shared/error/not-found.vue';
import Language from '@/shared/language/language.vue';

export default defineComponent({
  components: {
    Language,
    NotFound
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

.language {
  position: fixed;
  top: 10px;
  right: 10px;
}
</style>
