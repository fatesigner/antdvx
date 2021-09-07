<template>
  <div class="tw-flex tw-h-full tw-p-4 tw-space-x-2">
    <div class="tw-flex-1 tw-border tw-border-red-400">
      <ScrollView ref="scrollViewRef" fill-y scroll-y loading-text="Loading project...">
        <div v-for="item in 200">
          <button @click="reload">reload</button>
          <div class="tw-p-2">{{ item }}</div>
        </div>
      </ScrollView>
    </div>
    <div class="tw-flex-1 tw-border tw-border-red-400">
      <ScrollView ref="scrollViewRef" fill-y native loading-text="Loading project..." :initialize="loadData(3000)">
        <div class="tw-h-full tw-overflow-y-auto">
          <div v-for="item in 200">
            <button @click="reload">reload</button>
            <div class="tw-p-2">{{ item }}</div>
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
import { ScrollView, XButton } from '@/antdvx';

export default defineComponent({
  components: {
    XButton,
    ScrollView,
    [Input.name]: Input
  },
  setup() {
    const scrollViewRef = ref<any>();

    const loadData = (duration?: number, error?: boolean) => {
      return async () => {
        return timer(duration ?? 2000)
          .toPromise()
          .then(() => {
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

    const reload = () => {
      scrollViewRef.value?.reload();
    };

    return {
      scrollViewRef,
      loadData,
      reload
    };
  }
});
</script>
