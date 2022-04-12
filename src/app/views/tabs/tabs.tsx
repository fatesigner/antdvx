import { defineComponent } from 'vue';
import { ANTDVX_SIZES, XTabs } from '@/antdvx';

import { PageWrapper } from '@/app/shared/page-wrapper';

export const TabsView = defineComponent({
  name: 'TabsView',
  setup() {
    return {};
  },
  render(ctx) {
    return (
      <PageWrapper title='Tabs' overflow='scroll'>
        <div class='tw-p-4 tw-space-y-4'>
          <div class='tw-text-lg'>Tabs（标签页）</div>
          <XTabs />
        </div>
      </PageWrapper>
    );
  }
});
