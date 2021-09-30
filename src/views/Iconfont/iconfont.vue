<template>
  <ScrollView fill-y scroll-y>
    <div class="tw-p-4 tw-space-y-4">
      <div class="tw-text-lg">Iconfont</div>
      <div class="tw-grid md:tw-grid-cols-2 tw-gap-4">
        <div class="tw-flex tw-items-center tw-space-x-2">
          <Icon4kFill class="tw-align-middle tw-text-lg" style="color: red" />
        </div>
      </div>
    </div>
  </ScrollView>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Icon4kFill, ScrollView } from '@/antdvx';

export default defineComponent({
  components: {
    Icon4kFill,
    ScrollView
  },
  setup() {
    return {};
  }
});
</script>
