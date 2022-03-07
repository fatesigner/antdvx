<template>
  <div class="tw-p-2 tw-h-full">
    <div class="tw-flex tw-h-full tw-p-4 tw-space-x-2 tw-bg-white">
      <div class="tw-flex-1 tw-overflow-hidden tw-border tw-border-red-400">
        <ScrollView ref="scrollViewRef" fill-y scroll-x scroll-y loading-text="Loading project..." :initialize="initialize">
          <div class="tw-p-2 tw-space-x-2">
            <h2>Scroll view with custom bar</h2>
            <XButtonRefresh @click="reload">Reload</XButtonRefresh>
            <XButtonRefresh @click="appendData">Append Data</XButtonRefresh>
          </div>
          <div v-for="(arr, index) in list" :key="index">
            <div class="tw-p-2">
              <span class="tw-p-2" v-for="item in arr" :key="item">{{ item }}</span>
            </div>
          </div>
          <div class="tw-p-4 tw-text-center tw-bg-gray-100">footer</div>
        </ScrollView>
      </div>
      <div class="tw-flex-1 tw-overflow-hidden tw-border tw-border-red-400">
        <ScrollView ref="scrollViewRef2" fill-y scroll-x scroll-y native loading-text="Loading project..." :initialize="initialize2">
          <div class="tw-p-2 tw-space-x-2">
            <h2>Scroll view with native bar</h2>
            <XButtonRefresh @click="reload2">Reload</XButtonRefresh>
            <XButtonRefresh @click="appendData2">Append Data</XButtonRefresh>
            <XButtonRefresh @click="scrollToBottom">Scroll to bottom</XButtonRefresh>
          </div>
          <div class="tw-min-h-full tw-bg-gray-200">
            <div v-for="(arr, index) in list2" :key="index">
              <div class="tw-p-2">
                <span class="tw-p-2" v-for="item in arr" :key="item">{{ item }}</span>
              </div>
            </div>
          </div>
          <div class="tw-p-4 tw-text-center tw-bg-gray-100">footer</div>
        </ScrollView>
      </div>
      <div class="tw-flex-1 tw-overflow-hidden tw-border tw-border-red-400">
        <ScrollView ref="scrollViewRef3" fill-y native loading-text="Loading project..." :initialize="initialize3">
          <div class="tw-h-full tw-overflow-auto">
            <div class="tw-p-2 tw-space-x-2">
              <h2>Scroll view without native（disabled scroll）</h2>
              <XButtonRefresh @click="reload3">Reload</XButtonRefresh>
              <XButtonRefresh @click="appendData3">Append Data</XButtonRefresh>
            </div>
            <div v-for="(arr, index) in list3" :key="index">
              <div class="tw-p-2">
                <span class="tw-p-2" v-for="item in arr" :key="item">{{ item }}</span>
              </div>
            </div>
            <div class="tw-p-4 tw-text-center tw-bg-gray-100">footer</div>
          </div>
        </ScrollView>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { timer } from 'rxjs';
import { Input } from 'ant-design-vue';
import { defineComponent, onMounted, ref } from 'vue';
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
    const scrollViewRef3 = ref<any>();

    const list = ref([]);
    const list2 = ref([]);
    const list3 = ref([]);

    const scrollToBottom = () => {
      scrollViewRef2.value?.scrollToBottom(300);
    };

    const loadData = (duration?: number, error?: boolean) => {
      return async () => {
        return timer(duration ?? 2000)
          .toPromise()
          .then(() => {
            if (error) {
              throw new Error('Load failed, please try again.');
            } else {
              return Array.from(new Array(10)).map((x, index) => Array.from(new Array(50)).map((y, index2) => index + index2));
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

    const reload3 = () => {
      scrollViewRef3.value?.reload();
    };

    const appendData = async () => {
      const data = await loadData()();
      list.value.push(...data);
    };

    const appendData2 = async () => {
      const data = await loadData()();
      list2.value.push(...data);
    };

    const appendData3 = async () => {
      const data = await loadData()();
      list3.value.push(...data);
    };

    const initialize = async () => {
      const data = await loadData()();
      list.value = data;
    };

    const initialize2 = async () => {
      const data = await loadData()();
      list2.value = data;
    };

    const initialize3 = async () => {
      const data = await loadData()();
      list3.value = data;
    };

    onMounted(() => {
      setTimeout(() => {
        scrollViewRef2.value.scroll$.subscribe((e: any) => {
          console.log(e.target.scrollTop);
        });
      }, 1000);
    });

    return {
      scrollViewRef,
      scrollViewRef2,
      scrollViewRef3,
      list,
      list2,
      list3,
      scrollToBottom,
      loadData,
      reload,
      reload2,
      reload3,
      appendData,
      appendData2,
      appendData3,
      initialize,
      initialize2,
      initialize3
    };
  }
});
</script>
