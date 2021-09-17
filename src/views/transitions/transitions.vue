<template>
  <ScrollView fill-y scroll-y>
    <div class="tw-grid lg:tw-grid-cols-2 tw-gap-4 tw-p-4">
      <div class="tw-p-4 tw-border tw-border-gray-300 tw-space-y-4">
        <div class="tw-text-lg">Slide（滑动）</div>

        <div class="tw-space-x-2">
          <label>方向：</label>
          <ARadioGroup v-model:value="direction">
            <ARadio v-for="item in directions" :value="item">{{ item }}</ARadio>
          </ARadioGroup>
        </div>

        <ATabs type="card" size="small" v-model:activeKey="activeKey">
          <ATabPane key="1" tab="tab 1" />
          <ATabPane key="2" tab="tab 2" />
        </ATabs>

        <TransitionSlide :direction="direction">
          <div v-if="activeKey === '1'">
            label 1
            <div v-for="item in 10">{{ item }}</div>
          </div>
          <div v-else-if="activeKey === '2'">
            label 2
            <div v-for="item in 15">{{ item }}</div>
          </div>
        </TransitionSlide>
      </div>

      <div class="tw-p-4 tw-border tw-border-gray-300 tw-space-y-4">
        <div class="tw-text-lg">Collapse（展开/收缩）</div>

        <div class="tw-space-x-2">
          <label>切换：</label>
          <ARadioGroup v-model:value="collapsed">
            <ARadio :value="false">展开</ARadio>
            <ARadio :value="true">收起</ARadio>
          </ARadioGroup>
        </div>

        <TransitionCollapse>
          <div v-if="!collapsed">
            <AAlert type="error">
              <template #description> dasdasfasdssssssssssssssssssssssssssssss </template>
            </AAlert>
          </div>
        </TransitionCollapse>
      </div>

      <div class="tw-p-4 tw-border tw-border-gray-300 tw-space-y-4">
        <div class="tw-text-lg">Zoom（缩放）</div>

        <div class="tw-space-x-2">
          <label>切换：</label>
          <ARadioGroup v-model:value="zoom">
            <ARadio :value="true">显示</ARadio>
            <ARadio :value="false">隐藏</ARadio>
          </ARadioGroup>
        </div>

        <div class="tw-relative tw-h-64 tw-overflow-auto">
          <TransitionZoom>
            <div v-if="zoom">
              <AAlert type="error">
                <template #description> dasdasfasdssssssssssssssssssssssssssssss </template>
              </AAlert>
            </div>
          </TransitionZoom>
          <TransitionZoom>
            <div v-if="!zoom">
              <SpinnerLoading />
            </div>
          </TransitionZoom>
          <!--<TransitionOpacity>
            <div v-if="!zoom">
              <div v-for="item in 10">
                <div v-for="item2 in 10">{{ item2 }}</div>
              </div>
            </div>
          </TransitionOpacity>-->
        </div>
      </div>
    </div>
  </ScrollView>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Alert, Input, Radio, RadioGroup, Tabs } from 'ant-design-vue';
import { ANTDVX_DIRECTIONS, ANTDVX_SIZES, ScrollView, SpinnerLoading, TransitionCollapse, TransitionOpacity, TransitionSlide, TransitionZoom } from '@/antdvx';

export default defineComponent({
  components: {
    ScrollView,
    SpinnerLoading,
    TransitionZoom,
    TransitionSlide,
    TransitionOpacity,
    TransitionCollapse,
    [Tabs.name]: Tabs,
    [Radio.name]: Radio,
    [Input.name]: Input,
    [Alert.name]: Alert,
    [RadioGroup.name]: RadioGroup,
    [Tabs.TabPane.name]: Tabs.TabPane
  },
  setup() {
    const activeKey = ref('1');
    const direction = ref<typeof ANTDVX_DIRECTIONS[number]>('down');
    const collapsed = ref(false);
    const zoom = ref(false);

    return {
      activeKey,
      direction,
      collapsed,
      zoom,
      directions: ANTDVX_DIRECTIONS,
      sizes: ANTDVX_SIZES.filter((x) => x !== 'mini')
    };
  }
});
</script>
