<template>
  <AntdButton
    :block="block"
    :disabled="disabled"
    :ghost="ghost"
    :htmlType="htmlType"
    :type="type"
    :size="size"
    :color="color"
    :outline="outline"
    :title="title ? title : $t(i18nMessages.antd.action.refresh)"
    @click="trigger"
  >
    <IconSync spin v-if="loading" scale="0.9" />
    <IconRedo name="redo" v-else scale="0.9" />
  </AntdButton>
</template>

<script lang="ts">
import { notification } from 'ant-design-vue';
import { PropType, defineComponent, ref } from 'vue';
import buttonProps from 'ant-design-vue/lib/button/buttonTypes';

import { i18nMessages } from '../../i18n/messages';

import { AntdButton } from '../button';
import { IconRedo, IconSync } from '../iconfont';

const buttonProps_ = buttonProps();

export default defineComponent({
  components: { AntdButton, IconRedo, IconSync },
  props: {
    ...buttonProps_,
    type: {
      type: String,
      default: 'link'
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
      default: null
    },
    handler: {
      type: Function as PropType<(...args: any[]) => Promise<any>>,
      default: null
    }
  },
  setup(props) {
    const $ref = ref(null);
    const loading = ref(false);

    const trigger = () => {
      if (props.handler && !loading.value) {
        loading.value = true;
        props
          .handler()
          .catch((err) => {
            if (props.notify) {
              notification.error({ message: '', description: err.message });
            }
          })
          .finally(() => {
            loading.value = false;
          });
      }
    };

    return {
      ref: $ref,
      i18nMessages,
      loading,
      trigger
    };
  }
});
</script>
