<template>
  <AntdButton
    :block="block"
    :disabled="disabled"
    :ghost="ghost"
    :htmlType="htmlType"
    :loading="loading_"
    :type="type"
    :size="size"
    :color="color"
    :outline="outline"
    :title="title"
    :pure="pure"
    @click="trigger"
  >
    <slot v-bind="{ loading: loading_ }" />
  </AntdButton>
</template>

<script lang="ts">
import { PropType, defineComponent, ref } from 'vue';
import { notification } from 'ant-design-vue';
import buttonProps from 'ant-design-vue/lib/button/buttonTypes';

import { AntdButton } from '../button';

const buttonProps_ = buttonProps();

export default defineComponent({
  components: { AntdButton },
  props: {
    ...buttonProps_,
    pure: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: null
    },
    outline: {
      type: Boolean,
      default: false
    },
    notify: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    handler: {
      type: Function as PropType<(...args: any[]) => Promise<any>>,
      default: null
    }
  },
  setup(props) {
    const loading_ = ref(false);

    const trigger = () => {
      if (props.handler) {
        loading_.value = true;
        props
          .handler()
          .catch((err) => {
            if (props.notify) {
              notification.error({ message: '', description: err.message });
            }
          })
          .finally(() => {
            loading_.value = false;
          });
      }
    };

    return {
      loading_,
      trigger
    };
  }
});
</script>
