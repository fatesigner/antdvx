import { Power1, gsap } from 'gsap';
import { gaspCounter } from '@fatesigner/utils/gsap';
import { PropType, defineComponent, nextTick, onMounted, ref, watch } from 'vue';

import $styles from './annular-bar.module.less';

/**
 * 环形进度条
 */
export const AnnularBar = defineComponent({
  name: 'AnnularBar',
  props: {
    color: {
      type: String
    },
    count: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    },
    size: {
      type: String as PropType<'large' | 'small' | 'mini'>
    }
  },
  setup(props: any) {
    const countRef = ref<HTMLElement>();
    const circle1Ref = ref<SVGCircleElement>();
    const circle2Ref = ref<SVGCircleElement>();

    // 执行动画
    const render = () => {
      nextTick(() => {
        // 数字
        if (countRef.value) {
          gaspCounter(
            countRef.value,
            {
              end: props.count,
              duration: 0.2,
              increment: 1
            },
            '-=0.5'
          );
        }

        // 环形
        if (circle2Ref.value) {
          const cir = Math.PI * circle2Ref.value.r.baseVal.value * 2;
          if (props.count > 0 && getComputedStyle(circle2Ref.value).strokeDasharray.split(',')?.[0] === '0px') {
            gsap.fromTo(
              circle2Ref.value,
              {
                strokeOpacity: 1,
                strokeDasharray: '0, ' + cir
              },
              {
                ease: Power1.easeIn,
                duration: 0.3,
                strokeOpacity: 1,
                strokeDasharray: Math.floor((cir * props.count) / props.total) + ', ' + cir
              }
            );
          } else {
            gsap.to(circle2Ref.value, {
              duration: 0.2,
              strokeOpacity: props.count > 0 ? 1 : 0,
              strokeDasharray: Math.floor((cir * props.count) / props.total) + ', ' + cir
            });
          }
        }
      });
    };

    watch([() => props.count, () => props.total], () => {
      render();
    });

    onMounted(() => {
      render();
    });

    return {
      countRef,
      circle1Ref,
      circle2Ref,
      render
    };
  },
  render(ctx) {
    return (
      <div class={[$styles.annular, ctx.color ? $styles[ctx.color] : undefined, ctx.size ? $styles[ctx.size] : undefined]}>
        <div class={$styles.count} ref='countRef'>
          0
        </div>
        <svg viewBox='0 0 60 60'>
          <circle ref='circle1Ref' class={$styles.circle1} r='26' cx='30' cy='30' stroke-width='4' />
          <circle ref='circle2Ref' class={$styles.circle2} r='26' cx='30' cy='30' stroke-width={ctx.count ? 4 : 0} />
        </svg>
      </div>
    );
  }
});
