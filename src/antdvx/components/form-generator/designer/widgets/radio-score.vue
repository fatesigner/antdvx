<template>
  <ARadioGroup name="radioGroup" v-model:value="field.defaultValue">
    <ARadio :disabled="item.disabled" :value="item.value" v-for="item in field.options.list">{{ item.label }}（{{ item.score }}分）</ARadio>
  </ARadioGroup>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { Radio, RadioGroup } from 'ant-design-vue';

export default defineComponent({
  components: {
    // Antd
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup
  },
  props: {
    field: {
      type: Object as PropType<Record<string, any>>,
      default: null
    }
  }
});
</script>
