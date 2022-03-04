<template>
  <PageWrapper title="Lazy">
    <div class="tw-p-2">
      <div class="tw-p-4 tw-space-y-4 tw-bg-white">
        <div class="tw-flex tw-items-center tw-space-x-4">
          <div class="tw-text-lg">Lazy（延迟组件）</div>
          <ACheckbox v-model:checked="failed">Failed</ACheckbox>
          <AInput class="tw-w-32" v-model:value="input" placeholder="更新 text" />
        </div>

        <ATabs type="card" size="small" v-model:activeKey="activeKey">
          <ATabPane v-for="item in comps" :key="item.name" :tab="item.label" />
        </ATabs>

        <div class="tw-p-2 tw-border tw-border-gray-300">
          <ComponentView animation="opacity" v-model:activeKey="activeKey" :comps="comps" :keep-alive="false" />
        </div>

        <ATabs type="card" size="small" v-model:activeKey="activeKey2">
          <ATabPane v-for="item in comps" :key="item.name" :tab="item.label" />
        </ATabs>

        <div class="tw-p-2 tw-border tw-border-gray-300">
          <ComponentView animation="opacity" v-model:activeKey="activeKey2" :comps="comps" :keep-alive="false" v-slot="{ name, component, props }">
            <TransitionSlide>
              <div>
                {{ name }}
                <Component :is="component" v-bind="props" />
              </div>
            </TransitionSlide>
          </ComponentView>
        </div>
      </div>
    </div>
  </PageWrapper>
</template>

<script lang="ts">
import { timer } from 'rxjs';
import { Checkbox, Input, Tabs } from 'ant-design-vue';
import { defineComponent, reactive, ref, watch } from 'vue';
import { ComponentView, IComponentViewItem, ScrollView, TransitionSlide, defineAsyncComponent } from '@/antdvx';

import { PageWrapper } from '@/app/shared/page-wrapper';

export default defineComponent({
  components: {
    ScrollView,
    ComponentView,
    TransitionSlide,
    PageWrapper,
    [Tabs.name]: Tabs,
    [Input.name]: Input,
    [Checkbox.name]: Checkbox,
    [Tabs.TabPane.name]: Tabs.TabPane
  },
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
            return import('./tab1.vue');
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
              return import('./tab2.vue');
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
            return import('./tab3.vue');
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
  }
});
</script>
