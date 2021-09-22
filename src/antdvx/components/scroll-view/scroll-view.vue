<template>
  <div
    :class="[
      $style['scroll-wrap'],
      fillX ? $style['fill-x'] : null,
      fillY ? $style['fill-y'] : null,
      scrollX ? $style['scroll-x'] : null,
      scrollY ? $style['scroll-y'] : null
    ]"
  >
    <transition-group
      :enter-from-class="$style['transition-enter-from']"
      :enter-to-class="$style['transition-enter-to']"
      :leave-to-class="$style['transition-leave-to']"
      :enter-active-class="$style['transition-enter-active']"
      :leave-active-class="$style['transition-enter-active']"
    >
      <div :class="$style.transition" key="loading" v-if="loading_">
        <slot name="loading">
          <div :class="$style.loading">
            <div class="tw-space-y-2">
              <div class="tw-text-center"><SpinnerLoading :size="loadingSize" /></div>
              <div v-if="loadingText" class="tw-mt-5">{{ loadingText }}</div>
            </div>
          </div>
        </slot>
      </div>

      <div :class="$style.transition" key="error" v-else-if="error">
        <slot name="error" v-bind="{ error, reload }">
          <div :class="$style.error">
            <AAlert type="error" show-icon>
              <template #message>{{ $t(i18nMessages.antd.asyncAction.error) }}</template>
              <template #description>
                {{ error }}
                <XButtonRefresh only-icon color="primary" size="small" type="link" :handler="reload" />
              </template>
            </AAlert>
          </div>
        </slot>
      </div>

      <div :class="[$style['scroll-view'], native ? null : $style['hide-scrollbar']]" key="content" v-else ref="viewRef" @scroll="onScroll">
        <template v-if="native">
          <slot v-bind="{ loading: loading_, reload: load }" />
        </template>
        <template v-else>
          <div :class="$style['scroll-content']" ref="contentRef" v-if="!loading_ && !error">
            <slot v-bind="{ loading: loading_, reload: load }" />
          </div>
          <div v-if="scrollX" :class="[$style.bar, $style.horizontal, autohide ? $style.hidden : null]" @click="horBarClick($event)">
            <div :class="$style.thumb" ref="horThumbRef" />
          </div>
          <div v-if="scrollY" :class="[$style.bar, $style.vertical, autohide ? $style.hidden : null]" @click="verBarClick($event)">
            <div :class="$style.thumb" ref="verThumbRef" />
          </div>
        </template>
      </div>
    </transition-group>
  </div>
</template>

<script lang="ts">
import { Alert } from 'ant-design-vue';
import { bindPromiseQueue, debounce } from '@fatesigner/utils';
import { Subscription, animationFrameScheduler, fromEvent, merge } from 'rxjs';
import { filter, map, subscribeOn, switchMap, takeUntil, tap } from 'rxjs/operators';
import { addClass, hasClass, removeClass, scrollTo as scrollTo_ } from '@fatesigner/utils/document';
import { PropType, defineComponent, nextTick, onActivated, onBeforeUnmount, onDeactivated, onMounted, onUnmounted, ref, useCssModule, watch } from 'vue';

import { i18nMessages } from '../../i18n/messages';
import { getBoundaryPosition, getEventArgs, getEventTarget, getTranslate3dStyle } from '../../utils';

import { SpinnerLoading } from '../loading';
import { XButtonRefresh } from '../button';
import { IScrollViewOptions } from './scroll-view';

//const elementResizeDetectorMaker = require('element-resize-detector');

