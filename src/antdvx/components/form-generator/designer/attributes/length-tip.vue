<template>
  <AFormItem label="输入长度提示">
    <ACheckbox v-model:checked="field.lengthTip"></ACheckbox>
  </AFormItem>
</template>

<script lang="ts">
import { Checkbox, Form } from 'ant-design-vue';
import { PropType, defineComponent } from 'vue';

export default defineComponent({
  components: {
    [Checkbox.name]: Checkbox,
    [Form.Item.name]: Form.Item
  },
  props: {
    field: {
      type: Object as PropType<Record<string, any>>,
      default: null
    }
  }
});
</script>
