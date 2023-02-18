import { defineComponent } from 'vue';

import { PageWrapper } from '@/app/shared/page-wrapper';

/**
 * 主页
 */
export default defineComponent({
  setup() {
    return {};
  },
  render() {
    return (
      <PageWrapper bgGray footer overflow='scroll'>
        <div class='tw-p-4'>Portal</div>
      </PageWrapper>
    );
  }
});
