<template>
  <div class="tw-flex tw-flex-col tw-h-full">
    <div class="tw-p-4 tw-space-y-4 box-shadow-bottom">
      <div class="tw-text-lg tw-space-x-4">
        <span>可拖拽两栏布局</span>
        <XButton @click="toggleCollapsed">{{ collapsed ? '展开' : '折叠' }}</XButton>
      </div>
    </div>
    <div class="tw-flex-1 tw-overflow-hidden">
      <GridDragable ref="dragRef" v-model:collapsed="collapsed">
        <template #left>
          <ScrollView ref="scrollViewRef" fill-y scroll-x scroll-y loading-text="Loading project..." :initialize="loadData(3000)">
            <XButtonRefresh @click="reload">reload</XButtonRefresh>
            <div v-for="arr in list">
              <div class="tw-p-2">
                <span v-for="item in arr" class="tw-p-2">{{ item }}</span>
              </div>
            </div>
          </ScrollView>
        </template>
        <template #right>
          <ScrollView fill-y scroll-x scroll-y>
            <div class="tw-p-4">right</div>
          </ScrollView>
        </template>
      </GridDragable>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Input, InputSearch } from 'ant-design-vue';
import { ANTDVX_SIZES, GridDragable, ScrollView, XButton, XButtonRefresh } from '@/antdvx';
import { timer } from 'rxjs';

export default defineComponent({
  components: {
    XButton,
    ScrollView,
    GridDragable,
    XButtonRefresh,
    [Input.name]: Input,
    [InputSearch.name]: InputSearch
  },
  setup() {
    const scrollViewRef = ref<any>();
    const dragRef = ref();
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
      sizes: ANTDVX_SIZES.filter((x) => x !== 'mini'),
      scrollViewRef,
      dragRef,
      list,
      collapsed,
      loadData,
      reload,
      toggleCollapsed
    };
  }
});
</script>
