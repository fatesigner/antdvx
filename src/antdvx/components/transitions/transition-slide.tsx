import { PropType, Transition, defineComponent } from 'vue';

import { ANTDVX_DIRECTIONS } from '../../constants';

/**
 * 滑动过渡, 方向可以为 'up' | 'right' | 'down' | 'left', 默认为 down
 */
export const TransitionSlide = defineComponent({
  name: 'transition-slide',
  props: {
    appear: {
      type: Boolean,
      default: true
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
    return (
      <Transition
        appear={ctx.appear}
        name={ctx.disabled ? undefined : 'slide-' + ctx.direction}
        mode='out-in'
        v-slots={{
          default: () => (ctx.$slots?.default ? ctx.$slots?.default() : '')
        }}
      />
    );
  }
});
