<template>
  <div class="tw-flex-1 tw-h-full">
    <ScrollView>
      <AForm>
        <AFormItem label="表单名">
          <AInput />
        </AFormItem>
      </AForm>
    </ScrollView>
    <AForm>
      <AFormItem label="">
        <XButton :handler="onSubmit">确定</XButton>
      </AFormItem>
    </AForm>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ScrollView, XButton } from 'antdvx';
import { Form, Input, Modal, Transfer } from 'ant-design-vue';

export default defineComponent({
  components: {
    XButton,
    ScrollView,
    // Antd
    [Form.name]: Form,
    [Form.Item.name]: Form.Item,
    [Input.name]: Input,
    [Modal.name]: Modal,
    [Transfer.name]: Transfer
  },
  props: {
    user: {
      type: Object,
      default: null
    }
  },
  setup(props, { emit }) {
    const onSubmit = () => {
      emit('done');
    };

    return { onSubmit };
  }
});
</script>
