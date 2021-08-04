<template>
  <APopconfirm
    v-if="confirmed"
    iconColor="red"
    :disabled="disabled"
    :ok-text="$t(i18nMessages.antd.action.delete.oktext)"
    :cancel-text="$t(i18nMessages.antd.action.delete.cancelText)"
    :title="$t(i18nMessages.antd.action.delete.confirmText)"
    @confirm="trigger"
  >
    <AntdButton
      v-bind="$attrs"
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
      :title="title ? title : $t(i18nMessages.antd.action.delete.title)"
    >
      <IconTrashAlt v-if="!loading" />
      <slot>
        <span v-if="mode === 'text'">{{ $t(i18nMessages.antd.action.delete.title) }}</span>
      </slot>
    </AntdButton>
  </APopconfirm>
  <AntdButton
    v-else
    v-bind="$attrs"
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
    :title="title ? title : $t(i18nMessages.antd.action.delete.title)"
    @click="trigger"
  >
    <IconTrashAlt v-if="!loading" />
    <slot>
      <span v-if="mode === 'text'">{{ $t(i18nMessages.antd.action.delete.title) }}</span>
    </slot>
  </AntdButton>
</template>

<script lang="ts">
import { timer } from 'rxjs';
import { useI18n } from 'vue-i18n';
import { PropType, defineComponent, ref } from 'vue';
import buttonProps from 'ant-design-vue/lib/button/buttonTypes';
import { Popconfirm, message, notification } from 'ant-design-vue';

import { i18nMessages } from '../../i18n/messages';

import { AntdButton } from '../button';
import { IconTrashAlt } from '../iconfont';

const buttonProps_ = buttonProps();

export default defineComponent({
  components: { AntdButton, IconTrashAlt, [Popconfirm.name]: Popconfirm },
  props: {
    ...buttonProps_,
    confirmed: {
      type: Boolean,
      default: false
    },
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
    const { t } = useI18n();

    const $ref = ref(null);
    const loading = ref(false);

    const trigger = () => {
      if (props.handler) {
        loading.value = true;
        return props
          .handler()
          .then(() => {
            if (props.notify) {
              message.success(t(i18nMessages.antd.action.delete.success));
            }
          })
          .catch((err: Error) => {
            if (props.notify) {
              notification.error({ message: 'error', description: err.message });
            }
          })
          .finally(() => {
            loading.value = false;
          });
      }
      return timer(1000).toPromise();
    };

    return {
      i18nMessages,
      ref: $ref,
      loading,
      trigger
    };
  }
});
</script>
