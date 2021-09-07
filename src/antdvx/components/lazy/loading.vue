<template>
  <div :class="$style.wrap" ref="wrap">
    <SpinnerLoading size="large" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

import SpinnerLoading from '../loading/spinner-loading.vue';

export default defineComponent({
  components: { SpinnerLoading },
  setup() {
    const $wrap = ref(null);

    onMounted(() => {
      if ($wrap.value && $wrap.value.parentElement) {
        $wrap.value.style.width = $wrap.value.parentElement.offsetWidth + 'px';
        $wrap.value.style.height = $wrap.value.parentElement.offsetHeight + 'px';
      }
    });

    return {
      wrap: $wrap
    };
  }
});
</script>

<style lang="less" module>
.wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
