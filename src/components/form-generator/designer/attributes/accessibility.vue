<template>
  <AFormItem label="可访问性">
    <ACheckbox v-model:checked="field.hidden">隐藏</ACheckbox>
    <ACheckbox v-model:checked="field.readonly">只读</ACheckbox>
    <ACheckbox v-model:checked="field.disabled">禁用</ACheckbox>
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
