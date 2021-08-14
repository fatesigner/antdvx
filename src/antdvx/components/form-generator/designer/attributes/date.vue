<template>
  <AFormItem class="tw-mt-2">
    <div class="tw-mb-2">日期格式（YYYY-MM-DD HH:mm:ss）</div>
    <AAutoComplete class="tw-mb-4" v-model:value="field.date.format" placeholder="输入日期格式" @search="onDateFormatSearch">
      <template #options>
        <a-select-option v-for="format in dateFormatOptions" :key="format">
          {{ format }}
        </a-select-option>
      </template>
    </AAutoComplete>
    <div class="tw-mb-2">默认日期</div>
    <ADatePicker class="tw-mb-4" show-time :format="field.date.format" v-model:value="field.defaultValue" placeholder="选择默认日期" />
    <div class="tw-mb-2">最早日期</div>
    <ADatePicker class="tw-mb-4" show-time :format="field.date.format" v-model:value="field.date.min" placeholder="选择最早日期" />
    <div class="tw-mb-2">最晚日期</div>
    <ADatePicker show-time :format="field.date.format" v-model:value="field.date.max" placeholder="选择最晚日期" />
  </AFormItem>
</template>

<script lang="ts">
import { PropType, computed, defineComponent, ref } from 'vue';
import { AutoComplete, Checkbox, DatePicker, Form, Input, InputNumber, Popover, Radio, RadioButton, RadioGroup, Select } from 'ant-design-vue';

import { XButton } from '../../../button';
import { Iconfont } from '../../../iconfont';

import { DATE_FORMATS } from '../../constants';
import { IFormDesignerBinds, IRuleType, ruleTypeDesc } from '../../config';

export default defineComponent({
  components: {
    XButton,
    Iconfont,
    // Antd
    [Popover.name]: Popover,
    [Form.Item.name]: Form.Item,
    [Input.name]: Input,
    [InputNumber.name]: InputNumber,
    [Select.name]: Select,
    [Select.Option.displayName]: Select.Option,
    [DatePicker.name]: DatePicker,
    [AutoComplete.name]: AutoComplete,
    [Checkbox.name]: Checkbox,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [RadioButton.name]: RadioButton
  },
  props: {
    field: {
      type: Object as PropType<Record<string, any>>,
      default: null
    },
    binds: {
      type: Object as PropType<IFormDesignerBinds>,
      default: null
    }
  },
  setup(props: any) {
    const ruleOptions = Object.keys(ruleTypeDesc).map((key) => ({ value: key, label: ruleTypeDesc[key] }));

    const selectedOptions = ref(props?.field?.rules?.includes?.map((x) => x.value) ?? []);

    const filteredOptions = computed(() => ruleOptions.filter((o) => !selectedOptions.value.includes(o)));

    // 日期格式化
    const dateFormatOptions = ref(DATE_FORMATS);

    const onSelect = (val, option: { value: IRuleType }) => {
      const index = props.field.rules.includes.findIndex((y) => y.value === val);
      if (index < 0) {
        let obj;
        if (option.value === 'regular') {
          obj = null;
        } else if (option.value === 'lengthLimit') {
          obj = {
            min: 0,
            max: null
          };
        } else if (option.value === 'number') {
          obj = {
            min: null,
            max: null,
            digits: null
          };
        } else if (option.value === 'date') {
          obj = {
            min: null,
            max: null,
            format: null
          };
        } else {
          obj = true;
        }
        props.field.rules.props[option.value] = obj;
        props.field.rules.includes.push(option);
      }
    };

    const onDeselect = (val) => {
      const index = props.field.rules.includes.findIndex((y) => y.value === val);
      if (index > -1) {
        delete props.field.rules.props[props.field.rules.includes[index].value];
        props.field.rules.includes.splice(index, 1);
      }
    };

    const onDateFormatSearch = (val: string) => {
      dateFormatOptions.value = DATE_FORMATS.filter((x) => x.indexOf(val) > -1);
    };

    return { filteredOptions, selectedOptions, dateFormatOptions, onSelect, onDeselect, onDateFormatSearch };
  }
});
</script>

<style lang="scss" module>
.item {
  padding: 10px 0;
  border-top: 1px solid #ddd;
}
</style>