export default defineComponent({
  components: {
    SpinnerLoading,
    XButtonRefresh,
    [Alert.name]: Alert
  },
  props: {
    native: {
      type: Boolean,
      default: false
    },
    autohide: {
      type: Boolean,
      default: false
    },
    // 如果 container 尺寸不会发生变化，最好设置为 false 以优化性能
    autoresize: {
      type: Boolean,
      default: true
    },
    fillX: {
      type: Boolean,
      default: false
    },
    fillY: {
      type: Boolean,
      default: false
    },
    scrollX: {
      type: Boolean,
      default: false
    },
    scrollY: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    loadingText: {
      type: String
    },
    loadingSize: {
      type: String as PropType<IScrollViewOptions['loadingSize']>
    },
    immediate: {
      type: Boolean,
      default: true
    },
    initialize: {
      type: Function as PropType<() => Promise<any>>
    }
  },
  emits: ['initialized', 'scroll'],
  setup(props: any, { emit }) {
    const $style = useCssModule();
    let resizeObs: ResizeObserver;

    const error = ref();
    const loading_ = ref(!!props.initialize);

    if (props.loading) {
      loading_.value = true;
    }

    watch(
      () => props.loading,
      (val) => {
        if (loading_.value !== val) {
          loading_.value = val;
        }
      }
    );

    // 最外层 element
    const viewRef = ref<HTMLElement>(null);
    // 内容 element
    const contentRef = ref<HTMLElement>(null);
    // 水平滚动条 element
    const horThumbRef = ref<HTMLElement>(null);
    // 垂直滚动条 element
    const verThumbRef = ref<HTMLElement>(null);

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
        if (horThumbRef.value) {
          horThumbRef.value.style.width = xBarWidth + '%';
          horThumbRef.value.style.height = xBarWidth ? '' : '0';
          if (xBarWidth) {
            addClass(viewRef.value, $style['scrollable-x']);
          } else {
            removeClass(viewRef.value, $style['scrollable-x']);
          }
          // 更新 limit
          scrollLimit.left.max = horThumbRef.value.parentElement.offsetWidth - horThumbRef.value.offsetWidth;
        }

        if (verThumbRef.value) {
          verThumbRef.value.style.width = yBarHeight ? '' : '0';
          verThumbRef.value.style.height = yBarHeight + '%';
          if (yBarHeight) {
            addClass(viewRef.value, $style['scrollable-y']);
          } else {
            removeClass(viewRef.value, $style['scrollable-y']);
          }
          // 更新 limit
          scrollLimit.top.max = verThumbRef.value.parentElement.offsetHeight - verThumbRef.value.offsetHeight;
        }
      });
    };

    const updateHorThumbStyle = (xMove: number) => {
      if (horThumbRef.value) {
        let transform = `translate3d(${xMove}px, 0, 0)`;
        horThumbRef.value.style.transform = transform;
        horThumbRef.value.style['msTransform'] = transform;
        horThumbRef.value.style['webkitTransform'] = transform;
      }
    };

    const updateVerThumbStyle = (yMove: number) => {
      if (verThumbRef.value) {
        let transform = `translate3d(0, ${yMove}px, 0)`;
        verThumbRef.value.style.transform = transform;
        verThumbRef.value.style['msTransform'] = transform;
        verThumbRef.value.style['webkitTransform'] = transform;
      }
    };

    const scrollTo = async (left: number, top: number, duration = 0) => {
      if (viewRef.value) {
        if (duration) {
          await scrollTo_(viewRef.value, left, top, duration ?? 0);
        } else {
          viewRef.value.scrollLeft = left;
          viewRef.value.scrollTop = top;
        }
      }
    };

    const updateHorScroll = (xMove: number, transition = false) => {
      if (viewRef.value) {
        let scrollLeft = (contentRef.value.offsetWidth / viewRef.value.clientWidth) * xMove;
        if (transition) {
          scrollTo_(viewRef.value, scrollLeft, null, transition ? scrollDuration : 0);
        } else {
          viewRef.value.scrollLeft = scrollLeft;
        }
      }
    };

    const updateVerScroll = (yMove: number, transition = false) => {
      if (viewRef.value) {
        let scrollTop = (contentRef.value.offsetHeight / viewRef.value.clientHeight) * yMove;
        if (transition) {
          scrollTo_(viewRef.value, null, scrollTop, transition ? scrollDuration : 0);
        } else {
          viewRef.value.scrollTop = scrollTop;
        }
      }
    };

    const resizeLayout = debounce(
      function () {
        if (!contentRef.value) {
          return;
        }

        let xBarWidth = 0;
        let yBarHeight = 0;

        if (contentRef.value.offsetWidth > viewRef.value.clientWidth) {
          xBarWidth = ((viewRef.value.clientWidth * 100) / contentRef.value.offsetWidth).toFixed(1) as any;
        }

        if (contentRef.value.offsetHeight > viewRef.value.clientHeight) {
          yBarHeight = ((viewRef.value.clientHeight * 100) / contentRef.value.offsetHeight).toFixed(1) as any;
        }

        updateThumbSize(xBarWidth, yBarHeight);
      },
      300,
      true
    );

    // 外部操作（滚轮、触控）触发滚动
    const onScroll = (e) => {
      emit('scroll', e);
      if (!contentRef.value || dragMoving) {
        return;
      }

      let xMove = (viewRef.value.scrollLeft * viewRef.value.clientWidth) / contentRef.value.offsetWidth;
      let yMove = (viewRef.value.scrollTop * viewRef.value.clientHeight) / contentRef.value.offsetHeight;

      updateHorThumbStyle(xMove);
      updateVerThumbStyle(yMove);
    };

    // 点击滚动条，滚动到指定位置
    const horBarClick = (e: any) => {
      const target: any = getEventTarget(e);
      const eventArgs = getEventArgs(e);
      if (hasClass(target, $style.bar)) {
        const rect = target.getBoundingClientRect();
        const rectThumb = horThumbRef.value.getBoundingClientRect();
        if (eventArgs.points[0][0] < rectThumb.left) {
          let _xMove = eventArgs.points[0][0] - rect.left;
          if (_xMove < scrollThreshold) {
            _xMove = 0;
          }
          updateHorScroll(_xMove, true);
        } else if (eventArgs.points[0][0] > rectThumb.left) {
          let _xMove = eventArgs.points[0][0] - rect.left - horThumbRef.value.offsetWidth;
          if (_xMove > target.offsetWidth - horThumbRef.value.offsetWidth - scrollThreshold) {
            _xMove = target.offsetWidth - horThumbRef.value.offsetWidth;
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
        const rectThumb = verThumbRef.value.getBoundingClientRect();
        if (eventArgs.points[0][1] < rectThumb.top) {
          let _yMove = eventArgs.points[0][1] - rect.top;
          if (_yMove < scrollThreshold) {
            _yMove = 0;
          }
          updateVerScroll(_yMove, true);
        } else if (eventArgs.points[0][1] > rectThumb.top) {
          let _yMove = eventArgs.points[0][1] - rect.top - verThumbRef.value.offsetHeight;
          if (_yMove > target.offsetHeight - verThumbRef.value.offsetHeight - scrollThreshold) {
            _yMove = target.offsetHeight - verThumbRef.value.offsetHeight;
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

    const initializeLayout = () => {
      if (props.native) {
        return;
      }

      resizeLayout();

      if (horDrag$) {
        horDrag$.unsubscribe();
      }

      if (verDrag$) {
        verDrag$.unsubscribe();
      }

      if (horThumbRef.value) {
        horDrag$ = getDrag$(horThumbRef.value, 'x').subscribe((pos) => {
          pos = getBoundaryPosition(pos, scrollLimit.left.min, scrollLimit.left.max);
          updateHorThumbStyle(pos);
          updateHorScroll(pos);
        });
      }

      if (verThumbRef.value) {
        verDrag$ = getDrag$(verThumbRef.value, 'y').subscribe((pos) => {
          pos = getBoundaryPosition(pos, scrollLimit.top.min, scrollLimit.top.max);
          updateVerThumbStyle(pos);
          updateVerScroll(pos);
        });
      }

      // 监听窗口尺寸变化，重新设置滑块尺寸
      if (props.autoresize) {
        if (contentRef.value) {
          if (!resizeObs) {
            resizeObs = new ResizeObserver(resizeLayout);
          }
          resizeObs.observe(viewRef.value);
          resizeObs.observe(contentRef.value);
        }
      }

      // 兼容过渡动画带来的高度影响
      setTimeout(() => {
        // 1s 后更新 layout
        resizeLayout();
      }, 1000);
    };

    const load = bindPromiseQueue(() => {
      return props
        ?.initialize()
        .then((res) => {
          error.value = null;
          emit('initialized', res);
        })
        .catch((err: Error) => {
          error.value = err.message;
        });
    }, true);

    const reload = async () => {
      loading_.value = true;
      await load();
      loading_.value = false;
      nextTick().then(() => {
        initializeLayout();
      });
    };

    onMounted(() => {
      if (props?.initialize) {
        if (props.immediate) {
          nextTick().then(() => {
            reload();
          });
        }
      } else {
        nextTick(() => {
          initializeLayout();
        });
      }
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
      // 还原之前记录的滚动条位置
      if (viewRef.value) {
        viewRef.value.scrollTop = scrollPos.top;
        viewRef.value.scrollLeft = scrollPos.left;
      }
    });

    onDeactivated(() => {
      // 记录滚动条位置
      if (viewRef.value) {
        scrollPos.top = viewRef.value.scrollTop;
        scrollPos.left = viewRef.value.scrollLeft;
      }
    });

    onUnmounted(() => {
      // 移除视窗区域尺寸的监听
      if (contentRef.value) {
        if (resizeObs) {
          resizeObs.unobserve(viewRef.value);
          resizeObs.unobserve(contentRef.value);
        }
      }
    });

    return {
      i18nMessages,
      viewRef,
      contentRef,
      horThumbRef,
      verThumbRef,
      error,
      loading_,
      load,
      reload,
      scrollTo,
      onScroll,
      horBarClick,
      verBarClick
    };
  }
});
</script>

<style lang="less" module>
.scroll-wrap {
  position: relative;
  overflow: hidden;
}

.transition {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;
  transform: translate3d(-50%, -50%, 0);

  &.transition-enter-from {
    opacity: 0;
    transform: translate3d(-50%, -50%, 0) scale(0.7);
  }

  &.transition-enter-to {
    opacity: 1;
    transform: translate3d(-50%, -50%, 0) scale(1);
  }

  &.transition-leave-to {
    opacity: 0;
    transform: translate3d(-50%, -50%, 0) scale(0.6);
  }

  &.transition-enter-active,
  &.transition-leave-active {
    transition-timing-function: ease-out;
    transition-duration: 0.2s;
    transition-property: opacity, transform;
  }
}

.scroll-view {
  width: 100%;
  height: 100%;
  overflow: hidden;

  &.transition-enter-from,
  &.transition-leave-to {
    opacity: 0;
  }

  &.transition-enter-to {
    opacity: 1;
  }

  &.transition-enter-active,
  &.transition-leave-active {
    transition-timing-function: ease-out;
    transition-duration: 0.2s;
    transition-property: opacity;
  }

  &.hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}

.scroll-content {
  min-width: 100%;
  min-height: 100%;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.error {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
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
  height: 12px;

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
  transition: background-color 0.2s linear, opacity 0.2s linear;

  &.hidden {
    opacity: 0;
  }
}

.scroll-view.scrollable-x {
  > .scroll-content {
    /* margin-bottom: 12px; */
  }

  > .bar.horizontal:active,
  > .bar.horizontal:hover {
    background-color: #f1f1f1;

    > .thumb {
      height: 12px;
      background-color: rgba(129, 129, 128, 0.2);
    }
  }
}

.scroll-view.scrollable-y {
  > .scroll-content {
    /* margin-right: 12px; */
  }

  > .bar.vertical:active,
  > .bar.vertical:hover {
    background-color: #f1f1f1;

    > .thumb {
      width: 12px;
      background-color: rgba(129, 129, 128, 0.2);
    }
  }
}

.wrap:hover > .bar {
  opacity: 1;
}

.scroll-x {
  > .scroll-view {
    overflow-x: auto;

    > .scroll-content {
      width: max-content;
    }
  }
}

.scroll-y {
  > .scroll-view {
    overflow-y: auto;
  }
}
</style>
