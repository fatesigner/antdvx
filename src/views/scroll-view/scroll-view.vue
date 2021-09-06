<template>
  <div class="tw-h-full tw-p-4">
    <div class="tw-h-full tw-border tw-border-red-400">
      <ScrollView ref="scrollViewRef" :initialize="loadData(3000, true)" :loading="loading">
        <XButtonAdd />
        <div v-for="item in 200">
          <button @click="reload">reload</button>
          <div class="tw-p-2">{{ item }} {{ loading.show }}</div>
        </div>
      </ScrollView>
    </div>
  </div>
</template>

<script lang="ts">
import { timer } from 'rxjs';
import { Input } from 'ant-design-vue';
import { defineComponent, reactive, ref } from 'vue';
import { ANTDVX_SIZES, ScrollView, XButton, XButtonAdd } from '@/antdvx';

export default defineComponent({
  components: {
    XButton,
    ScrollView,
    XButtonAdd,
    [Input.name]: Input
  },
  setup() {
    const scrollViewRef = ref<any>();
    const loading = reactive({ show: false, size: 'small', text: 'Loading project...' });

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
      loading,
      sizes: ANTDVX_SIZES.filter((x) => x !== 'mini'),
      loadData,
      reload
    };
  }
});
</script>
