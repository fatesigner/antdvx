<template>
  <ScrollView>
    <ASpin v-if="loading" />
    <VeeForm :initialValues="form.state" :validation-schema="form.schema" ref="formRef">
      <AForm
        :layout="data.settings.layout"
        :labelAlign="data.settings.labelAlign"
        :labelCol="data.settings.labelCol"
        :hideRequiredMark="data.settings.hideRequiredMark"
      >
        <template v-for="item in data.widgets">
          <VeeField :name="item.name" v-slot="{ field, handleChange }">
            <AFormItem>
              <template #label>
                <div :class="$style.label">{{ item.label }}</div>
              </template>
              <template v-if="item.type === 'input'">
                <AInput :defaultValue="item.defaultValue" :value="field.value" @change="handleChange" />
              </template>
              <template v-else-if="item.type === 'textarea'">
                <ATextarea :defaultValue="item.defaultValue" :value="field.value" @change="handleChange" />
              </template>
              <template v-else-if="item.type === 'radio'">
                <ARadioGroup name="radioGroup" :value="field.value" @change="handleChange">
                  <ARadio :disabled="item.disabled" :value="item.value" v-for="item in item.options.list">{{ item.label }}</ARadio>
                </ARadioGroup>
              </template>
            </AFormItem>
          </VeeField>
        </template>
      </AForm>
    </VeeForm>
  </ScrollView>
</template>

<script lang="ts">
import { Form, Input, Radio, RadioGroup, Spin, Textarea } from 'ant-design-vue';
import { PropType, defineComponent, nextTick, onMounted, reactive, ref, toRaw, watch } from 'vue';

import { Iconfont } from '../../iconfont';
import { XButton } from '../../button';
import { ScrollView } from '../../scroll-view';

import { IFormGeneratorData } from '../config';

export default defineComponent({
  name: 'antd-form-renderer',
  components: {
    Iconfont,
    XButton,
    ScrollView,
    // Antd
    [Spin.name]: Spin,
    [Form.name]: Form,
    [Form.Item.name]: Form.Item,
    [Input.name]: Input,
    [Textarea.name]: Textarea,
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup
  },
  props: {
    data: {
      type: Object as PropType<IFormGeneratorData>,
      default: null
    }
  },
  methods: {
    getComp(comp) {
      return toRaw(comp);
    }
  },
  setup(props: any, { emit }) {
    const loading = ref(true);
    const formRef = ref<any>(null);

    const form = reactive({
      state: {},
      schema: {}
    });

    watch(
      () => props.data,
      (val) => {
        loading.value = true;
        nextTick(() => {
          // 分析 json data
          if (val) {
            const _form = {
              state: {},
              schema: {}
            };
            val.widgets.forEach((item) => {
              let name = item.name ?? item.key;
              _form.state[name] = item.defaultValue ?? null;
              if (item.rules?.props.required) {
                _form.schema[name] = 'required';
              }
            });
            Object.assign(form, _form);
          }
          loading.value = false;
        });
      },
      {
        immediate: true
      }
    );

    const submit = (onSubmit) => {
      formRef.value.dispatchEvent(new Event('submit'));
      debugger;
    };

    onMounted(() => {});

    return {
      loading,
      formRef,
      form,
      submit
    };
  }
});
</script>

<style lang="scss" module>
.label {
}
</style>
