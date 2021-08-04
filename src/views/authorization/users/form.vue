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
        <ActionButton :handler="onSubmit">确定</ActionButton>
      </AFormItem>
    </AForm>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Form, Input, Modal, Transfer } from 'ant-design-vue';
import { ActionButton } from 'antdvx/components/action-bars';
import { ScrollView } from 'antdvx/components/scroll-view';

export default defineComponent({
  components: {
    ScrollView,
    ActionButton,
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
