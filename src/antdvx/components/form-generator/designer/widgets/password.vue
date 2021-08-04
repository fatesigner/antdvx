<template>
  <AInputPassword
    type="password"
    :addonAfter="field.addonAfter"
    :addonBefore="field.addonBefore"
    :disabled="field.disabled"
    :prefix="field.prefix"
    :size="field.size"
    :suffix="field.suffix"
    v-model:value="field.defaultValue"
    :allowClear="field.clearable"
    :style="{ width: field.width }"
    :readonly="field.readonly"
    :placeholder="field.placeholder"
  />
</template>

<script lang="ts">
import { InputPassword } from 'ant-design-vue';
import { PropType, defineComponent } from 'vue';

export default defineComponent({
  components: {
    // Antd
    [InputPassword.name]: InputPassword
  },
  props: {
    field: {
      type: Object as PropType<Record<string, any>>,
      default: null
    }
  }
});
</script>
