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
    :pure="pure"
    :color="color"
    :outline="outline"
    :notify="notify"
    :title="title ? title : $t(i18nMessages.antd.action.save)"
    :handler="handler"
  >
    <template #default="{ loading }">
      <icon-save v-if="!loading" scale="1.1" />
      <slot v-if="mode === 'text'">{{ $t(i18nMessages.antd.action.save) }}</slot>
    </template>
  </action-button>
</template>

<script lang="ts">
import { PropType, defineComponent, ref } from 'vue';
import buttonProps from 'ant-design-vue/lib/button/buttonTypes';

import ActionButton from './action-button.vue';
import { IconSave } from '../iconfont';
import { i18nMessages } from '../../i18n/messages';

const buttonProps_ = buttonProps();

export default defineComponent({
  components: { ActionButton, IconSave },
  props: {
    ...buttonProps_,
    mode: {
      type: String as PropType<'icon' | 'text'>,
      default: 'text'
    },
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
      default: true
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
      i18nMessages,
      ref: $ref,
      trigger
    };
  }
});
</script>
