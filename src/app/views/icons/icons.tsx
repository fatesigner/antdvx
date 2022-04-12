import { defineComponent } from 'vue';
import { Input } from 'ant-design-vue';
import { ANTDVX_ICON_NAMES } from '@/antdvx';

import { PageWrapper } from '@/app/shared/page-wrapper';

export const IconsView = defineComponent({
  name: 'IconsView',
  render() {
    return (
      <PageWrapper title='Icons' overflow='scroll'>
        <div class='tw-p-2'>
          <div class='tw-p-4 tw-space-y-4 tw-bg-white'>
            <div class='tw-text-lg'>基础</div>
            <div class='tw-grid md:tw-grid-cols-2 tw-gap-4'>
              <div class='tw-flex tw-items-center tw-space-x-2'>
                <div class='tw-flex-initial'>筛选：</div>
                <Input class='tw-w-72' placeholder='搜索图标...' />
              </div>
            </div>
            <div class='tw-flex tw-flex-wrap'>
              {ANTDVX_ICON_NAMES.map((x) => (
                <div class='tw-p-2'>{x}</div>
              ))}
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }
});
