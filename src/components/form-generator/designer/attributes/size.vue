<template>
  <AFormItem label="尺寸">
    <ARadioGroup v-model:value="field.size" :options="sizeOptions" />
  </AFormItem>
</template>

<script lang="ts">
import { Form, Input, RadioGroup } from 'ant-design-vue';
import { PropType, defineComponent } from 'vue';

import { WIDGET_SIZE_OPTIONS } from '../../constants';

export default defineComponent({
  components: {
    // Antd
    [Input.name]: Input,
    [RadioGroup.name]: RadioGroup,
    [Form.Item.name]: Form.Item
  },
  props: {
    field: {
      type: Object as PropType<Record<string, any>>,
      default: null
    }
  },
  setup() {
    return {
      sizeOptions: WIDGET_SIZE_OPTIONS
    };
  }
});
</script>
