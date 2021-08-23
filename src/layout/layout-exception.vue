<template>
  <div class="tw-h-full">
    <template v-if="status.code === 404">
      <NotFound :title="status.message" />
    </template>
    <template v-else>
      <KeepAlive v-if="$route.meta && $route.meta.keepAlive">
        <RouterView />
      </KeepAlive>
      <RouterView v-else />
      <ProgressBar />
    </template>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import { NotFound } from '@/shared/exception';

export default defineComponent({
  components: {
    NotFound
  },
  computed: {
    status() {
      return { code: 200 };
    }
  }
});
</script>
