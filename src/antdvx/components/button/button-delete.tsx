import { PropType, defineComponent, ref, watch } from 'vue';
import { Popconfirm, message, notification } from 'ant-design-vue';

import { i18nMessages } from '../../i18n/messages';
import { Iconfont } from '../iconfont';

import { XButton } from './button';
import { XButtonProps } from './types';
import { timer } from 'rxjs';
import { useI18n } from 'vue-i18n';

export const XButtonDelete = defineComponent({
  name: 'x-button-delete',
  props: {
    ...XButtonProps,
    confirmed: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String as PropType<'default' | 'icon' | 'text'>,
      default: 'default'
    }
  },
  setup(props: any, { emit, slots }) {
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

    const trigger = () => {
      if (props.handler) {
        loading_.value = true;
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
            loading_.value = false;
          });
      }
      return timer(1000).toPromise();
    };

    return { loading_, trigger };
  },
  render(ctx) {
    return ctx.confirmed ? (
      <Popconfirm
        disabled={ctx.disabled}
        okType={'primary'}
        okText={ctx.$t(i18nMessages.antd.action.delete.oktext)}
        cancelText={ctx.$t(i18nMessages.antd.action.delete.cancelText)}
        title={ctx.$t(i18nMessages.antd.action.delete.confirmText)}
        onConfirm={ctx.trigger}
      >
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
          //handler={ctx.handler}
          //notify={ctx.notify}
          title={ctx.title ? ctx.title : ctx.$t(i18nMessages.antd.action.delete.title)}
          v-slots={{
            default: ({ loading }) => [
              !loading && (ctx.mode === 'default' || ctx.mode === 'icon') ? <Iconfont name={'trash-alt'} scale={0.9} /> : '',
              ctx.$slots?.default ? (
                ctx.$slots?.default()
              ) : ctx.mode === 'default' || ctx.mode === 'text' ? (
                <span>{ctx.$t(i18nMessages.antd.action.delete.title)}</span>
              ) : (
                ''
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
        //handler={ctx.handler}
        //notify={ctx.notify}
        title={ctx.title ? ctx.title : ctx.$t(i18nMessages.antd.action.delete.title)}
        onClick={ctx.trigger}
        v-slots={{
          default: ({ loading }) => [
            !loading && (ctx.mode === 'default' || ctx.mode === 'icon') ? <Iconfont name={'trash-alt'} scale={0.9} /> : '',
            ctx.$slots?.default ? (
              ctx.$slots?.default()
            ) : ctx.mode === 'default' || ctx.mode === 'text' ? (
              <span>{ctx.$t(i18nMessages.antd.action.delete.title)}</span>
            ) : (
              ''
            )
          ]
        }}
      />
    );
  }
});
