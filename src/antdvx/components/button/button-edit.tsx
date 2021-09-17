import { notification } from 'ant-design-vue';
import { defineComponent, ref, watch } from 'vue';

import { i18nMessages } from '../../i18n/messages';
import { IconLoader5Line, IconPencilLine } from '../iconfont';

import { XButton } from './button';
import { XButtonProps } from './types';

export const XButtonEdit = defineComponent({
  name: 'x-button-edit',
  props: {
    ...XButtonProps,
    onlyIcon: {
      type: Boolean,
      default: false
    }
  },
  setup(props: any, { emit }) {
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
        loading_.value = true;
        props
          .handler()
          .catch((err) => {
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
    return (
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
        //handler={ctx.handler}
        //notify={ctx.notify}
        title={ctx.title ? ctx.title : ctx.$t(i18nMessages.antd.action.edit)}
        onClick={ctx.trigger}
        v-slots={{
          default: () => [
            ctx.loading_ ? <IconLoader5Line spin={true} /> : <IconPencilLine />,
            ctx.$slots?.default ? ctx.$slots?.default() : ctx.onlyIcon ? '' : <span>{ctx.$t(i18nMessages.antd.action.edit)}</span>
          ]
        }}
      />
    );
  }
});
