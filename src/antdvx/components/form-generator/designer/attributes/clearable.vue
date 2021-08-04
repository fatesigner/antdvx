<template>
  <AFormItem label="可清除的">
    <ACheckbox v-model:checked="field.clearable"></ACheckbox>
  </AFormItem>
</template>

<script lang="ts">
import { Checkbox, Form } from 'ant-design-vue';
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  components: {
    // Antd
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
