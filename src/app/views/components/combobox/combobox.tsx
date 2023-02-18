import { defineComponent, reactive, ref } from 'vue';
import { ANTDVX_SIZES, XButton, XCombobox } from 'antdvx';

import { PageWrapper } from '@/app/shared/page-wrapper';

export default defineComponent({
  setup() {
    const visible = ref(true);

    const list = reactive({
      key: '1',
      items: [
        {
          name: '1',
          label: 'project1'
        },
        {
          name: '2',
          label: 'project2'
        },
        {
          name: '3',
          label: 'project3'
        }
      ]
    });

    return {
      visible,
      list
    };
  },
  render(ctx) {
    return (
      <PageWrapper title='Combobox' overflow='scroll'>
        <div class='tw-p-2'>
          <div class='tw-p-4 tw-space-y-4 tw-bg-white'>
            <div class='tw-text-lg'>单选</div>
            <XButton
              onClick={() => {
                ctx.visible = !ctx.visible;
              }}>
              Toggle
            </XButton>
            {ctx.visible
              ? ANTDVX_SIZES.filter((x) => x !== 'mini').map((size) => (
                  <div class='tw-grid md:tw-grid-cols-2 tw-gap-4'>
                    <div class='tw-flex flex-wrap tw-items-center tw-gap-2'>
                      <div class='tw-flex-initial'>筛选：</div>
                      <XCombobox
                        class='tw-w-36'
                        autoBind
                        clearable
                        size={size}
                        dataValueField='name'
                        dataTextField='label'
                        options={ctx.list.items}
                        v-model={[ctx.list.key, 'value']}
                        placeholder='选择一个项目...'
                      />
                      <XButton size={size}>查询 / Query</XButton>
                    </div>
                  </div>
                ))
              : undefined}
            <div class='tw-text-lg'>多选</div>
          </div>
        </div>
      </PageWrapper>
    );
  }
});
