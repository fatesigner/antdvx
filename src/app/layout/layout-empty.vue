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

import { Language } from '@/app/shared/language';
import { NotFound } from '@/app/shared/exception';

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

<style lang="less" module>
.language {
  position: fixed;
  top: 10px;
  right: 10px;
}
</style>
