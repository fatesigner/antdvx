<template>
  <antd-button
    ref="el"
    :class="['action-upload', appearance === 'custom' ? 'action-custom' : '']"
    :block="block"
    :disabled="disabled"
    :ghost="ghost"
    :html-type="htmlType"
    :loading="loading"
    :type="type"
    :size="size"
    :color="color"
    :outline="outline"
    :notify="notify"
    :title="title ? title : $t(i18nMessages.antd.action.upload)"
  >
    <upload-outlined v-if="!loading && icon" /><slot>{{ $t(i18nMessages.antd.action.upload) }}</slot>
  </antd-button>
</template>

<script lang="ts">
import { notification } from 'ant-design-vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import buttonProps from 'ant-design-vue/lib/button/buttonTypes';
import { PropType, computed, defineComponent, onMounted, ref } from 'vue';
import { IFileChooserOptions } from '@fatesigner/file-chooser/types';
import { createFileChooser } from '@fatesigner/file-chooser';
import { getGUID } from '@fatesigner/utils/random';

import { AntdButton } from '../button';
import { i18nMessages } from '../../i18n/messages';

const buttonProps_ = buttonProps();

export default defineComponent({
  components: { AntdButton, UploadOutlined },
  props: {
    ...buttonProps_,
    accept: {
      // 'excel' | 'pdf'
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    maxCount: {
      type: Number,
      default: 1000
    },
    maxSize: {
      type: Number,
      default: 10 * 1024
    },
    // 'normal' | 'mini' | 'custom'
    appearance: {
      type: String,
      default: 'mini'
    },
    name: {
      type: String,
      default: 'file'
    },
    icon: {
      type: Boolean,
      default: true
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
    const $el = ref(null);
    const loading = ref(false);

    const accept = computed<string>(() => {
      if (props.accept === 'excel') {
        return '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';
      }
      return props.accept;
    });

    let fileChooser;

    const getFileChooserOptions = (): IFileChooserOptions => {
      return {
        id: getGUID(12),
        clickable: !loading.value,
        accept: accept.value,
        multiple: props.multiple,
        maxCount: props.maxCount,
        maxSize: props.maxSize,
        compress: {
          quality: 0.6
        }
      };
    };

    const trigger = () => {
      if (fileChooser) {
        fileChooser.trigger();
      }
    };

    onMounted(() => {
      if ($el.value) {
        createFileChooser(
          $el.value.$el,
          getFileChooserOptions(),
          (res) => {
            if (props.handler) {
              loading.value = true;
              props
                .handler((props.multiple ? res.files : res?.files[0] ?? null) as any)
                .catch((err: Error) => {
                  notification.error({ message: '', description: err.message });
                })
                .finally(() => {
                  loading.value = false;
                });
            }
          },
          (err) => {
            notification.error({ message: '', description: err.message });
          }
        ).then(function (res) {
          fileChooser = res;
        });
      }
    });

    return {
      i18nMessages,
      el: $el,
      loading,
      trigger
    };
  }
});
</script>

<style lang="scss" scoped>
.action-upload {
  &.action-custom {
    height: auto;
    color: #333;

    &:hover,
    &:focus {
      color: #333;
    }

    &:active,
    &.active {
      color: #333;
    }
  }
}
</style>
