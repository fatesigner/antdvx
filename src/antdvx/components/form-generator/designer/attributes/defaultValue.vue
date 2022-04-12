<template>
  <AFormItem label="默认值">
    <AInput v-model:value="field.defaultValue" />
  </AFormItem>
</template>

<script lang="ts">
import { Form, Input } from 'ant-design-vue';
import { PropType, defineComponent } from 'vue';

export default defineComponent({
  components: {
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
