<template>
  <AFormItem>
    <template #label>
      <div class="tw-flex tw-items-center">
        触发方式
        <APopover title="触发方式说明" trigger="hover">
          <template #content>
            <div class="tw-flex tw-items-center">
              <span class="tw-text-xs">OnBlur：</span>
              <span class="tw-text-xxs">控件失去焦点后触发</span>
            </div>
            <div class="tw-flex tw-items-center">
              <span class="tw-text-xs">OnChange：</span>
              <span class="tw-text-xxs">用户输入后触发</span>
            </div>
          </template>
          <XButton class="tw-ml-1" color="primary" pure size="small" type="link"><IconQuestionLine /></XButton>
        </APopover>
      </div>
    </template>
    <ARadioGroup v-model:value="field.rules.mode" size="small">
      <ARadio value="onBlur">OnBlur</ARadio>
      <ARadio value="onChange">OnChange</ARadio>
    </ARadioGroup>
  </AFormItem>
  <AFormItem class="tw-mt-2">
    <div class="tw-flex tw-items-center">
      <div class="tw-flex-1">
        <ASelect
          class="tw-w-full"
          mode="multiple"
          placeholder="选择验证规则"
          :options="filteredOptions"
          v-model:value="selectedOptions"
          @select="onSelect"
          @deselect="onDeselect"
        />
      </div>
    </div>
    <div class="tw-mt-4 tw-space-y-4">
      <template v-for="(item, index) in field.rules.includes" :key="item.value">
        <div v-if="item.value === 'regular'">
          <div class="tw-mb-2">正则表达式</div>
          <AInput v-model:value="field.rules.props.regular" placeholder="输入正则表达式" />
        </div>
        <div v-else-if="item.value === 'lengthLimit'">
          <div class="tw-mb-2">字符长度范围</div>
          <div class="tw-flex tw-items-center tw-space-x-2">
            <div class="tw-flex-initial">
              <AInputNumber :min="0" :step="1" v-model:value="field.rules.props.lengthLimit.min" placeholder="最小长度" />
            </div>
            <div class="tw-flex-initial">-</div>
            <div class="tw-flex-initial">
              <AInputNumber :min="0" :step="1" v-model:value="field.rules.props.lengthLimit.max" placeholder="最大长度" />
            </div>
          </div>
        </div>
        <div v-else-if="item.value === 'number'">
          <div class="tw-mb-2">数值范围</div>
          <div class="tw-flex tw-items-center tw-space-x-2 tw-mb-4">
            <div class="tw-flex-initial">
              <AInputNumber :min="0" :step="1" v-model:value="field.rules.props.number.min" placeholder="最小值" />
            </div>
            <div class="tw-flex-initial">-</div>
            <div class="tw-flex-initial">
              <AInputNumber :min="0" :step="1" v-model:value="field.rules.props.number.max" placeholder="最大值" />
            </div>
          </div>
          <div class="tw-mb-2">允许的小数位数最大值</div>
          <AInputNumber class="tw-w-32" :min="0" :step="1" v-model:value="field.rules.props.number.digits" placeholder="小数位数" />
        </div>
        <div v-else-if="item.value === 'date'">
          <div class="tw-mb-2">日期格式（yyyy-MM-dd HH:mm:ss）</div>
          <AAutoComplete class="tw-mb-4" v-model:value="field.rules.props.date.format" placeholder="输入日期格式" @search="onDateFormatSearch">
            <template #options>
              <a-select-option v-for="format in dateFormatOptions" :key="format">
                {{ format }}
              </a-select-option>
            </template>
          </AAutoComplete>
          <div class="tw-mb-2">最早日期</div>
          <ADatePicker
            class="tw-mb-4"
            show-time
            :format="field.rules.props.date.format"
            v-model:value="field.rules.props.date.min"
            placeholder="选择最早日期"
          />
          <div class="tw-mb-2">最晚日期</div>
          <ADatePicker show-time :format="field.rules.props.date.format" v-model:value="field.rules.props.date.max" placeholder="选择最晚日期" />
        </div>
      </template>
    </div>
  </AFormItem>
</template>

<script lang="ts">
import { PropType, computed, defineComponent, ref } from 'vue';
import { AutoComplete, Checkbox, DatePicker, Form, Input, InputNumber, Popover, Radio, RadioButton, RadioGroup, Select } from 'ant-design-vue';

import { XButton } from '../../../button';
import { IconQuestionLine } from '../../../iconfont';

import { DATE_FORMATS } from '../../constants';
import { IFormDesignerBinds, IRuleType, ruleTypeDesc } from '../../config';

export default defineComponent({
  components: {
    IconQuestionLine,
    XButton,
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

<style lang="less" module>
.item {
  padding: 10px 0;
  border-top: 1px solid #ddd;
}
</style>
