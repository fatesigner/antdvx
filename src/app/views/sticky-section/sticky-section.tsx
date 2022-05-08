import { defineComponent } from 'vue';
import { IconArrowDownSLine, StickySection } from '@/antdvx';

import { PageWrapper } from '@/app/shared/page-wrapper';

export const StickySectionView = defineComponent({
  name: 'StickySectionView',
  render() {
    return (
      <PageWrapper title='Sticky Section' overflow='scroll'>
        <StickySection
          class='tw-sticky tw-top-0 tw-bottom-0 tw-z-10'
          className='tw-cursor-pointer'
          title='Click to show Package'
          shadow-top
          shadow-bottom
          v-slots={{
            default({ sticky }) {
              return (
                <div class='tw-flex tw-items-center tw-space-x-2 tw-bg-white tw-p-4'>
                  <h2 class='tw-m-0'>Package</h2>
                  <IconArrowDownSLine scale='1.5' v-show={sticky} />
                </div>
              );
            }
          }}
        />
        <div class='tw-p-4'>
          {Array.from(new Array(100)).map((x, index) => (
            <div>{index}</div>
          ))}
        </div>
        <StickySection
          class='tw-sticky tw-top-0 tw-bottom-0 tw-z-10'
          className='tw-cursor-pointer'
          title='Click to show Cost To Complete'
          shadow-top
          shadow-bottom
          v-slots={{
            default({ sticky }) {
              return (
                <div class='tw-flex tw-items-center tw-space-x-2 tw-bg-white tw-p-4'>
                  <h2 class='tw-m-0'>Cost To Complete</h2>
                  <IconArrowDownSLine scale='1.5' v-show={sticky} />
                </div>
              );
            }
          }}
        />
        <div class='tw-p-4'>
          {Array.from(new Array(100)).map((x, index) => (
            <div>{index}</div>
          ))}
        </div>
      </PageWrapper>
    );
  }
});
