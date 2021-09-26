<template>
  <ScrollView fill-y scroll-y>
    <div class="tw-p-4 tw-space-y-4">
      <div class="tw-text-lg">基础</div>
      <div class="tw-grid md:tw-grid-cols-2 tw-gap-4" v-for="size in sizes">
        <div class="tw-flex tw-items-center tw-space-x-2">
          <div class="tw-flex-initial">筛选：</div>
          <AInput class="tw-w-72" :size="size" placeholder="搜索患者案例..." disabled />
          <XButton :size="size">搜索</XButton>
        </div>
      </div>

      <XButton @click="toggle">Toggle</XButton>

      <div v-if="visible">
        <AInputSearch class="tw-w-52" placeholder="input search text" enter-button v-focus="{ focus, selectors: 'input' }" />
        <input class="tw-border-2" v-focus="{ onBlur, onFocus }" />
      </div>
    </div>
  </ScrollView>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Input, InputSearch } from 'ant-design-vue';
import { ANTDVX_SIZES, ScrollView, XButton } from '@/antdvx';
import { focus } from '@/antdvx/directives';

export default defineComponent({
  components: {
    XButton,
    ScrollView,
    [Input.name]: Input,
    [InputSearch.name]: InputSearch
  },
  directives: {
    focus
  },
  setup() {
    const focus = ref(true);
    const visible = ref(false);

    const onBlur = (e) => {
      console.log('onBlur', e);
      focus.value = true;
    };

    const onFocus = (e) => {
      console.log('onFocus', e);
      focus.value = false;
    };

    const toggle = () => {
      visible.value = !visible.value;
    };

    return {
      sizes: ANTDVX_SIZES.filter((x) => x !== 'mini'),
      focus,
      visible,
      onBlur,
      onFocus,
      toggle
    };
  }
});
</script>
