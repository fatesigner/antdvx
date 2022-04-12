<template>
  <ATextarea
    type="text"
    :addonAfter="field.addonAfter"
    :addonBefore="field.addonBefore"
    :disabled="field.disabled"
    :size="field.size"
    v-model:value="field.defaultValue"
    :allowClear="field.clearable"
    :style="{ width: field.width }"
    :readonly="field.readonly"
    :placeholder="field.placeholder"
    :showCount="field.lengthTip"
  />
</template>

<script lang="ts">
import { Textarea } from 'ant-design-vue';
import { PropType, defineComponent } from 'vue';

export default defineComponent({
  components: {
    [Textarea.name]: Textarea
  },
  props: {
    field: {
      type: Object as PropType<Record<string, any>>,
      default: null
    }
  }
});
</script>
