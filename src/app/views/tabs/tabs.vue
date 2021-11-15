<template>
  <ScrollView fill-y scroll-y>
    <div class="tw-p-4 tw-space-y-4">
      <div class="tw-text-lg">Tabs（标签页）</div>
      <XTabs></XTabs>
    </div>
  </ScrollView>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ANTDVX_SIZES, ScrollView, XTabs } from '@/antdvx';

export default defineComponent({
  components: {
    XTabs,
    ScrollView
  },
  setup() {
    return {
      sizes: ANTDVX_SIZES.filter((x) => x !== 'mini')
    };
  }
});
</script>
