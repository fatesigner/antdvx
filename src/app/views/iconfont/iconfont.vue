<template>
  <PageWrapper title="Iconfont">
    <div class="tw-p-2">
      <div class="tw-p-4 tw-space-y-4 tw-bg-white">
        <div class="tw-grid md:tw-grid-cols-2 tw-gap-4">
          <div class="tw-flex tw-items-center tw-space-x-2">
            <Icon4kFill />
            <Icon4kFill class="tw-align-middle tw-text-lg tw-text-blue-600" style="font-size: 30px; color: red" color="green" scale="1.4" rotate="90" />
          </div>
        </div>
      </div>
    </div>
  </PageWrapper>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Icon4kFill, ScrollView } from '@/antdvx';

import { PageWrapper } from '@/app/shared/page-wrapper';

export default defineComponent({
  components: {
    Icon4kFill,
    ScrollView,
    PageWrapper
  },
  setup() {
    return {};
  }
});
</script>
