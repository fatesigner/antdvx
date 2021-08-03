<template>
  <ACheckboxGroup name="radioGroup" v-model:value="field.defaultValue">
    <ACheckbox :value="item.value" v-for="item in field.options.list">{{ item.label }}（{{ item.score }}分）</ACheckbox>
  </ACheckboxGroup>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { Checkbox, CheckboxGroup } from 'ant-design-vue';

export default defineComponent({
  components: {
    // Antd
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup
  },
  props: {
    field: {
      type: Object as PropType<Record<string, any>>,
      default: null
    }
  }
});
</script>
