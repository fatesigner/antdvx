import { defineComponent, ref } from 'vue';
import { Input, InputSearch } from 'ant-design-vue';
import { ANTDVX_SIZES, XButton, XCombobox } from 'antdvx';
import { focus } from 'antdvx/directives';

import { PageWrapper } from '@/app/shared/page-wrapper';

export default defineComponent({
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
  },
  render(ctx) {
    return (
      <PageWrapper title='Input' overflow='scroll'>
        <div class='tw-p-2'>
          <div class='tw-p-4 tw-space-y-4 tw-bg-white'>
            <div class='tw-text-lg'>文本框</div>

            {ctx.sizes.map((size) => (
              <div class='tw-grid md:tw-grid-cols-2 tw-gap-4'>
                <div class='tw-flex flex-wrap tw-items-center tw-space-x-2'>
                  <div class='tw-flex-initial'>筛选：</div>
                  <Input class='tw-w-72' size={size} placeholder='搜索患者案例...' />
                  <XButton size={size}>查询 / Query</XButton>
                </div>
              </div>
            ))}

            <div class='tw-text-lg'>单选</div>

            {ctx.sizes.map((size) => (
              <div class='tw-grid md:tw-grid-cols-2 tw-gap-4'>
                <div class='tw-flex flex-wrap tw-items-center tw-space-x-2'>
                  <div class='tw-flex-initial'>筛选：</div>
                  <XCombobox class='tw-w-24' size={size} options={['选项1', '选项2']} placeholder='请选择' />
                  <XButton size={size}>查询 / Query</XButton>
                </div>
              </div>
            ))}

            <div class='tw-text-lg'>多选</div>

            {ctx.sizes.map((size) => (
              <div class='tw-flex flex-wrap tw-items-center tw-space-x-2'>
                <div class='tw-flex-initial'>筛选：</div>
                <XCombobox class='tw-w-64' multiple size={size} options={['选项1', '选项2']} placeholder='请选择' />
                <XButton size={size}>查询 / Query</XButton>
              </div>
            ))}

            <XButton onClick={ctx.toggle}>Toggle</XButton>

            {ctx.visible ? (
              <div>
                <InputSearch class='tw-w-52' placeholder='input search text' enter-button v-focus="{ focus, selectors: 'input' }" />
                <input class='tw-border-2' v-focus='{ onBlur: ctx.onBlur, onFocus: ctx.onFocus }' />
              </div>
            ) : undefined}
          </div>
        </div>
      </PageWrapper>
    );
  }
});
