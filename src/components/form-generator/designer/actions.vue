<template>
  <div class="tw-flex tw-items-center tw-justify-between tw-p-2">
    <div class="tw-flex-initial">
      {{ binds.schema.name }}
    </div>
    <div class="tw-flex-initial">
      <ActionButton type="link" size="small" :handler="uploadJson">
        <template #icon></template>
        导入JSON
      </ActionButton>

      <APopconfirm title="确认清空当前表单?" ok-text="确定" cancel-text="取消" @confirm="clear">
        <AButton type="link" size="small">
          <template #icon> </template>
          清空
        </AButton>
      </APopconfirm>

      <ActionButton type="link" size="small" :handler="preview">
        <template #icon> </template>
        预览
      </ActionButton>

      <ActionButton type="link" size="small" :handler="generateJson">
        <template #icon> </template>
        生成JSON
      </ActionButton>

      <ActionButton type="link" size="small" :handler="generateCode">
        <template #icon></template>
        生成代码
      </ActionButton>
    </div>

    <AModal v-model:visible="uploadedJson.visible" title="导入JSON" :width="800" @ok="onUpload">
      <AAlert class="tw-mb-4" type="info" message="覆盖此处代码点击确定即可" />
      <ScrollView style="height: 600px"><CodeEditor language="json" v-model:value="uploadedJson.text" /></ScrollView>
    </AModal>

    <AModal v-model:visible="generatedJson.visible" title="生成JSON" okText="复制到剪切板" :width="800" @ok="onCopy(generatedJson.text)">
      <ScrollView style="height: 600px">
        <CodeEditor language="json" v-model:value="generatedJson.text" />
      </ScrollView>
    </AModal>

    <AModal v-model:visible="previewed.visible" title="预览" :width="800">
      <ScrollView style="height: 600px">
        <FormRenderer :data="previewed.data" ref="formRef"></FormRenderer>
      </ScrollView>
      <template #footer>
        <ActionButton>重置</ActionButton>
        <ActionButton type="primary" :handler="getFormData">获取数据</ActionButton>
      </template>
    </AModal>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent, reactive, ref } from 'vue';
import { Alert, Button, Modal, Popconfirm, message, notification } from 'ant-design-vue';

import { copy } from '../../../utils';
import { CodeEditor } from '../../code-editor';
import { ScrollView } from '../../scroll-view';
import { ActionButton } from '../../action-bars';

import { IFormDesignerBinds } from '../config';

import { analyzeFormDesignerJsonData, getDefaultFormGeneratorData, getFormDesignerJsonData } from './designer';

import FormRenderer from '../renderer/renderer.vue';

export default defineComponent({
  components: {
    ActionButton,
    FormRenderer,
    CodeEditor,
    ScrollView,
    // Antd
    [Alert.name]: Alert,
    [Modal.name]: Modal,
    [Button.name]: Button,
    [Popconfirm.name]: Popconfirm
  },
  props: {
    binds: {
      type: Object as PropType<IFormDesignerBinds>,
      default: null
    }
  },
  setup(props: any, { emit }) {
    const formRef = ref(null);

    const uploadedJson = reactive({
      visible: false,
      text: ''
    });

    const generatedJson = reactive({
      visible: false,
      text: ''
    });

    const previewed = reactive({
      visible: false,
      data: null,
      form: null
    });

    const generatedCode = reactive({
      visible: false,
      data: null,
      form: null
    });

    const onCopy = (text: string) => {
      copy(text);
      message.success('复制成功');
    };

    const onUpload = () => {
      try {
        const jsonData = JSON.parse(uploadedJson.text);
        analyzeFormDesignerJsonData(jsonData, props.binds);
        uploadedJson.visible = false;
      } catch (err) {
        notification.error({ message: 'error', description: err.message });
      }
    };

    const uploadJson = async () => {
      uploadedJson.text = JSON.stringify(getDefaultFormGeneratorData(), null, 2);
      uploadedJson.visible = true;
    };

    const generateJson = async () => {
      const data = await getFormDesignerJsonData(props.binds);
      generatedJson.text = JSON.stringify(data, null, 2);
      generatedJson.visible = true;
    };

    const preview = async () => {
      previewed.data = await getFormDesignerJsonData(props.binds);
      previewed.visible = true;
    };

    const generateCode = async () => {
      generatedCode.data = await getFormDesignerJsonData(props.binds);
      generatedCode.visible = true;
    };

    const getFormData = async () => {
      formRef.value.submit();
    };

    const clear = () => {
      props.binds.widgets.splice(0, props.binds.widgets.length);
    };

    return {
      formRef,
      uploadedJson,
      generatedJson,
      previewed,
      generatedCode,
      onCopy,
      onUpload,
      uploadJson,
      generateJson,
      preview,
      generateCode,
      getFormData,
      clear
    };
  }
});
</script>
