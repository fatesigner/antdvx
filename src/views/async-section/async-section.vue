<template>
  <ScrollView fill-y scroll-y>
    <div class="tw-p-4 tw-space-y-4">
      <div class="tw-text-lg">Async Section</div>

      <div class="tw-p-2 tw-border tw-border-gray-300">
        <AsyncSection class="tw-p-4 tw-text-center" loading-text="Loading project..." :initialize="asyncSectionLoad(3000)">
          <template #default="{ data, reload }">
            <span>{{ data.text }}</span>
            <XButtonRefresh only-icon color="primary" size="small" type="link" :handler="reload" />
          </template>
        </AsyncSection>
      </div>

      <div class="tw-mt-4 tw-text-lg">
        Async Section immediate = false
        <XButtonRefresh only-icon color="primary" size="small" type="link" :handler="load" />
      </div>

      <div class="tw-p-2 tw-border tw-border-gray-300">
        <AsyncSection loading-text="Loading project..." :initialize="asyncSectionLoad(2000)" :immediate="false" ref="asyncSectionRef">
          <template #default="{ data, reload }">
            <div class="tw-flex tw-items-center tw-space-x-2" v-for="item in 20">
              <XButtonRefresh only-icon color="primary" size="small" type="link" :handler="reload" />
              <div>{{ item }}</div>
            </div>
          </template>
        </AsyncSection>
      </div>
    </div>
  </ScrollView>
</template>

<script lang="tsx">
import { timer } from 'rxjs';
import { defineComponent, ref } from 'vue';
import { AsyncSection, ScrollView, XButtonRefresh } from '@/antdvx';

export default defineComponent({
  components: {
    XButtonRefresh,
    AsyncSection,
    ScrollView
  },
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

    return { asyncSectionRef, asyncSectionLoad, load };
  }
});
</script>
