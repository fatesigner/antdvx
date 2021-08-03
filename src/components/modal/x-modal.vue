<template>
  <AModal>
    <slot></slot>
  </AModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Button, Modal } from 'ant-design-vue';

export default defineComponent({
  name: 'x-modal',
  components: {
    [Modal.name]: Modal,
    [Button.name]: Button
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    return {};
  }
});
</script>
