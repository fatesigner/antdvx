<template>
  <action-button
    ref="ref"
    :block="block"
    :disabled="disabled"
    :ghost="ghost"
    :htmlType="htmlType"
    :loading="loading"
    :type="type"
    :size="size"
    :color="color"
    :outline="outline"
    :notify="notify"
    :title="title ? title : $t(i18nMessages.antd.action.add)"
    :handler="handler"
  >
    <template #default="{ loading }"
      ><plus-outlined v-if="!loading" /><slot>{{ $t(i18nMessages.antd.action.add) }}</slot></template
    >
  </action-button>
</template>

<script lang="ts">
import { PropType, defineComponent, ref } from 'vue';
import buttonProps from 'ant-design-vue/lib/button/buttonTypes';
import { PlusOutlined } from '@ant-design/icons-vue';

import { i18nMessages } from '../../i18n/messages';
import ActionButton from './action-button.vue';

const buttonProps_ = buttonProps();

export default defineComponent({
  components: { ActionButton, PlusOutlined },
  props: {
    ...buttonProps_,
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
  setup() {
    const $ref = ref(null);

    const trigger = () => {
      if ($ref.value) {
        ($ref.value as any)?.trigger();
      }
    };

    return {
      ref: $ref,
      i18nMessages,
      trigger
    };
  }
});
</script>
