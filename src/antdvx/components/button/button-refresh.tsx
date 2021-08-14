import { PropType, defineComponent, ref, watch } from 'vue';

import { i18nMessages } from '../../i18n/messages';
import { IconRedo, IconSync } from '../iconfont';

import { XButton } from './button';
import { XButtonProps } from './types';
import { notification } from 'ant-design-vue';

export const XButtonRefresh = defineComponent({
  name: 'x-button-refresh',
  props: {
    ...XButtonProps,
    mode: {
      type: String as PropType<'default' | 'icon' | 'text'>,
      default: 'default'
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
        ref={'btnRef'}
        block={ctx.block}
        disabled={ctx.disabled}
        ghost={ctx.ghost}
        href={ctx.href}
        htmlType={ctx.htmlType}
        //loading={this.loading_}
        shape={ctx.shape}
        size={ctx.size}
        target={ctx.target}
        type={ctx.type}
        color={ctx.color}
        //handler={ctx.handler}
        notify={ctx.notify}
        title={ctx.title ? ctx.title : ctx.$t(i18nMessages.antd.action.refresh)}
        onClick={ctx.trigger}
        v-slots={{
          default: () => [
            !ctx.loading_ && (ctx.mode === 'default' || ctx.mode === 'icon') ? <IconRedo scale='0.9' /> : ctx.loading_ ? <IconSync scale='0.9' spin /> : '',
            ctx.$slots?.default ? (
              ctx.$slots?.default()
            ) : ctx.mode === 'default' || ctx.mode === 'text' ? (
              <span>{ctx.$t(i18nMessages.antd.action.refresh)}</span>
            ) : (
              ''
            )
          ],
          title: () => <span>{ctx.loading_}</span>
        }}
      />
    );
  }
});
