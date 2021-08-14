import { defineComponent, ref, watch } from 'vue';
import { Button, notification } from 'ant-design-vue';

import { XButtonProps } from './types';

import './button.less';

export const XButton = defineComponent({
  name: 'x-button',
  props: XButtonProps,
  emits: ['click'],
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
      <Button
        class={{
          ['ant-color-' + ctx.color]: !!ctx.color,
          'ant-btn-outline': ctx.type === 'outline',
          'ant-btn-3d': ctx.type === '3d',
          'ant-btn-mini': ctx.size === 'mini'
        }}
        block={ctx.block}
        disabled={ctx.disabled}
        ghost={ctx.ghost}
        href={ctx.href}
        htmlType={ctx.htmlType}
        loading={ctx.loading_}
        shape={ctx.shape}
        size={ctx.size}
        target={ctx.target}
        type={ctx.type === 'outline' || ctx.type === '3d' ? undefined : ctx.type}
        title={ctx.title}
        onClick={ctx.trigger}
      >
        {ctx.$slots.default?.({ loading: ctx.loading_ })}
      </Button>
    );
  }
});
