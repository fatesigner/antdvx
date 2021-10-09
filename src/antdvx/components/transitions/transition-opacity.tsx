import { gsap } from 'gsap';
import { Transition, defineComponent } from 'vue';

/**
 * 透明度
 */
export const TransitionOpacity = defineComponent({
  name: 'transition-opacity',
  props: {
    appear: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    opacity: {
      type: [String, Number],
      default: 0.6
    }
  },
  setup(props) {
    const onBeforeEnter = (el: HTMLElement) => {
      el.dataset.opacity = el.style.opacity;

      gsap.set(el, {
        opacity: props.opacity
      });
    };

    const onEnter = (el: HTMLElement, done) => {
      if (props.disabled) {
        gsap.set(el, {
          opacity: 1,
          onComplete: done
        });
      } else {
        gsap.to(el, {
          duration: 0.2,
          opacity: 1,
          onComplete: done
        });
      }
    };

    const onAfterEnter = (el: HTMLElement) => {
      // 还原初始 style
      el.style.opacity = el.dataset.opacity ?? '';

      Object.keys(el.dataset).forEach((dataKey) => {
        delete el.dataset[dataKey];
      });
    };

    const onLeave = (el: HTMLElement, done) => {
      if (props.disabled) {
        gsap.set(el, {
          opacity: props.opacity,
          onComplete: done
        });
      } else {
        gsap.to(el, {
          duration: 0.2,
          opacity: props.opacity,
          onComplete: done
        });
      }
    };

    return {
      onBeforeEnter,
      onEnter,
      onAfterEnter,
      onLeave
    };
  },
  render(ctx) {
    return (
      <Transition
        appear={ctx.appear}
        css={false}
        onBeforeEnter={ctx.onBeforeEnter}
        onEnter={ctx.onEnter}
        onAfterEnter={ctx.onAfterEnter}
        onLeave={ctx.onLeave}
        v-slots={{
          default: () => (ctx.$slots?.default ? ctx.$slots?.default() : '')
        }}
      />
    );
  }
});
