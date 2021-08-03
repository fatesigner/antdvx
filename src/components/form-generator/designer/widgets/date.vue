<template>
  <ADatePicker
    :format="field.date.format"
    v-model:value="field.defaultValue"
    :allowClear="field.clearable"
    :style="{ width: field.width }"
    :readonly="field.readonly"
    :placeholder="field.placeholder"
  />
</template>

<script lang="ts">
import { DatePicker } from 'ant-design-vue';
import { PropType, defineComponent } from 'vue';

export default defineComponent({
  components: {
    // Antd
    [DatePicker.name]: DatePicker
  },
  props: {
    field: {
      type: Object as PropType<Record<string, any>>,
      default: null
    }
  }
});
</script>
