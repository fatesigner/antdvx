<template>
  <div :class="[$style.wrap, fill ? $style['fill-' + fill] : '', scroll ? $style['scroll-' + scroll] : '']">
    <div :class="$style.view" ref="viewEl" @scroll="onScroll">
      <div :class="$style.content" ref="contentEl">
        <slot />
      </div>
    </div>
    <div v-if="scroll === 'x' || scroll === 'xy'" :class="[$style.bar, $style.horizontal, autohide ? $style.hidden : null]" @click="horBarClick($event)">
      <div :class="$style.thumb" ref="horThumbEl" />
    </div>
    <div v-if="scroll === 'y' || scroll === 'xy'" :class="[$style.bar, $style.vertical, autohide ? $style.hidden : null]" @click="verBarClick($event)">
      <div :class="$style.thumb" ref="verThumbEl" />
    </div>
  </div>
</template>

<script lang="ts">
import { addClass, hasClass, removeClass } from '@fatesigner/utils/document';
import { Subscription, animationFrameScheduler, fromEvent, merge } from 'rxjs';
import { filter, map, subscribeOn, switchMap, takeUntil, tap } from 'rxjs/operators';
import { defineComponent, nextTick, onActivated, onBeforeUnmount, onDeactivated, onMounted, onUnmounted, ref, useCssModule } from 'vue';

import { getBoundaryPosition, getEventArgs, getEventTarget, getTranslate3dStyle, scrollTo as scrollTo_ } from '../../utils';

const elementResizeDetectorMaker = require('element-resize-detector');

const erd = elementResizeDetectorMaker({
  strategy: 'scroll'
});

