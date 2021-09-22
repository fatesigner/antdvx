<template>
  <div class="tw-flex tw-h-full tw-p-4 tw-space-x-2">
    <div class="tw-flex-1 tw-overflow-hidden tw-border tw-border-red-400">
      <ScrollView ref="scrollViewRef" fill-y scroll-x scroll-y loading-text="Loading project..." :initialize="loadData(3000)">
        <XButtonRefresh @click="reload">reload</XButtonRefresh>
        <div v-for="arr in list">
          <div class="tw-p-2">
            <span v-for="item in arr" class="tw-p-2">{{ item }}</span>
          </div>
        </div>
      </ScrollView>
    </div>
    <div class="tw-flex-1 tw-overflow-hidden tw-border tw-border-red-400">
      <ScrollView ref="scrollViewRef2" fill-y native loading-text="Loading project..." :initialize="loadData(3000)">
        <div class="tw-h-full tw-overflow-x-auto tw-overflow-y-auto">
          <XButtonRefresh @click="reload2">reload</XButtonRefresh>
          <div v-for="arr in list">
            <div class="tw-p-2">
              <span v-for="item in arr" class="tw-p-2">{{ item }}</span>
            </div>
          </div>
        </div>
      </ScrollView>
    </div>
  </div>
</template>

<script lang="ts">
import { timer } from 'rxjs';
import { Input } from 'ant-design-vue';
import { defineComponent, ref } from 'vue';
import { ScrollView, XButtonRefresh } from '@/antdvx';

export default defineComponent({
  components: {
    ScrollView,
    XButtonRefresh,
    [Input.name]: Input
  },
  setup() {
    const scrollViewRef = ref<any>();
    const scrollViewRef2 = ref<any>();

    const list = ref([]);

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

    const reload2 = () => {
      scrollViewRef2.value?.reload();
    };

    return {
      scrollViewRef,
      scrollViewRef2,
      list,
      loadData,
      reload,
      reload2
    };
  }
});
</script>
