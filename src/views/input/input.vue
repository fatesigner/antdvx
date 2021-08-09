<template>
  <ScrollView>
    <div class="tw-p-4 tw-space-y-4">
      <div class="tw-text-lg">基础</div>
      <div class="tw-grid md:tw-grid-cols-2 tw-gap-4" v-for="size in sizes">
        <div class="tw-flex tw-items-center tw-space-x-2">
          <div class="tw-flex-initial">筛选：</div>
          <AInput class="tw-w-72" :size="size.value" placeholder="搜索患者案例..." />
          <ActionButton outline :size="size.value">搜索</ActionButton>
        </div>
      </div>
    </div>
  </ScrollView>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Input } from 'ant-design-vue';
import { ScrollView } from '@/antdvx/components/scroll-view';
import { ActionButton } from '@/antdvx/components/action-bars';

import { SIZES } from '@/app/constants';

export default defineComponent({
  components: {
    ScrollView,
    ActionButton,
    // Antd
    [Input.name]: Input
  },
  setup() {
    return {
      sizes: SIZES.arr
    };
  }
});
</script>