export default defineComponent({
  props: {
    native: {
      type: Boolean,
      default: false
    },
    autohide: {
      type: Boolean,
      default: false
    },
    fill: {
      type: String as () => 'x' | 'y' | 'xy',
      default: 'y'
    },
    scroll: {
      type: String as () => 'x' | 'y' | 'xy',
      default: 'y'
    },
    wrapStyle: {},
    wrapClass: {},
    viewClass: {},
    viewStyle: {},
    // 如果 container 尺寸不会发生变化，最好设置为 false 以优化性能
    autoresize: {
      type: Boolean,
      default: true
    },
    tag: {
      type: String,
      default: 'div'
    }
  },
  setup(props, { emit }) {
    const $style = useCssModule();

    // 最外层 element
    const $view = ref<HTMLElement>(null);
    // 内容 element
    const $content = ref<HTMLElement>(null);
    // 水平滚动条 element
    const $horThumb = ref<HTMLElement>(null);
    // 垂直滚动条 element
    const $verThumb = ref<HTMLElement>(null);

    let horDrag$: Subscription;
    let verDrag$: Subscription;

    let dragMoving = false;

    let scrollDuration = 100;
    let scrollThreshold = 20;

    // 当前滚动条的位置
    const scrollPos = {
      top: 0,
      left: 0
    };

    // 限制滚动边界、范围, 数值相对于父容器
    const scrollLimit = {
      left: {
        min: 0,
        max: 0
      },
      top: {
        min: 0,
        max: 0
      }
    };

    const updateThumbSize = (xBarWidth: number, yBarHeight: number) => {
      return requestAnimationFrame(() => {
        if ($horThumb.value) {
          $horThumb.value.style.width = xBarWidth + '%';
          $horThumb.value.style.height = xBarWidth ? '' : '0';
          if (xBarWidth) {
            addClass($horThumb.value.parentElement, $style.scrollable);
          } else {
            removeClass($horThumb.value.parentElement, $style.scrollable);
          }
          // 更新 limit
          scrollLimit.left.max = $horThumb.value.parentElement.offsetWidth - $horThumb.value.offsetWidth;
        }

        if ($verThumb.value) {
          $verThumb.value.style.width = yBarHeight ? '' : '0';
          $verThumb.value.style.height = yBarHeight + '%';
          if (yBarHeight) {
            addClass($verThumb.value.parentElement, $style.scrollable);
          } else {
            removeClass($verThumb.value.parentElement, $style.scrollable);
          }
          // 更新 limit
          scrollLimit.top.max = $verThumb.value.parentElement.offsetHeight - $verThumb.value.offsetHeight;
        }
      });
    };

    const updateHorThumbStyle = (xMove: number) => {
      if ($horThumb.value) {
        let transform = `translate3d(${xMove}px, 0, 0)`;
        $horThumb.value.style.transform = transform;
        $horThumb.value.style['msTransform'] = transform;
        $horThumb.value.style['webkitTransform'] = transform;
      }
    };

    const updateVerThumbStyle = (yMove: number) => {
      if ($verThumb.value) {
        let transform = `translate3d(0, ${yMove}px, 0)`;
        $verThumb.value.style.transform = transform;
        $verThumb.value.style['msTransform'] = transform;
        $verThumb.value.style['webkitTransform'] = transform;
      }
    };

    const scrollTo = async (left: number, top: number, duration = 0) => {
      if ($view.value) {
        if (duration) {
          await scrollTo_($view.value, left, top, duration ?? 0);
        } else {
          $view.value.scrollLeft = left;
          $view.value.scrollTop = top;
        }
      }
    };

    const updateHorScroll = (xMove: number, transition = false) => {
      if ($view.value) {
        let scrollLeft = ($content.value.offsetWidth / $view.value.clientWidth) * xMove;
        if (transition) {
          scrollTo_($view.value, scrollLeft, null, transition ? scrollDuration : 0);
        } else {
          $view.value.scrollLeft = scrollLeft;
        }
      }
    };

    const updateVerScroll = (yMove: number, transition = false) => {
      if ($view.value) {
        let scrollTop = ($content.value.offsetHeight / $view.value.clientHeight) * yMove;
        if (transition) {
          scrollTo_($view.value, null, scrollTop, transition ? scrollDuration : 0);
        } else {
          $view.value.scrollTop = scrollTop;
        }
      }
    };

    const resizeLayout = () => {
      if (!$content.value) {
        return;
      }

      let xBarWidth = 0;
      let yBarHeight = 0;

      if ($content.value.offsetWidth > $view.value.clientWidth) {
        xBarWidth = (($view.value.clientWidth * 100) / $content.value.offsetWidth).toFixed(1) as any;
      }

      if ($content.value.offsetHeight > $view.value.clientHeight) {
        yBarHeight = (($view.value.clientHeight * 100) / $content.value.offsetHeight).toFixed(1) as any;
      }

      updateThumbSize(xBarWidth, yBarHeight);
    };

    // 外部操作（滚轮、触控）触发滚动
    const onScroll = (e) => {
      emit('scroll', e);
      if (!$content.value || dragMoving) {
        return;
      }

      let xMove = ($view.value.scrollLeft * $view.value.clientWidth) / $content.value.offsetWidth;
      let yMove = ($view.value.scrollTop * $view.value.clientHeight) / $content.value.offsetHeight;

      updateHorThumbStyle(xMove);
      updateVerThumbStyle(yMove);
    };

    // 点击滚动条，滚动到指定位置
    const horBarClick = (e: any) => {
      const target: any = getEventTarget(e);
      const eventArgs = getEventArgs(e);
      if (hasClass(target, $style.bar)) {
        const rect = target.getBoundingClientRect();
        const rectThumb = $horThumb.value.getBoundingClientRect();
        if (eventArgs.points[0][0] < rectThumb.left) {
          let _xMove = eventArgs.points[0][0] - rect.left;
          if (_xMove < scrollThreshold) {
            _xMove = 0;
          }
          updateHorScroll(_xMove, true);
        } else if (eventArgs.points[0][0] > rectThumb.left) {
          let _xMove = eventArgs.points[0][0] - rect.left - $horThumb.value.offsetWidth;
          if (_xMove > target.offsetWidth - $horThumb.value.offsetWidth - scrollThreshold) {
            _xMove = target.offsetWidth - $horThumb.value.offsetWidth;
          }
          updateHorScroll(_xMove, true);
        }
      }
    };

    const verBarClick = (e: any) => {
      const target: any = getEventTarget(e);
      const eventArgs = getEventArgs(e);
      if (hasClass(target, $style.bar)) {
        const rect = target.getBoundingClientRect();
        const rectThumb = $verThumb.value.getBoundingClientRect();
        if (eventArgs.points[0][1] < rectThumb.top) {
          let _yMove = eventArgs.points[0][1] - rect.top;
          if (_yMove < scrollThreshold) {
            _yMove = 0;
          }
          updateVerScroll(_yMove, true);
        } else if (eventArgs.points[0][1] > rectThumb.top) {
          let _yMove = eventArgs.points[0][1] - rect.top - $verThumb.value.offsetHeight;
          if (_yMove > target.offsetHeight - $verThumb.value.offsetHeight - scrollThreshold) {
            _yMove = target.offsetHeight - $verThumb.value.offsetHeight;
          }
          updateVerScroll(_yMove, true);
        }
      }
    };

    const getDrag$ = ($thumb: HTMLElement, direction: 'x' | 'y') => {
      const dragArgs = {
        initialPos: {
          top: 0,
          left: 0
        }
      };

      const mousedown$ = merge(
        fromEvent($thumb, 'mousedown', { capture: false, passive: false }),
        fromEvent($thumb, 'touchstart', { capture: false, passive: false })
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
          filter(() => !dragMoving),
          tap(
            direction === 'x'
              ? () => {
                  let style = getTranslate3dStyle($thumb);
                  dragArgs.initialPos.left = style[0];
                  dragMoving = true;
                }
              : () => {
                  let style = getTranslate3dStyle($thumb);
                  dragArgs.initialPos.top = style[1];
                  dragMoving = true;
                }
          ),
          switchMap((start: any) => {
            const startArgs = getEventArgs(start);
            return mousemove$.pipe(
              map(
                direction === 'x'
                  ? (move: any) => {
                      move.preventDefault();
                      const moveArgs = getEventArgs(move);
                      return dragArgs.initialPos.left + moveArgs.points[0][0] - startArgs.points[0][0];
                    }
                  : (move: any) => {
                      move.preventDefault();
                      const moveArgs = getEventArgs(move);
                      return dragArgs.initialPos.top + moveArgs.points[0][1] - startArgs.points[0][1];
                    }
              ),
              takeUntil(
                mouseup$.pipe(
                  tap(() => {
                    dragMoving = false;
                  })
                )
              )
            );
          })
        )
        .pipe(subscribeOn(animationFrameScheduler));
    };

    onMounted(() => {
      nextTick(() => {
        if (!props.native) {
          resizeLayout();

          if ($horThumb.value) {
            horDrag$ = getDrag$($horThumb.value, 'x').subscribe((pos) => {
              pos = getBoundaryPosition(pos, scrollLimit.left.min, scrollLimit.left.max);
              updateHorThumbStyle(pos);
              updateHorScroll(pos);
            });
          }

          if ($verThumb.value) {
            verDrag$ = getDrag$($verThumb.value, 'y').subscribe((pos) => {
              pos = getBoundaryPosition(pos, scrollLimit.top.min, scrollLimit.top.max);
              updateVerThumbStyle(pos);
              updateVerScroll(pos);
            });
          }

          // 监听窗口尺寸变化，重新设置滑块尺寸
          if (props.autoresize) {
            if ($content.value) {
              erd.listenTo($content.value, resizeLayout);
            }
          }
        }
      });
    });

    onBeforeUnmount(() => {
      if (horDrag$) {
        horDrag$.unsubscribe();
      }
      if (verDrag$) {
        verDrag$.unsubscribe();
      }
    });

    onActivated(() => {
      // 还原上次的滚动条位置
      if ($content.value) {
        $content.value.scrollTop = scrollPos.top;
        $content.value.scrollLeft = scrollPos.left;
      }
    });

    onDeactivated(() => {
      // 记录滚动条位置
      if ($content.value) {
        scrollPos.top = $content.value.scrollTop;
        scrollPos.left = $content.value.scrollLeft;
      }
    });

    onUnmounted(() => {
      // 移除窗口尺寸的监听
      if ($content.value) {
        erd.removeListener($content.value, resizeLayout);
      }
    });

    return {
      viewEl: $view,
      contentEl: $content,
      horThumbEl: $horThumb,
      verThumbEl: $verThumb,
      scrollTo,
      onScroll,
      horBarClick,
      verBarClick
    };
  }
});
</script>

