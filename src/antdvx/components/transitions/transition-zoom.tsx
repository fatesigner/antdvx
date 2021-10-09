import { gsap } from 'gsap';
import { Transition, defineComponent } from 'vue';

/**
 * 缩放
 */
export const TransitionZoom = defineComponent({
  name: 'transition-scale',
  props: {
    appear: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    scale: {
      type: [String, Number],
      default: 0.6
    }
  },
  setup(props) {
    const onBeforeEnter = (el: HTMLElement) => {
      gsap.set(el, {
        position: 'absolute',
        top: '50%',
        left: '50%',
        translateX: '-50%',
        translateY: '-50%',
        opacity: 0,
        scale: props.scale
      });
    };

    const onAppear = (el: HTMLElement) => {
      gsap.set(el, {});
    };

    const onEnter = (el: HTMLElement, done) => {
      if (props.disabled) {
        gsap.set(el, {
          ease: 'power4',
          opacity: 1,
          scale: 1,
          onComplete: done
        });
      } else {
        gsap.to(el, {
          duration: 0.2,
          ease: 'power4',
          opacity: 1,
          scale: 1,
          onComplete: done
        });
      }
    };

    const onLeave = (el: HTMLElement, done) => {
      if (props.disabled) {
        gsap.set(el, {
          opacity: 0,
          scale: props.scale,
          onComplete: done
        });
      } else {
        gsap.to(el, {
          duration: 0.3,
          opacity: 0,
          scale: props.scale,
          onComplete: done
        });
      }
    };

    return {
      onAppear,
      onBeforeEnter,
      onEnter,
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
        onLeave={ctx.onLeave}
        v-slots={{
          default: () => (ctx.$slots?.default ? ctx.$slots?.default() : '')
        }}
      />
    );
  }
});
