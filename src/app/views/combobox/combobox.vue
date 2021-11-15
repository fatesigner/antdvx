<template>
  <ScrollView fill-y scroll-y>
    <div class="tw-p-4 tw-space-y-4">
      <div class="tw-text-lg">Combobox</div>

      <div class="tw-text-lg">单选</div>

      <XButton @click="visible = !visible">Toggle</XButton>

      <div class="tw-grid md:tw-grid-cols-2 tw-gap-4" v-for="size in sizes" v-if="visible">
        <div class="tw-flex flex-wrap tw-items-center tw-space-x-2">
          <div class="tw-flex-initial">筛选：</div>
          <XCombobox
            class="tw-w-36 tw-mr-8"
            :size="size"
            auto-bind
            clearable
            importable
            label-in-value
            data-value-field="name"
            data-text-field="label"
            :options="list.items"
            v-model:value="list.key"
            placeholder="选择一个项目..."
          />
          <XButton :size="size">查询 / Query</XButton>
        </div>
      </div>

      <div class="tw-text-lg">多选</div>

      <!--      <div class="tw-grid md:tw-grid-cols-2 tw-gap-4" v-for="size in sizes">
        <div class="tw-flex flex-wrap tw-items-center tw-space-x-2">
          <div class="tw-flex-initial">筛选：</div>
          <XCombobox class="tw-w-64" multiple :size="size" :options="['选项1', '选项2']" placeholder="请选择" />
          <XButton :size="size">查询 / Query</XButton>
        </div>
      </div>-->
    </div>
  </ScrollView>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { Input, InputSearch } from 'ant-design-vue';
import { ANTDVX_SIZES, ScrollView, XButton, XCombobox } from '@/antdvx';

export default defineComponent({
  components: {
    XButton,
    XCombobox,
    ScrollView,
    [Input.name]: Input,
    [InputSearch.name]: InputSearch
  },
  setup() {
    const visible = ref(true);

    const list = reactive({
      key: { name: '1' },
      items: [
        {
          name: '1',
          label: '主页'
        },
        {
          name: '2',
          label: '医嘱信息'
        },
        {
          name: '3',
          label: '用药总结'
        },
        {
          name: '4',
          label: '手术信息'
        },
        {
          name: '5',
          label: '化验报告'
        },
        {
          name: '6',
          label: '检查报告'
        },
        {
          name: '7',
          label: '护理单'
        },
        {
          name: '8',
          label: '病历文书'
        },
        {
          name: '9',
          label: '患者360'
        },
        {
          name: '10',
          label: '药学服务时间轴'
        }
      ]
    });

    return {
      sizes: ['small'] || ANTDVX_SIZES.filter((x) => x !== 'mini'),
      list,
      focus,
      visible
    };
  }
});
</script>
