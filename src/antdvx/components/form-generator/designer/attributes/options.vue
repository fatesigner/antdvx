<template>
  <AFormItem label="选项">
    <ARadioGroup v-model:value="field.options.mode" button-style="solid" size="small">
      <ARadioButton value="local">静态</ARadioButton>
      <ARadioButton value="remote">远程</ARadioButton>
    </ARadioGroup>
    <div class="tw-mt-4 tw-space-y-2" v-show="field.options.mode === 'local'">
      <div class="tw-flex tw-items-center tw-space-x-2 tw-text-xxs tw-text-gray">
        <div class="tw-flex-initial" style="width: 33px">禁用</div>
        <div class="tw-flex-1">值</div>
        <div class="tw-flex-1">描述</div>
        <div class="tw-flex-initial" style="width: 28px"></div>
      </div>
      <div v-for="(item, index) in field.options.list" :key="index">
        <div class="tw-flex tw-items-center tw-space-x-2">
          <div class="tw-flex-initial" style="width: 33px">
            <ACheckbox v-model:checked="item.disabled" />
          </div>
          <div class="tw-flex-1">
            <AInput v-model:value="item.value" placeholder="输入值" />
          </div>
          <div class="tw-flex-1">
            <AInput v-model:value="item.label" placeholder="输入描述" />
          </div>
          <div class="tw-flex-initial" style="width: 28px">
            <AntdButton size="small" type="link" title="删除" @click="remove(index)"><Iconfont name="trash-alt" /></AntdButton>
          </div>
        </div>
      </div>
      <AntdButton class="tw-mt-2" pure size="small" type="link" title="添加选项" @click="add"><Iconfont name="plus" />添加选项</AntdButton>
    </div>
    <div v-show="field.options.mode === 'remote'">remote</div>
  </AFormItem>
</template>

<script lang="ts">
import { PropType, defineComponent, watch } from 'vue';
import { Checkbox, Form, Input, RadioButton, RadioGroup } from 'ant-design-vue';

import { AntdButton } from '../../../button';
import { Iconfont } from '../../../iconfont';

export default defineComponent({
  components: {
    AntdButton,
    Iconfont,
    // Antd
    [Form.Item.name]: Form.Item,
    [Input.name]: Input,
    [Checkbox.name]: Checkbox,
    [RadioGroup.name]: RadioGroup,
    [RadioButton.name]: RadioButton
  },
  props: {
    field: {
      type: Object as PropType<Record<string, any>>,
      default: null
    }
  },
  setup(props: any) {
    watch(
      () => props.field.disabled,
      (val) => {
        props?.field?.options?.list?.forEach((item) => {
          item.disabled = val;
        });
      }
    );

    const add = () => {
      props?.field?.options?.list?.push({
        value: 'value',
        label: 'text'
      });
    };

    const remove = (index) => {
      props?.field?.options?.list?.splice(index, 1);
    };

    return { add, remove };
  }
});
</script>
