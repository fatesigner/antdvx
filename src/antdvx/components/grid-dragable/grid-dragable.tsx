import { gsap } from 'gsap';
import { debounce } from '@fatesigner/utils';
import { isBoolean } from '@fatesigner/utils/type-check';
import { animationFrameScheduler, fromEvent, merge } from 'rxjs';
import { filter, map, subscribeOn, switchMap, takeUntil, tap } from 'rxjs/operators';
import { PropType, defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { getEventArgs } from '../../utils';

import { IconArrowLeftSLine, IconArrowRightSLine } from '../iconfont';

/**
 * 可拖拽两栏布局
 */
export const GridDragable = defineComponent({
  name: 'grid-dragable',
  components: {
    IconArrowLeftSLine,
    IconArrowRightSLine
  },
  props: {
    appear: {
      type: Boolean,
      default: false
    },
    transitional: {
      type: Boolean,
      default: true
    },
    collapsed: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 280
    },
    min: {
      type: Number
    },
    max: {
      type: Number
    },
    limit: {
      type: Array as PropType<number[]>
    }
  },
  emits: ['update:collapsed'],
  setup(props, { emit }) {
    const leftRef = ref();
    const anchorRef = ref();
    const anchorIconRef = ref();

    const collapsed_ = ref(false);

    const limit = [0, 0];
    let currentWidth = props.width;
    const collapsedWidth = 20;

    if (props.min) {
      limit[0] = props.min;
      if (props.width < props.min) {
        currentWidth = props.min;
      }
    } else {
      limit[0] = 66;
    }

    if (props.max) {
      limit[1] = props.max;
      if (props.width > props.max) {
        currentWidth = props.max;
      }
    } else {
      limit[1] = currentWidth + 100;
    }

    const transitionTo = debounce(
      function (val: boolean, transitional: boolean) {
        if (leftRef.value) {
          if (transitional) {
            gsap.to(leftRef.value, {
              duration: 0.3,
              width: val ? collapsedWidth : currentWidth
            });
            gsap.to(anchorIconRef.value.$el, {
              duration: 0.3,
              ease: 'power4',
              rotateY: val ? 180 : 360
            });
          } else {
            gsap.set(leftRef.value, {
              width: val ? collapsedWidth : currentWidth
            });
            gsap.set(anchorIconRef.value.$el, {
              rotateY: val ? 180 : 360
            });
          }
        }
      },
      300,
      true
    );

    // 切换左侧栏展开状态
    const toggleCollapsed = (val?: boolean, transitional?: boolean) => {
      val = isBoolean(val) ? val : !collapsed_.value;
      transitional = transitional ?? props.transitional;
      transitionTo(val, transitional);
      collapsed_.value = val;
    };

    // 点击切换按钮
    const onCollapsedClick = () => {
      collapsed_.value = !collapsed_.value;
    };

    // 拖拽, 改变左侧栏宽度
    let drag$;
    const getDrag$ = ($drag: HTMLElement) => {
      const dragArgs = {
        initialPos: {
          width: 0
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
          filter(() => !collapsed_.value),
          tap(() => {
            dragArgs.initialPos.width = parseInt(getComputedStyle(leftRef.value, null).getPropertyValue('width').replace('px', '')) ?? 0;
          }),
          switchMap((start: any) =>
            mousemove$.pipe(
              map((move: any) => {
                move.preventDefault();
                const startArgs = getEventArgs(start);
                const moveArgs = getEventArgs(move);

                return {
                  width: dragArgs.initialPos.width + moveArgs.points[0][0] - startArgs.points[0][0]
                };
              }),
              takeUntil(mouseup$)
            )
          )
        )
        .pipe(subscribeOn(animationFrameScheduler));
    };

    watch(collapsed_, (val) => {
      if (props.collapsed !== val) {
        emit('update:collapsed', val);
      }
      toggleCollapsed(val, props.transitional);
    });

    watch(
      () => props.collapsed,
      (val) => {
        if (collapsed_.value !== val) {
          collapsed_.value = val;
        }
      }
    );

    onMounted(() => {
      if (anchorRef.value) {
        drag$ = getDrag$(anchorRef.value).subscribe((pos) => {
          if (pos.width >= limit[0] && pos.width <= limit[1]) {
            currentWidth = pos.width;
            leftRef.value.style.width = `${pos.width}px`;
          }
        });
        // 初始化
        collapsed_.value = props.collapsed;
        if (props.appear) {
          toggleCollapsed(props.collapsed, props.transitional);
        } else {
          toggleCollapsed(props.collapsed, false);
        }
      }
    });

    onBeforeUnmount(() => {
      if (drag$) {
        drag$.unsubscribe();
        drag$ = null;
      }
    });

    return {
      leftRef,
      anchorRef,
      anchorIconRef,
      collapsed_,
      toggleCollapsed,
      onCollapsedClick
    };
  },
  render(ctx) {
    return (
      <div class={['grid-dragable-wrap', ctx.collapsed_ ? 'grid-dragable-collapsed' : '']}>
        <div class='grid-dragable-left' ref='leftRef'>
          <div class='grid-dragable-left-content'>{ctx.$slots?.left ? ctx.$slots?.left() : ''}</div>
          <div class='grid-dragable-septal'>
            <div class='grid-dragable-septal-line' />
            <div class='grid-dragable-septal-zine' ref='anchorRef'>
              <div class='grid-dragable-septal-ziner' />
            </div>
            <button class='grid-dragable-button-toggle' type='button' title={ctx.collapsed_ ? 'Unfold' : 'Collaps'} onClick={ctx.onCollapsedClick}>
              <IconArrowLeftSLine ref='anchorIconRef' scale='1.1' />
            </button>
          </div>
        </div>
        <div class='grid-dragable-right'>{ctx.$slots?.right ? ctx.$slots?.right() : ''}</div>
      </div>
    );
  }
});
