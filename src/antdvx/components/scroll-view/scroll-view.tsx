import { Alert } from 'ant-design-vue';
import { bindPromiseQueue, debounce } from '@fatesigner/utils';
import { Subscription, animationFrameScheduler, fromEvent, merge } from 'rxjs';
import { filter, map, subscribeOn, switchMap, takeUntil, tap } from 'rxjs/operators';
import { addClass, hasClass, removeClass, scrollTo as scrollTo_ } from '@fatesigner/utils/document';
import { PropType, TransitionGroup, defineComponent, nextTick, onActivated, onBeforeUnmount, onDeactivated, onMounted, onUnmounted, ref, watch } from 'vue';

import { ANTDVX_SIZES } from '../../constants';
import { i18nMessages } from '../../i18n/messages';
import { getBoundaryPosition, getEventArgs, getEventTarget, getTranslate3dStyle } from '../../utils';

import { XButtonRefresh } from '../button';
import { SpinnerLoading } from '../loading';

import styles from './scroll-view.module.less';

/**
 * 可滚动视图区域, 用于区域滚动
 */
export interface IScrollViewOptions {
  /**
   * 原生滚动模式, 默认为 false
   */
  native?: boolean;

  /**
   * 自动隐藏滚动条, 默认为 false
   */
  autohide?: boolean;

  /**
   * 页面内容发生变化后，自动调整容器尺寸（默认为 true), 如果内容不会发生变化, 最好设置为 false 以优化性能
   */
  autoresize?: boolean;

  /**
   * 自适应父容器宽度 width: 100%, 默认为 false
   */
  fillX?: boolean;

  /**
   * 自适应父容器高度 height: 100%, 默认为 false
   */
  fillY?: boolean;

  /**
   * 允许横向滚动, 默认为 false
   */
  scrollX?: boolean;

  /**
   * 允许纵向滚动, 默认为 false
   */
  scrollY?: boolean;

  /**
   * 显示 loading 层
   */
  loading?: boolean;

  /**
   * loading 文字
   */
  loadingText?: string;

  /**
   * loading 图标尺寸
   */
  loadingSize?: typeof ANTDVX_SIZES[number];

  /**
   * 是否立即执行初始化函数, 默认为 true
   */
  immediate: boolean;

  /**
   * 初始化函数, 若设置该值, 将会在 onMounted 事件中执行，该函数执行期间, 将会持续显示 loading 层
   */
  initialize?: () => Promise<any>;
}

/**
 * 可滚动视图区域, 用于区域滚动
 */
