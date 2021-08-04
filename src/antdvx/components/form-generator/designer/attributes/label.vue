<template>
  <AFormItem label="标签（标题）">
    <AInput v-model:value="field.label" />
  </AFormItem>
</template>

<script lang="ts">
import { Form, Input } from 'ant-design-vue';
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  components: {
    // Antd
    [Form.Item.name]: Form.Item,
    [Input.name]: Input
  },
  props: {
    field: {
      type: Object as PropType<Record<string, any>>,
      default: null
    }
  }
});
</script>
