<template>
  <AFormItem label="标识（字段名）">
    <AInput v-model:value="field.name" />
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
