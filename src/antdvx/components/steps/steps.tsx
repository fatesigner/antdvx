import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { PropType, defineComponent, nextTick, onMounted, ref, watch } from 'vue';

import { IconArrowLeftSLine, IconArrowRightSLine, IconCheckboxCircleLine, IconCloseCircleLine } from '../iconfont';

const $styles = {
  wrap: 'antdvx-steps-wrap',
  line: 'antdvx-steps-line',
  status: 'antdvx-steps-status',
  dot: 'antdvx-steps-dot',
  sign: 'antdvx-steps-sign',
  next: 'antdvx-steps-next',
  prev: 'antdvx-steps-prev',
  pagination: 'antdvx-steps-pagination',
  badge: 'antdvx-steps-badge',
  step: 'antdvx-steps-step',
  progress: 'antdvx-steps-progress',
  linec: 'antdvx-steps-linec',
  liner: 'antdvx-steps-liner',
  inner: 'antdvx-steps-inner',
  activated: 'antdvx-steps-activated',
  title: 'antdvx-steps-title',
  selectable: 'antdvx-steps-selectable',
  ongoing: 'antdvx-steps-ongoing',
  finished: 'antdvx-steps-finished',
  failed: 'antdvx-steps-failed'
};

/**
 * 基于 Swiper 的进度条组件
 */
export const XSteps = defineComponent({
  name: 'XSteps',
  props: {
    type: {
      type: String as PropType<'default' | 'dot'>,
      default: 'default'
    },
    pagination: {
      type: Boolean,
      default: false
    },
    selectable: {
      type: Boolean,
      default: false
    },
    activated: {
      type: Number
    },
    current: {
      type: Number,
      default: 2
    },
    direction: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: 'horizontal'
    },
    placement: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: 'horizontal'
    },
    // status: waiting ongoing finished failed
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  emits: ['update:activated', 'selected', 'itemClick'],
  setup(props: any, { emit }) {
    const wrapRef = ref<HTMLElement>();
    const stepRefs = ref<HTMLElement[]>([]);

    const activated_ = ref();

    // 重新调整布局、位置、尺寸
    const layout = () => {
      if (stepRefs.value) {
        const $lines = wrapRef.value?.querySelectorAll('.' + $styles.line);
        const $status = wrapRef.value?.querySelectorAll('.' + $styles.status);
        let temp = 0;
        Array.from(stepRefs.value).forEach(($step, index, array) => {
          const width = $step.offsetWidth;
          if (width) {
            const _w = (width - ($status[index] as HTMLElement).offsetWidth) / 2;
            ($lines[index] as HTMLElement).style.width = temp + _w + 'px';
            temp = _w;
          }
        });
      }
    };

    watch(
      () => props.activated,
      (val) => {
        if (activated_.value !== val) {
          activated_.value = val;
        }
      },
      {
        immediate: true
      }
    );

    watch(activated_, (val) => {
      if (props.activated !== val) {
        emit('update:activated', val);
        nextTick(() => {
          emit('selected', val);
        });
      }
    });

    onMounted(() => {
      // layout();
    });

    return {
      wrapRef,
      stepRefs,
      activated_,
      layout
    };
  },
  render(ctx) {
    const typeSlot =
      ctx.type === 'dot'
        ? function () {
            return <div class={$styles.dot} />;
          }
        : function ({ item, index }) {
            // status: waiting ongoing finished failed
            if (item.status === 'finished') {
              return (
                <div class={$styles.sign}>
                  <IconCheckboxCircleLine />
                </div>
              );
            } else if (item.status === 'failed') {
              return (
                <div class={$styles.sign}>
                  <IconCloseCircleLine />
                </div>
              );
            } else {
              return (
                <div class={$styles.sign}>
                  <div class={$styles.badge}>{index + 1}</div>
                </div>
              );
            }
          };
    const statusSlot =
      ctx.$slots?.status ??
      function ({ item, index }) {
        return [typeSlot({ item, index }), ctx.direction === 'horizontal' ? <div class={$styles.title}>{item.title}</div> : undefined];
      };
    return (
      <div class={[$styles.wrap, ctx.pagination ? $styles.pagination : undefined, ctx.selectable ? $styles.selectable : undefined]} ref='wrapRef'>
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          slidesPerView='auto'
          slidesPerGroup={1}
          space-between={0}
          pagination={ctx.pagination ? ({ clickable: true, dynamicBullets: true } as any) : undefined}
          navigation={
            {
              nextEl: '.' + $styles.next,
              prevEl: '.' + $styles.prev
            } as any
          }
          onClick={({ clickedIndex }) => {
            ctx.activated_ = clickedIndex;
          }}>
          <div class={$styles.next}>
            <IconArrowRightSLine />
          </div>
          <div class={$styles.prev}>
            <IconArrowLeftSLine />
          </div>
          {ctx.data.map((item, index) => {
            return (
              <SwiperSlide class={$styles.step}>
                <div
                  class={$styles.progress}
                  onClick={() => {
                    ctx.$emit('itemClick', { item, index });
                  }}>
                  <div class='tw-flex-1' style={{ visibility: index === 0 ? 'hidden' : undefined }}>
                    <div class={[$styles.line, index < ctx.current + 1 ? $styles.linec : undefined]} />
                  </div>
                  <div class={[$styles.status, $styles?.[item.status]]}>{statusSlot({ item, index })}</div>
                  <div class='tw-flex-1' style={{ visibility: index === ctx.data.length - 1 ? 'hidden' : undefined }}>
                    <div class={[$styles.liner, index < ctx.current ? $styles.linec : undefined]} />
                  </div>
                </div>
                {ctx.direction === 'vertical' ? <div class='tw-text-center'>{item.title}</div> : undefined}
                <div class={[$styles.inner, ctx.selectable && ctx.activated === index ? $styles.activated : undefined]}>{item.content}</div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    );
  }
});
