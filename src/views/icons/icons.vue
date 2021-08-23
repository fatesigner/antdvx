<template>
  <ScrollView>
    <div class="tw-p-4 tw-space-y-4">
      <div class="tw-text-lg">基础</div>
      <div class="tw-grid md:tw-grid-cols-2 tw-gap-4">
        <div class="tw-flex tw-items-center tw-space-x-2">
          <div class="tw-flex-initial">筛选：</div>
          <AInput class="tw-w-72" placeholder="搜索图标..." />
        </div>
      </div>
      <div class="tw-flex tw-flex-wrap">
        <div class="tw-p-2" v-for="item in icons">
          {{ item }}
        </div>
      </div>
    </div>
  </ScrollView>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Input } from 'ant-design-vue';
import { ANTDVX_ICON_NAMES, ScrollView, XButton } from 'antdvx';

export default defineComponent({
  components: {
    XButton,
    ScrollView,
    [Input.name]: Input
  },
  setup() {
    return {
      icons: ANTDVX_ICON_NAMES
    };
  }
});
</script>
