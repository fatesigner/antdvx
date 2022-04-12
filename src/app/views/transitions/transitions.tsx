import { defineComponent, ref } from 'vue';
import { Alert, Radio, RadioGroup, TabPane, Tabs } from 'ant-design-vue';
import { ANTDVX_DIRECTIONS, ANTDVX_SIZES, SpinnerLoading, TransitionCollapse, TransitionOpacity, TransitionSlide, TransitionZoom } from '@/antdvx';

import { PageWrapper } from '@/app/shared/page-wrapper';

export const TransitionsView = defineComponent({
  name: 'TransitionsView',
  setup() {
    const activeKey = ref('1');
    const direction = ref<typeof ANTDVX_DIRECTIONS[number]>('down');
    const collapsed = ref(false);
    const zoom = ref(false);
    const opacity = ref(false);

    return {
      activeKey,
      direction,
      collapsed,
      zoom,
      opacity,
      directions: ANTDVX_DIRECTIONS,
      sizes: ANTDVX_SIZES.filter((x) => x !== 'mini')
    };
  },
  render(ctx) {
    return (
      <PageWrapper title='Transitions' overflow='scroll'>
        <div class='tw-p-2'>
          <div class='tw-grid lg:tw-grid-cols-2 tw-gap-4 tw-p-4 tw-bg-white'>
            <div class='tw-p-4 tw-border tw-border-gray-300 tw-space-y-4'>
              <div class='tw-text-lg'>Slide（滑动）</div>
              <div class='tw-space-x-2'>
                <label>方向：</label>
                <RadioGroup v-model={[ctx.direction, 'value']}>
                  {ctx.directions.map((x) => (
                    <Radio value={x}>{x}</Radio>
                  ))}
                </RadioGroup>
              </div>
              <Tabs type='card' size='small' v-model={[ctx.activeKey, 'activeKey']}>
                <TabPane key='1' tab='tab 1' />
                <TabPane key='2' tab='tab 2' />
              </Tabs>
              <TransitionSlide direction={ctx.direction}>
                {ctx.activeKey === '1' ? (
                  <div>label 1{Array.from(new Array(10).map((x, i) => <div>{i}</div>))}</div>
                ) : ctx.activeKey === '2' ? (
                  <div>label 2{Array.from(new Array(15).map((x, i) => <div>{i}</div>))}</div>
                ) : undefined}
              </TransitionSlide>
            </div>
            <div class='tw-p-4 tw-border tw-border-gray-300 tw-space-y-4'>
              <div class='tw-text-lg'>Collapse（展开/收缩）</div>
              <div class='tw-space-x-2'>
                <label>切换：</label>
                <RadioGroup v-model={[ctx.collapsed, 'value']}>
                  <Radio value={false}>展开</Radio>
                  <Radio value={true}>收起</Radio>
                </RadioGroup>
              </div>
              <TransitionCollapse>
                {ctx.collapsed ? (
                  <div>
                    <Alert
                      type='error'
                      v-slots={{
                        description() {
                          return <div>dasdasfasdssssssssssssssssssssssssssssss</div>;
                        }
                      }}
                    />
                  </div>
                ) : undefined}
              </TransitionCollapse>
            </div>
            <div class='tw-p-4 tw-border tw-border-gray-300 tw-space-y-4'>
              <div class='tw-text-lg'>Zoom（缩放）</div>

              <div class='tw-space-x-2'>
                <label>切换：</label>
                <RadioGroup v-model={[ctx.zoom, 'value']}>
                  <Radio value={true}>显示</Radio>
                  <Radio value={false}>隐藏</Radio>
                </RadioGroup>
              </div>
              <div class='tw-relative tw-h-64 tw-overflow-auto'>
                <TransitionZoom>
                  {ctx.zoom ? (
                    <div class='tw-absolute tw-top-4 tw-left-1/2 tw-transform tw--translate-x-1/2'>
                      <Alert
                        type='error'
                        v-slots={{
                          description() {
                            return <div>dasdasfasdssssssssssssssssssssssssssssss</div>;
                          }
                        }}
                      />
                    </div>
                  ) : undefined}
                </TransitionZoom>
                <TransitionZoom>
                  {!ctx.zoom ? (
                    <div class='tw-absolute tw-top-4 tw-left-1/2 tw-transform tw--translate-x-1/2'>
                      <SpinnerLoading />
                    </div>
                  ) : undefined}
                </TransitionZoom>
              </div>
            </div>
            <div class='tw-p-4 tw-border tw-border-gray-300 tw-space-y-4'>
              <div class='tw-text-lg'>Opacity（透明）</div>
              <div class='tw-space-x-2'>
                <label>切换：</label>
                <RadioGroup v-model={[ctx.opacity, 'value']}>
                  <Radio value={true}>显示</Radio>
                  <Radio value={false}>隐藏</Radio>
                </RadioGroup>
              </div>
              <div class='tw-relative tw-h-64 tw-overflow-auto'>
                <TransitionOpacity mode='out-in'>
                  {ctx.opacity ? (
                    <div>label 1{Array.from(new Array(10).map((x, i) => <div>{i}</div>))}</div>
                  ) : (
                    <div>label 2{Array.from(new Array(15).map((x, i) => <div>{i}</div>))}</div>
                  )}
                </TransitionOpacity>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }
});
