import { gsap } from 'gsap';
import { getViewportSize, scrollTo } from '@fatesigner/utils/document';
import { Subscription, animationFrameScheduler, fromEvent, merge } from 'rxjs';
import { filter, map, subscribeOn, switchMap, takeUntil, tap } from 'rxjs/operators';
import { PropType, defineComponent, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { getEventArgs } from '../../utils';
import { i18nMessages } from '../../i18n/messages';

import { IconArrowUpLine } from '../iconfont';

export const XBackTop = defineComponent({
  name: 'x-back-top',
  props: {
    target: {
      type: Object as PropType<HTMLElement>
    },
    right: {
      type: [Number, String] as PropType<number | string>,
      default: 60
    },
    bottom: {
      type: [Number, String] as PropType<number | string>,
      default: 20
    },
    dragable: {
      type: Boolean,
      default: true
    },
    threshold: {
      type: Number as PropType<number>,
      default: 400
    },
    /* throttle: {
      type: [Number, String] as PropType<number>,
      default: 100
    }, */
    duration: {
      type: Number as PropType<number>,
      default: 300
    },
    zIndex: {
      type: Number as PropType<number>,
      default: 1000
    }
  },
  setup(props) {
    let sub$: Subscription;

    const wrapRef = ref<HTMLElement>();
    const target_ = ref<HTMLElement>();
    const visible = ref(false);

    // 显示
    const present = () => {
      if (!visible.value) {
        visible.value = true;
        wrapRef.value.style.display = 'block';
        // 设置初始位置
        gsap
          .set(wrapRef.value, {
            opacity: 0,
            scale: 0
          })
          .then(() => {
            // 移动至 指定的 bottom 位置
            gsap.to(wrapRef.value, {
              duration: 0.3,
              ease: 'power4',
              opacity: 1,
              scale: 1
            });
          });
      }
    };

    // 隐藏
    const dismiss = () => {
      if (visible.value) {
        visible.value = false;
        gsap.to(wrapRef.value, {
          duration: 0.3,
          ease: 'power4',
          opacity: 0.66,
          scale: 0
        });
      }
    };

    const switchAction = () => {
      if (target_.value) {
        if (target_.value.scrollTop >= props.threshold) {
          present();
        } else {
          dismiss();
        }
      }
    };

    // 拖动
    let drag$;
    const dragArgs = {
      moving: false,
      initialPos: {
        right: 0,
        bottom: 0
      }
    };
    const getDrag$ = ($drag: HTMLElement) => {
      const mousedown$ = merge(
        fromEvent($drag, 'mousedown', { capture: false, passive: false }),
        fromEvent($drag, 'touchstart', { capture: false, passive: false })
      );
      const mousemove$ = merge(
        fromEvent(document, 'mousemove', { capture: false, passive: false }),
        fromEvent(document, 'touchmove', { capture: false, passive: false })
      );
      const mouseup$ = merge(
        fromEvent(document, 'mouseup', { capture: false, passive: false }),
        fromEvent(document, 'touchend', { capture: false, passive: false })
      );

      return mousedown$
        .pipe(
          filter(() => props.dragable),
          tap(() => {
            dragArgs.initialPos.right = parseInt(getComputedStyle($drag, null).getPropertyValue('right').replace('px', '')) ?? 0;
            dragArgs.initialPos.bottom = parseInt(getComputedStyle($drag, null).getPropertyValue('bottom').replace('px', '')) ?? 0;
          }),
          switchMap((start: any) =>
            mousemove$.pipe(
              map((move: any) => {
                dragArgs.moving = true;
                move.preventDefault();
                const startArgs = getEventArgs(start);
                const moveArgs = getEventArgs(move);

                return {
                  right: dragArgs.initialPos.right - moveArgs.points[0][0] + startArgs.points[0][0],
                  bottom: dragArgs.initialPos.bottom - moveArgs.points[0][1] + startArgs.points[0][1]
                };
              }),
              takeUntil(
                mouseup$.pipe(
                  tap(() => {
                    setTimeout(() => {
                      dragArgs.moving = false;
                    }, 200);
                  })
                )
              )
            )
          )
        )
        .pipe(subscribeOn(animationFrameScheduler));
    };

    const onClick = () => {
      if (target_.value) {
        if (!dragArgs.moving) {
          scrollTo(target_.value, undefined, 0, props.duration ?? 0);
        }
      }
    };

    watch(
      () => props.target,
      (val) => {
        if (val) {
          target_.value = val;
        } else {
          console.error('The target is not a correct Html element');
        }
      }
    );

    watch(target_, (val) => {
      // 移除上一个 targe 绑定的事件
      if (sub$) {
        sub$.unsubscribe();
      }

      // 监听指定 target 的滚动事件
      if (val) {
        sub$ = fromEvent(val, 'scroll', { capture: false, passive: false })
          // .pipe(throttleTime(props.throttle))
          .subscribe(() => {
            switchAction();
          });
      }
    });

    onMounted(() => {
      nextTick(() => {
        // 设置初始位置
        wrapRef.value.style.right = props.right + 'px';
        wrapRef.value.style.bottom = props.bottom + 'px';
        if (!props.target) {
          // 默认 target 为 parent
          const $parent = wrapRef.value.parentElement;
          if ($parent) {
            target_.value = $parent as HTMLElement;
          }
        } else {
          switchAction();
        }
        drag$ = getDrag$(wrapRef.value).subscribe((pos) => {
          const vw = getViewportSize(document);
          if (pos.right >= 0 && pos.right <= vw.width - wrapRef.value.offsetWidth) {
            wrapRef.value.style.right = `${pos.right}px`;
          }
          if (pos.bottom >= 0 && pos.bottom <= vw.height - wrapRef.value.offsetHeight) {
            wrapRef.value.style.bottom = `${pos.bottom}px`;
          }
        });
      });
    });

    onBeforeUnmount(() => {
      if (drag$) {
        drag$.unsubscribe();
        drag$ = null;
      }
    });

    return {
      i18nMessages,
      wrapRef,
      onClick
    };
  },
  render(ctx) {
    return (
      <div class='antdvx-back-top' ref='wrapRef' style={{ zIndex: ctx.zIndex }} title={ctx.$t(i18nMessages.antd.backTop.title)} onClick={ctx.onClick}>
        {ctx.$slots?.default ? (
          ctx.$slots.default()
        ) : (
          <div class='antdvx-back-top-shadow'>
            <IconArrowUpLine />
          </div>
        )}
      </div>
    );
  }
});
