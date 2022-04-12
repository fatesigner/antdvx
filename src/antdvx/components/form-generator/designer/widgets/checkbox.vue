<template>
  <ACheckboxGroup name="radioGroup" v-model:value="field.defaultValue" :options="field.options.list"></ACheckboxGroup>
</template>

<script lang="ts">
import { CheckboxGroup } from 'ant-design-vue';
import { PropType, defineComponent } from 'vue';

export default defineComponent({
  components: {
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
