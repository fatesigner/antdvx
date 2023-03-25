import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import { createFileChooser, IFileChooserOptions } from '@fatesigner/file-chooser';
import { getGUID } from '@fatesigner/utils/random';
import { notification } from 'ant-design-vue';

import { i18nMessages } from '../../i18n/messages';
import { IconLoader5Line } from '../iconfont';

import { XButton } from './button';
import { XButtonProps } from './types';

export const XButtonUpload = defineComponent({
  name: 'XButtonUpload',
  props: {
    ...XButtonProps,
    autosize: {
      type: Boolean,
      default: false
    },
    showIcon: {
      type: Boolean,
      default: true
    },
    name: {
      type: String,
      default: 'file'
    },
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
    }
  },
  emits: ['change'],
  setup(props: any, { emit }) {
    const $btnRef = ref();
    const loading_ = ref(false);

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
        clickable: false,
        accept: accept.value,
        multiple: props.multiple,
        maxCount: props.maxCount,
        maxSize: props.maxSize,
        compress: {
          quality: 0.6
        }
      };
    };

    watch(
      () => props.loading,
      (val) => {
        if (loading_.value !== val) {
          loading_.value = val;
        }
      },
      {
        immediate: true
      }
    );

    const trigger = () => {
      if (!loading_.value) {
        fileChooser?.trigger();
      }
    };

    onMounted(() => {
      if ($btnRef.value) {
        createFileChooser(
          $btnRef.value.$el,
          getFileChooserOptions(),
          (res) => {
            if (props.handler) {
              loading_.value = true;
              props
                .handler((props.multiple ? res.files : res?.files[0] ?? null) as any)
                .catch((err: Error) => {
                  if (props.notify) {
                    notification.error({ message: '', description: err.message });
                  } else {
                    throw err;
                  }
                })
                .finally(() => {
                  loading_.value = false;
                });
            }
            emit('change', props.multiple ? res.files : res?.files[0]);
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
      btnRef: $btnRef,
      loading_,
      trigger
    };
  },
  render(ctx) {
    return (
      <XButton
        class={['ant-btn-upload', ctx.autosize ? 'ant-btn-autosize' : '']}
        ref='btnRef'
        block={ctx.block}
        disabled={ctx.disabled}
        ghost={ctx.ghost}
        href={ctx.href}
        htmlType={ctx.htmlType}
        loading={ctx.loading_}
        shape={ctx.shape}
        size={ctx.size}
        target={ctx.target}
        type={ctx.type}
        color={ctx.color}
        spin={false}
        // handler={ctx.handler}
        // notify={ctx.notify}
        title={ctx.title ? ctx.title : ctx.$t(i18nMessages.antd.action.upload)}
        onClick={ctx.trigger}
        v-slots={{
          default: () => [
            ctx.showIcon ? ctx.loading_ ? <IconLoader5Line spin={true} /> : <UploadOutlined /> : undefined,
            ctx.$slots?.default ? (
              ctx.$slots?.default({ loading: ctx.loading_ })
            ) : (
              <span>{ctx.$t(i18nMessages.antd.action.upload)}</span>
            )
          ]
        }}
      />
    );
  }
});
