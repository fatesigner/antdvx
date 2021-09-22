<template>
  <div :class="[$style['grid-wrap'], collapsed ? $style.collapsed : '']">
    <div :class="$style['grid-left']" ref="leftRef">
      <div :class="$style['grid-left-content']">
        <slot name="left" />
      </div>
      <div :class="$style.septal">
        <div :class="$style['septal-line']" />
        <div ref="anchorRef" :class="$style['septal-zine']">
          <div :class="$style['septal-ziner']" />
        </div>
        <button :class="$style['button-toggle']" type="button" :title="collapsed ? 'Unfold' : 'Collaps'" @click="toggleCollapsed()">
          <IconArrowRightSLine v-if="collapsed" scale="1.1" />
          <IconArrowLeftSLine v-else scale="1.1" />
        </button>
      </div>
    </div>
    <div :class="$style['grid-right']">
      <slot name="right" />
    </div>
  </div>
</template>

<script lang="ts">
import { gsap } from 'gsap';
import { isBoolean } from '@fatesigner/utils/type-check';
import { animationFrameScheduler, fromEvent, merge } from 'rxjs';
import { filter, map, subscribeOn, switchMap, takeUntil, tap } from 'rxjs/operators';
import { PropType, defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';

import { getEventArgs } from '../../utils';

import { IconArrowLeftSLine, IconArrowRightSLine } from '../iconfont';

export default defineComponent({
  name: 'grid-dragable',
  components: {
    IconArrowLeftSLine,
    IconArrowRightSLine
  },
  props: {
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
  setup(props) {
    const leftRef = ref();
    const anchorRef = ref();
    const collapsed = ref(false);

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

    // 切换左侧栏展开状态
    const toggleCollapsed = (val?: boolean) => {
      val = isBoolean(val) ? val : !collapsed.value;
      if (!val) {
        collapsed.value = val;
      }
      gsap.to(leftRef.value, {
        duration: 0.3,
        ease: 'power4',
        width: val ? collapsedWidth : currentWidth,
        onComplete() {
          collapsed.value = val;
        }
      });
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
          filter(() => !collapsed.value),
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

    onMounted(() => {
      drag$ = getDrag$(anchorRef.value).subscribe((pos) => {
        if (pos.width >= limit[0] && pos.width <= limit[1]) {
          currentWidth = pos.width;
          leftRef.value.style.width = `${pos.width}px`;
        }
      });
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
      collapsed,
      toggleCollapsed
    };
  }
});
</script>

<style lang="less" module>
.grid-left {
  position: relative;
  width: 280px;
  height: 100%;
  background-color: #eee;
}

.grid-left-content {
  width: 100%;
  height: 100%;
}

.grid-right {
  flex: 1;
  overflow: hidden;
}

.button-toggle {
  position: absolute;
  top: 22px;
  width: 24px;
  height: 24px;
  padding: 0;
  color: rgb(107, 119, 140);
  cursor: pointer;
  background: 0 center white;
  border: 0;
  border-radius: 50%;
  outline: 0;
  box-shadow: rgba(9, 30, 66, 0.08) 0 0 0 1px, rgba(9, 30, 66, 0.08) 0 2px 4px 1px;
  opacity: 1;
  transition: background-color 100ms linear 0s, color 100ms linear 0s, opacity 300ms cubic-bezier(0.2, 0, 0, 1) 0s,
    transform 300ms cubic-bezier(0.2, 0, 0, 1) 0s;
  transform: translate(-50%);

  &:hover {
    color: #fff;
    background-color: rgb(76, 154, 255);
  }
}

.septal {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 100%;
  z-index: 3;
  width: 24px;
  transform: translateZ(0);
}

.septal-ziner {
  position: absolute;
  left: 3px;
  width: 2px;
  height: 100%;
  background-color: orange;
  opacity: 0;
  transition: opacity 200ms ease 0s;
}

.septal-zine {
  position: relative;
  left: -4px;
  height: 100%;
}

.septal-line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: -3px;
  width: 3px;
  pointer-events: none;
  cursor: ew-resize;
  content: '';
  background: linear-gradient(to left, rgba(0, 0, 0, 0.2) 0, rgba(0, 0, 0, 0.2) 1px, rgba(0, 0, 0, 0.1) 0, transparent);
  opacity: 0.5;
  transition-timing-function: cubic-bezier(0.2, 0, 0, 1);
  transition-duration: 0.22s;
  transition-property: left, opacity, width;
}

.grid-wrap {
  display: flex;
  height: 100%;

  &:not(.collapsed) {
    .septal-zine {
      cursor: ew-resize;

      &:hover {
        .septal-ziner {
          opacity: 1;
        }
      }
    }
  }

  &.collapsed {
    .grid-left-content {
      opacity: 0;
    }
  }
}
</style>
