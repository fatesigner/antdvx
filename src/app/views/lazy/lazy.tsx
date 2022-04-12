import { timer } from 'rxjs';
import { defineComponent, reactive, ref, watch } from 'vue';
import { Checkbox, Input, TabPane, Tabs } from 'ant-design-vue';
import { ComponentView, TransitionSlide, defineAsyncComponent } from '@/antdvx';

import { PageWrapper } from '@/app/shared/page-wrapper';

export const LazyView = defineComponent({
  name: 'LazyView',
  setup() {
    const activeKey = ref<string>();
    const activeKey2 = ref<string>();

    const input = ref();
    const failed = ref(false);

    const comps = reactive([
      {
        name: 'tab1',
        label: 'tab1',
        props: {
          id: 1,
          text: '1'
        },
        component: defineAsyncComponent(
          async () => {
            await timer(2000).toPromise();
            return import('./tab1').then(({ Tab1 }) => ({ defaut: Tab1 }));
          },
          {
            width: 300,
            height: 400
          }
        )
      },
      {
        name: 'tab2',
        label: 'tab2',
        props: {
          id: 2,
          text: '2'
        },
        component: defineAsyncComponent({
          loader: async () => {
            await timer(2000).toPromise();
            if (failed.value) {
              throw new Error('tab2 error');
            } else {
              return import('./tab2').then(({ Tab2 }) => ({ defaut: Tab2 }));
            }
          }
        })
      },
      {
        name: 'tab3',
        label: 'tab3',
        props: {
          id: 3,
          text: '3'
        },
        component: defineAsyncComponent(async () => {
          await timer(2000).toPromise();
          if (failed.value) {
            throw new Error('123456789');
          } else {
            return import('./tab3').then(({ Tab3 }) => ({ defaut: Tab3 }));
          }
        })
      }
    ]);

    watch(input, (val) => {
      // 更新 component props
      comps[0].props.text = val;
    });

    return {
      input,
      failed,
      activeKey,
      activeKey2,
      comps
    };
  },
  render(ctx) {
    return (
      <PageWrapper title='Lazy' overflow='scroll'>
        <div class='tw-p-2'>
          <div class='tw-p-4 tw-space-y-4 tw-bg-white'>
            <div class='tw-flex tw-items-center tw-space-x-4'>
              <div class='tw-text-lg'>Lazy（延迟组件）</div>
              <Checkbox v-model={[ctx.failed, 'checked']}>Failed</Checkbox>
              <Input class='tw-w-32' v-model={[ctx.input, 'value']} placeholder='更新 text' />
            </div>

            <Tabs type='card' size='small' v-model={[ctx.activeKey, 'activeKey']}>
              {ctx.comps.map((x) => (
                <TabPane key={x.name} tab={x.label} />
              ))}
            </Tabs>

            <div class='tw-p-2 tw-border tw-border-gray-300'>
              <ComponentView animation='opacity' v-model={[ctx.activeKey, 'activeKey']} comps={ctx.comps} keepAlive={false} />
            </div>

            <Tabs type='card' size='small' v-model={[ctx.activeKey, 'activeKey']}>
              {ctx.comps.map((x) => (
                <TabPane key={x.name} tab={x.label} />
              ))}
            </Tabs>

            <div class='tw-p-2 tw-border tw-border-gray-300'>
              <ComponentView
                animation='opacity'
                v-model={[ctx.activeKey2, 'activeKey']}
                comps={ctx.comps}
                keepAlive={false}
                v-slots={{
                  default({ name, component, props }) {
                    return (
                      <TransitionSlide>
                        <div>
                          {name}
                          <component is={component} {...props} />
                        </div>
                      </TransitionSlide>
                    );
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
