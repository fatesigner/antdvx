<template>
  <footer :class="['tw-text-center tw-space-y-1', pure ? undefined : $style.footer]">
    <div class="tw-text-xxs tw-text-gray-700">版权声明: Copyright 2021 All Rights Reserved Antdvx</div>
    <div class="tw-text-xxs tw-text-gray-500">(仅支持Edge、谷歌、360安全浏览器使用 )</div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    pure: {
      type: Boolean,
      default: false
    }
  }
});
</script>

<style lang="less" module>
.footer {
  @apply tw-p-4 tw-bg-gray-100;

  border-top: 1px solid #f4f6fc;
}
</style>
