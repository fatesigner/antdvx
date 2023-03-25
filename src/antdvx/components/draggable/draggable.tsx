import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';
import { animationFrameScheduler, fromEvent, merge, Subscription } from 'rxjs';
import { map, subscribeOn, switchMap, takeUntil, tap } from 'rxjs/operators';

import { getEventArgs } from '../../utils';

/**
 * 可拖动节点
 */
export const Draggable = defineComponent({
  emits: ['start', 'move', 'stop'],
  setup(props, { emit }) {
    const dragRef = ref<HTMLElement>(null);

    let drag$: Subscription;

    const getDrag$ = ($drag: HTMLElement) => {
      const dragArgs = {
        initialPos: {
          top: 0,
          left: 0
        },
        currentPos: {
          top: 0,
          left: 0
        }
      };

      const mousedown$ = merge(
        fromEvent($drag, 'mousedown', { capture: false, passive: false }),
        fromEvent($drag, 'touchstart', { capture: false, passive: false })
      );
      const mousemove$ = merge(
        fromEvent(document.body, 'mousemove', { capture: false, passive: false }),
        fromEvent(document.body, 'touchmove', { capture: false, passive: false })
      );
      const mouseup$ = merge(
        fromEvent(document.body, 'mouseup', { capture: false, passive: false }),
        fromEvent(document.body, 'touchend', { capture: false, passive: false })
      );

      return mousedown$
        .pipe(
          tap(() => {
            dragArgs.initialPos.top = 0;
            dragArgs.initialPos.left = 0;
            emit('start', dragArgs.initialPos);
          }),
          switchMap((start: any) =>
            mousemove$.pipe(
              map((move: any) => {
                move.preventDefault();
                const startArgs = getEventArgs(start);
                const moveArgs = getEventArgs(move);

                dragArgs.currentPos.top = dragArgs.initialPos.top + moveArgs.points[0][1] - startArgs.points[0][1];
                dragArgs.currentPos.left = dragArgs.initialPos.left + moveArgs.points[0][0] - startArgs.points[0][0];

                return dragArgs.currentPos;
              }),
              takeUntil(
                mouseup$.pipe(
                  tap(async () => {
                    emit('stop', dragArgs.currentPos);
                  })
                )
              )
            )
          )
        )
        .pipe(subscribeOn(animationFrameScheduler));
    };

    onMounted(() => {
      drag$ = getDrag$(dragRef.value).subscribe((pos) => {
        // const left = getBoundaryPosition(pos.left, 0, dragRef.value.offsetWidth - dragRef.value.offsetWidth);
        // dragRef.value.style.left = left + 'px';
        emit('move', pos);
      });
    });

    onBeforeUnmount(() => {
      if (drag$) {
        drag$.unsubscribe();
        drag$ = undefined;
      }
    });

    return {
      dragRef
    };
  },
  render(ctx) {
    return <div ref='dragRef'>{ctx.$slots.default?.()}</div>;
  }
});
