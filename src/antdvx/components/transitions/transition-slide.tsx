import { PropType, Transition, defineComponent } from 'vue';

import { ANTDVX_DIRECTIONS } from '../../constants';

import $styles from './transitions-slide.module.less';

/**
 * 滑动过渡, 方向可以为 'up' | 'right' | 'down' | 'left', 默认为 down
 */
export const TransitionSlide = defineComponent({
  name: 'TransitionSlide',
  props: {
    appear: {
      type: Boolean,
      default: true
    },
    mode: {
      type: String as PropType<'in-out' | 'out-in'>,
      default: 'out-in'
    },
    direction: {
      // 'up', 'right', 'down', 'left'
      type: String as PropType<typeof ANTDVX_DIRECTIONS[number]>,
      default: 'down'
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
        enterToClass={ctx.disabled ? undefined : $styles['slide-' + ctx.direction + '-enter-to']}
        leaveToClass={ctx.disabled ? undefined : $styles['slide-' + ctx.direction + '-leave-to']}
        enterActiveClass={ctx.disabled ? undefined : $styles['slide-' + ctx.direction + '-enter-active']}
        leaveActiveClass={ctx.disabled ? undefined : $styles['slide-' + ctx.direction + '-leave-active']}
        v-slots={{
          default: () => slot
        }}
      />
    ) : undefined;
  }
});
