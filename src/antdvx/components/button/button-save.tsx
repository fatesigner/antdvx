import { PropType, defineComponent, ref } from 'vue';

import { i18nMessages } from '../../i18n/messages';
import { Iconfont } from '../iconfont';

import { XButton } from './button';
import { XButtonProps } from './types';

export const XButtonSave = defineComponent({
  name: 'x-button-save',
  props: {
    ...XButtonProps,
    mode: {
      type: String as PropType<'default' | 'icon' | 'text'>,
      default: 'default'
    }
  },
  setup(props: any, { emit, slots }) {
    const btnRef = ref(null);

    const trigger = () => {
      if (btnRef.value) {
        (btnRef.value as any)?.trigger();
      }
    };

    return { trigger, btnRef };
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
        loading={ctx.loading}
        shape={ctx.shape}
        size={ctx.size}
        target={ctx.target}
        type={ctx.type}
        color={ctx.color}
        handler={ctx.handler}
        notify={ctx.notify}
        title={ctx.title ? ctx.title : ctx.$t(i18nMessages.antd.action.add)}
        v-slots={{
          default: ({ loading }) => [
            !loading && (ctx.mode === 'default' || ctx.mode === 'icon') ? <Iconfont name={'save'} /> : '',
            ctx.$slots?.default ? (
              ctx.$slots?.default()
            ) : ctx.mode === 'default' || ctx.mode === 'text' ? (
              <span>{ctx.$t(i18nMessages.antd.action.save)}</span>
            ) : (
              ''
            )
          ]
        }}
      />
    );
  }
});