export const ScrollView = defineComponent({
  name: 'scroll-view',
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

    const scrollDuration = 100;
    const scrollThreshold = 20;

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
            addClass(viewRef.value, styles['scrollable-x']);
          } else {
            removeClass(viewRef.value, styles['scrollable-x']);
          }
          // 更新 limit
          scrollLimit.left.max = horThumbRef.value.parentElement.offsetWidth - horThumbRef.value.offsetWidth;
        }

        if (verThumbRef.value) {
          verThumbRef.value.style.width = yBarHeight ? '' : '0';
          verThumbRef.value.style.height = yBarHeight + '%';
          if (yBarHeight) {
            addClass(viewRef.value, styles['scrollable-y']);
          } else {
            removeClass(viewRef.value, styles['scrollable-y']);
          }
          // 更新 limit
          scrollLimit.top.max = verThumbRef.value.parentElement.offsetHeight - verThumbRef.value.offsetHeight;
        }
      });
    };

    const updateHorThumbStyle = (xMove: number) => {
      if (horThumbRef.value) {
        const transform = `translate3d(${xMove}px, 0, 0)`;
        horThumbRef.value.style.transform = transform;
        horThumbRef.value.style['msTransform'] = transform;
        horThumbRef.value.style['webkitTransform'] = transform;
      }
    };

    const updateVerThumbStyle = (yMove: number) => {
      if (verThumbRef.value) {
        const transform = `translate3d(0, ${yMove}px, 0)`;
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
        const scrollLeft = (contentRef.value.offsetWidth / viewRef.value.clientWidth) * xMove;
        if (transition) {
          scrollTo_(viewRef.value, scrollLeft, null, transition ? scrollDuration : 0);
        } else {
          viewRef.value.scrollLeft = scrollLeft;
        }
      }
    };

    const updateVerScroll = (yMove: number, transition = false) => {
      if (viewRef.value) {
        const scrollTop = (contentRef.value.offsetHeight / viewRef.value.clientHeight) * yMove;
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

      const xMove = (viewRef.value.scrollLeft * viewRef.value.clientWidth) / contentRef.value.offsetWidth;
      const yMove = (viewRef.value.scrollTop * viewRef.value.clientHeight) / contentRef.value.offsetHeight;

      updateHorThumbStyle(xMove);
      updateVerThumbStyle(yMove);
    };

    // 点击滚动条，滚动到指定位置
    const horBarClick = (e: any) => {
      const target: any = getEventTarget(e);
      const eventArgs = getEventArgs(e);
      if (hasClass(target, styles.bar)) {
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
      if (hasClass(target, styles.bar)) {
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
                  const style = getTranslate3dStyle($thumb);
                  dragArgs.initialPos.left = style[0];
                  dragMoving = true;
                }
              : () => {
                  const style = getTranslate3dStyle($thumb);
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
  },
  render(ctx) {
    const solts = [];
    if (ctx.loading_) {
      solts.push(
        <div class={styles.transition} key='loading'>
          {ctx.$slots?.loading ? (
            ctx.$slots?.loading()
          ) : (
            <div class={styles.loading}>
              <div class='tw-space-y-2'>
                <div class='tw-text-center'>
                  <SpinnerLoading size={ctx.loadingSize} />
                </div>
                {ctx.loadingText ? <div class='tw-mt-5'>{ctx.loadingText}</div> : ''}
              </div>
            </div>
          )}
        </div>
      );
    } else if (ctx.error) {
      solts.push(
        <div class={styles.transition} key='error'>
          {ctx.$slots?.error ? (
            ctx.$slots?.error({ error: ctx.error, reload: ctx.reload })
          ) : (
            <div class={styles.error}>
              <Alert
                type='error'
                show-icon
                v-slots={{
                  message: () => ctx.$t(i18nMessages.antd.asyncAction.error),
                  description: () => [ctx.error, <XButtonRefresh only-icon color='primary' size='small' type='link' handler={ctx.reload} />]
                }}
              />
            </div>
          )}
        </div>
      );
    } else {
      solts.push(
        <div class={[styles['scroll-view'], ctx.native ? null : styles['hide-scrollbar']]} key='content' ref='viewRef' onScroll={ctx.onScroll}>
          {ctx.native
            ? ctx.$slots?.default({ loading: ctx.loading_, reload: ctx.load })
            : [
                !ctx.loading_ && !ctx.error ? (
                  <div class={styles['scroll-content']} ref='contentRef'>
                    {ctx.$slots?.default({ loading: ctx.loading_, reload: ctx.load })}
                  </div>
                ) : (
                  ''
                ),
                ctx.scrollX ? (
                  <div class={[styles.bar, styles.horizontal, ctx.autohide ? styles.hidden : null]} onClick={ctx.horBarClick}>
                    <div class={styles.thumb} ref='horThumbRef' />
                  </div>
                ) : (
                  ''
                ),
                ctx.scrollY ? (
                  <div class={[styles.bar, styles.vertical, ctx.autohide ? styles.hidden : null]} onClick={ctx.verBarClick}>
                    <div class={styles.thumb} ref='verThumbRef' />
                  </div>
                ) : (
                  ''
                )
              ]}
        </div>
      );
    }

    return (
      <div
        class={[
          styles['scroll-wrap'],
          ctx.fillX ? styles['fill-x'] : null,
          ctx.fillY ? styles['fill-y'] : null,
          ctx.scrollX ? styles['scroll-x'] : null,
          ctx.scrollY ? styles['scroll-y'] : null
        ]}
      >
        <TransitionGroup
          enterFromClass={styles['transition-enter-from']}
          enterToClass={styles['transition-enter-to']}
          leaveToClass={styles['transition-leave-to']}
          enterActiveClass={styles['transition-enter-active']}
          leaveActiveClass={styles['transition-enter-active']}
        >
          {solts}
        </TransitionGroup>
      </div>
    );
  }
});
