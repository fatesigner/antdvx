import { timer } from 'rxjs';
import { defineComponent, ref } from 'vue';
import { AsyncSection, XButtonRefresh } from 'antdvx';

import { PageWrapper } from '@/app/shared/page-wrapper';

export default defineComponent({
  setup() {
    let i = 0;

    const asyncSectionRef = ref();

    const asyncSectionLoad = (duration?: number, error?: boolean) => {
      return async () => {
        return timer(duration ?? 2000)
          .toPromise()
          .then(() => {
            i++;
            if (i % 2 === 0) {
              throw new Error('Load failed, please try again.');
            }
            if (error) {
              throw new Error('Load failed, please try again.');
            } else {
              return {
                text: 'zzzzzzzzzzzzzzzzzzz'
              };
            }
          });
      };
    };

    const load = () => {
      return asyncSectionRef.value.reload();
    };

    return {
      asyncSectionRef,
      asyncSectionLoad,
      load
    };
  },
  render(ctx) {
    return (
      <PageWrapper title='Async Action'>
        <div class='tw-p-2'>
          <div class='tw-space-y-2 tw-bg-white tw-p-4'>
            <div class='tw-border tw-border-gray-300 tw-p-2'>
              <AsyncSection
                class='tw-p-4 tw-text-center'
                loading-text='Loading project...'
                initialize={ctx.asyncSectionLoad(3000)}
                v-slots={{
                  default({ data, reload }) {
                    return [
                      <span>{data.text}</span>,
                      <XButtonRefresh only-icon color='primary' size='small' type='link' handler={reload} />
                    ];
                  }
                }}
              />
            </div>
            <div class='tw-mt-4 tw-text-lg'>
              Async Section immediate = false
              <XButtonRefresh only-icon color='primary' size='small' type='link' handler={ctx.load} />
            </div>
            <div class='tw-border tw-border-gray-300 tw-p-2'>
              <AsyncSection
                ref='asyncSectionRef'
                loading-text='Loading project...'
                initialize={ctx.asyncSectionLoad(2000)}
                immediate={false}
                v-slots={{
                  default({ reload }) {
                    return Array.from(new Array(10)).map((x, i) => (
                      <div class='tw-flex tw-items-center tw-space-x-2'>
                        <XButtonRefresh only-icon color='primary' size='small' type='link' handler={reload} />
                        <div>{i}</div>
                      </div>
                    ));
                  }
                }}
              />
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }
});
