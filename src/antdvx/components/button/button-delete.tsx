import { defineComponent, PropType, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { message, notification, Popconfirm } from 'ant-design-vue';

import { ANTDVX_PLACEMENTS } from '../../constants';
import { i18nMessages } from '../../i18n/messages';
import { IconDeleteBinLine, IconLoader5Line } from '../iconfont';

import { XButton } from './button';
import { XButtonProps } from './types';

export const XButtonDelete = defineComponent({
  name: 'XButtonDelete',
  props: {
    ...XButtonProps,
    placement: {
      type: String as PropType<(typeof ANTDVX_PLACEMENTS)[number]>,
      default: 'bottomRight'
    },
    confirmed: {
      type: Boolean,
      default: false
    },
    onlyIcon: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  setup(props: any, { emit }) {
    const { t } = useI18n();
    const loading_ = ref(false);

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

    const trigger = (e) => {
      if (props.handler) {
        emit('click', e);
        loading_.value = true;
        return props
          .handler(e)
          .then(() => {
            if (props.notify) {
              message.success(t(i18nMessages.antd.action.delete.success));
            }
          })
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
      } else {
        emit('click', e);
      }
    };

    return { loading_, trigger };
  },
  render(ctx) {
    return ctx.confirmed ? (
      <Popconfirm
        disabled={ctx.disabled || ctx.loading_}
        placement={ctx.placement}
        okType={'primary'}
        okText={ctx.$t(i18nMessages.antd.action.delete.oktext)}
        cancelText={ctx.$t(i18nMessages.antd.action.delete.cancelText)}
        title={ctx.$t(i18nMessages.antd.action.delete.confirmText)}
        onConfirm={ctx.trigger}>
        <XButton
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
          onClick={(e) => {
            ctx.$emit('click', e);
          }}
          // handler={ctx.handler}
          // notify={ctx.notify}
          title={ctx.title ? ctx.title : ctx.$t(i18nMessages.antd.action.delete.title)}
          v-slots={{
            default: () => [
              ctx.loading_ ? <IconLoader5Line spin={true} /> : <IconDeleteBinLine />,
              ctx.$slots?.default ? (
                ctx.$slots?.default()
              ) : ctx.onlyIcon ? undefined : (
                <span>{ctx.$t(i18nMessages.antd.action.delete.title)}</span>
              )
            ]
          }}
        />
      </Popconfirm>
    ) : (
      <XButton
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
        title={ctx.title ? ctx.title : ctx.$t(i18nMessages.antd.action.delete.title)}
        onClick={ctx.trigger}
        v-slots={{
          default: () => [
            ctx.loading_ ? <IconLoader5Line spin={true} /> : <IconDeleteBinLine />,
            ctx.$slots?.default ? (
              ctx.$slots?.default()
            ) : ctx.onlyIcon ? undefined : (
              <span>{ctx.$t(i18nMessages.antd.action.delete.title)}</span>
            )
          ]
        }}
      />
    );
  }
});
