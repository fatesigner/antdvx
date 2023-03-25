import { defineComponent, ref, watch } from 'vue';
import { LoadingOutlined } from '@ant-design/icons-vue';
import { Button, notification } from 'ant-design-vue';

import { XButtonProps } from './types';

export const XButton = defineComponent({
  name: 'XButton',
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
          .handler(e)
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
    const props: any = {
      block: ctx.block,
      ghost: ctx.ghost,
      href: ctx.href,
      htmlType: ctx.htmlType,
      // loading: ctx.spin ? ctx.loading_ : false,
      disabled: ctx.loading_,
      shape: ctx.shape,
      size: ctx.size,
      target: ctx.target,
      type: ctx.type === 'outline' || ctx.type === '3d' ? undefined : ctx.type,
      title: ctx.title,
      onClick: ctx.trigger
    };
    if (ctx.disabled) {
      props.disabled = true;
    }
    return (
      <Button
        class={{
          ['ant-color-' + ctx.color]: !!ctx.color,
          'ant-btn-outline': ctx.type === 'outline',
          'ant-btn-3d': ctx.type === '3d',
          'ant-btn-mini': ctx.size === 'mini',
          'antx-btn-loading': ctx.spin ? ctx.loading_ : false
        }}
        {...props}>
        {ctx.spin && ctx.loading_
          ? [
              <div class='antx-btn-loading-mask' />,
              <div class='antx-btn-loading-spin'>
                <LoadingOutlined />
              </div>
            ]
          : undefined}
        {ctx.$slots.default?.({ loading: ctx.loading_ })}
      </Button>
    );
  }
});
