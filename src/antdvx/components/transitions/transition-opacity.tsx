import { PropType, Transition, defineComponent } from 'vue';

import $styles from './transitions-opacity.module.less';

/**
 * 透明度
 */
export const TransitionOpacity = defineComponent({
  name: 'TransitionOpacity',
  props: {
    appear: {
      type: Boolean,
      default: true
    },
    mode: {
      type: String as PropType<'in-out' | 'out-in'>
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  render(ctx) {
    const slot = ctx.$slots?.default();
    return slot ? (
      <Transition
        appear={ctx.appear}
        mode={ctx.mode}
        enterToClass={ctx.disabled ? undefined : $styles['opacity-enter-to']}
        leaveToClass={ctx.disabled ? undefined : $styles['opacity-leave-to']}
        enterActiveClass={ctx.disabled ? undefined : $styles['opacity-enter-active']}
        leaveActiveClass={ctx.disabled ? undefined : $styles['opacity-leave-active']}
        v-slots={{
          default: () => slot
        }}
      />
    ) : undefined;
  }
});
