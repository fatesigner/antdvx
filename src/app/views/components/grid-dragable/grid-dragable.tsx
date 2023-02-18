import { timer } from 'rxjs';
import { defineComponent, ref } from 'vue';
import { GridDragable, ScrollView, XButton, XButtonRefresh } from 'antdvx';

import { PageWrapper } from '@/app/shared/page-wrapper';

export default defineComponent({
  setup() {
    const dragRef = ref();
    const scrollViewRef = ref<any>();
    const list = ref([]);

    const collapsed = ref(false);

    const toggleCollapsed = () => {
      dragRef.value?.toggleCollapsed();
    };

    const loadData = (duration?: number, error?: boolean) => {
      return async () => {
        return timer(duration ?? 2000)
          .toPromise()
          .then(() => {
            if (error) {
              throw new Error('Load failed, please try again.');
            } else {
              list.value = Array.from(new Array(100)).map((x, index) => Array.from(new Array(50)).map((y, index2) => index + index2));
            }
          });
      };
    };

    const reload = () => {
      scrollViewRef.value?.reload();
    };

    return {
      scrollViewRef,
      dragRef,
      list,
      collapsed,
      loadData,
      reload,
      toggleCollapsed
    };
  },
  render(ctx) {
    return (
      <PageWrapper title='Iconfont' overflow='hidden'>
        <div class='tw-flex tw-flex-col tw-h-full tw-p-2 tw-bg-white'>
          <div class='tw-p-4 tw-space-y-4 box-shadow-bottom'>
            <div class='tw-text-lg tw-space-x-4'>
              <span>可拖拽两栏布局</span>
              <XButton onClick={ctx.toggleCollapsed}>{ctx.collapsed ? '展开' : '折叠'}</XButton>
            </div>
          </div>
          <div class='tw-flex-1 tw-overflow-hidden'>
            <GridDragable
              ref='dragRef'
              v-model={[ctx.collapsed, 'collapsed']}
              v-slots={{
                left() {
                  return (
                    <ScrollView ref='scrollViewRef' fill-y scroll-x scroll-y loading-text='Loading project...' initialize={ctx.loadData(3000)}>
                      <XButtonRefresh onClick={ctx.reload}>reload</XButtonRefresh>
                      {ctx.list.map((arr) => (
                        <div>
                          <div class='tw-p-2'>
                            {arr.map((x) => (
                              <span class='tw-p-2'>{x}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </ScrollView>
                  );
                },
                right() {
                  return (
                    <ScrollView fill-y scroll-x scroll-y>
                      <div class='tw-p-4'>right</div>
                    </ScrollView>
                  );
                }
              }}
            />
          </div>
        </div>
      </PageWrapper>
    );
  }
});
