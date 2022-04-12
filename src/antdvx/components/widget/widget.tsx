import { gsap } from 'gsap';
import { getViewportSize } from '@fatesigner/utils/document';
import { animationFrameScheduler, fromEvent, merge } from 'rxjs';
import { filter, map, subscribeOn, switchMap, takeUntil, tap } from 'rxjs/operators';
import { defineComponent, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

import { getEventArgs } from '../../utils';
import { AntdStorageService } from '../../config';

import { WidgetProps } from './type';

/**
 * 浮动小部件
 */
export const Widget = defineComponent({
  name: 'Widget',
  props: WidgetProps,
  emits: ['click'],
  setup(props) {
    const instance = getCurrentInstance();

    // 定义 uid
    const uid = props.name ? props.name : instance.uid;

    const wrapRef = ref<HTMLElement>();

    const visible = ref(false);
    const moving = ref(false);

    // 拖动
    let drag$;
    const dragArgs = {
      initialPos: {
        right: 0,
        bottom: 0
      }
    };

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
                moving.value = true;
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
                      moving.value = false;
                    }, 200);
                  })
                )
              )
            )
          )
        )
        .pipe(subscribeOn(animationFrameScheduler));
    };

    onMounted(() => {
      nextTick(() => {
        // 设置初始位置
        if (AntdStorageService) {
          // 还原已存储的位置
          const str = AntdStorageService.get('WIDGET_' + uid) as string;
          try {
            if (str) {
              const { right, bottom } = JSON.parse(str);
              wrapRef.value.style.right = right;
              wrapRef.value.style.bottom = bottom;
            } else {
              wrapRef.value.style.right = props.right + 'px';
              wrapRef.value.style.bottom = props.bottom + 'px';
            }
          } catch (e) {}
        } else {
          console.warn('Please use setStorageService for Antdvx components.');
        }
        if (props.visible) {
          present();
        }
        drag$ = getDrag$(wrapRef.value).subscribe((pos) => {
          const vw = getViewportSize(document);
          if (pos.right >= 0 && pos.right <= vw.width - wrapRef.value.offsetWidth) {
            wrapRef.value.style.right = `${pos.right}px`;
          }
          if (pos.bottom >= 0 && pos.bottom <= vw.height - wrapRef.value.offsetHeight) {
            wrapRef.value.style.bottom = `${pos.bottom}px`;
          }
          if (AntdStorageService) {
            // 将位置保存至 local storage
            AntdStorageService.set(
              'WIDGET_' + uid,
              JSON.stringify({
                right: wrapRef.value.style.right,
                bottom: wrapRef.value.style.bottom
              })
            );
          } else {
            console.warn('Please use setStorageService for Antdvx components.');
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
      wrapRef,
      moving,
      present,
      dismiss
    };
  },
  render(ctx) {
    return (
      <div
        ref='wrapRef'
        class='antdvx-widget'
        style={{
          zIndex: ctx.zIndex
        }}
        onClick={() => {
          ctx.$emit('click');
        }}>
        {ctx.$slots?.default ? ctx.$slots.default() : <div class='antdvx-widget-shadow' />}
      </div>
    );
  }
});