<style lang="scss" module>
.wrap {
  position: relative;
  overflow: hidden;
}

.view {
  width: 100%;
  height: 100%;
  overflow: hidden;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.content {
  width: auto;
  min-width: 100%;
  min-height: 100%;
}

.fill-x {
  width: 100%;
}

.fill-y {
  height: 100%;
}

.fill-xy {
  width: 100%;
  height: 100%;
}

.thumb {
  cursor: pointer;
  cursor: grab;
  background-color: rgba(129, 129, 128, 0.1);
  border-radius: 6px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
  transition: opacity 0.2s ease-out, background-color 0.3s;
}

.horizontal {
  right: 0;
  bottom: 0;
  left: 0;
  height: 15px;

  > .thumb {
    position: absolute;
    bottom: 0;
    width: 0;
    height: 5px;
    transition: background-color 0.2s linear, height 0.2s ease-in-out;
  }
}

.vertical {
  top: 0;
  right: 0;
  bottom: 0;
  width: 12px;

  > .thumb {
    position: absolute;
    right: 0;
    width: 5px;
    height: 0;
    transition: background-color 0.2s linear, width 0.2s ease-in-out;
  }
}

.bar {
  position: absolute;
  z-index: 1;
  border-radius: 3px;
  transition: background-color 0.2s linear, opacity 0.2s linear;
}

.bar.scrollable {
  &:active,
  &:hover {
    background-color: #f1f1f1;

    .thumb {
      background-color: rgba(129, 129, 128, 0.2);
    }

    &.horizontal > .thumb {
      height: 12px;
    }

    &.vertical > .thumb {
      width: 12px;
    }
  }
}

.bar.hidden {
  opacity: 0;
}

.wrap:hover > .bar {
  opacity: 1;
}

.scroll-x {
  > .view {
    overflow-x: auto;
    overflow-y: hidden;
  }
}

.scroll-y {
  > .view {
    overflow-x: hidden;
    overflow-y: auto;
  }
}

.scroll-xy {
  > .view {
    overflow-x: auto;
    overflow-y: auto;
  }

  .horizontal {
    right: 5px;
  }

  .vertical {
    bottom: 5px;
  }
}
</style>
