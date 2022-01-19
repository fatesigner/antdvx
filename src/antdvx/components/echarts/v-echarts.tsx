/**
 * Vue Echarts
 */

import to from 'await-to-js';
import { debounce } from '@fatesigner/utils';
import { Empty, Spin } from 'ant-design-vue';
import { isFunction } from '@fatesigner/utils/type-check';
import { PropType, TransitionGroup, VNode, computed, defineComponent, onActivated, onDeactivated, onMounted, onUnmounted, ref, watch } from 'vue';

import { IXButtonExportOptions, XButtonExport, XButtonRefresh } from '../button';

import { EChartsOption, EChartsOptionPromise, EChartsType, LocaleOption, RendererType, createEcharts } from './echarts';

import styles from './v-echarts.module.less';

interface EChartsConfig {
  theme?: string;
  locale?: string | LocaleOption;
  devicePixelRatio?: number;
  renderer?: RendererType;
  useDirtyRect?: boolean;
}

/**
 * Vue Echarts 组件选项
 */
export interface VEchartsOptions {
  /**
   * 标题、标题栏
   */
  title?: string | VNode;
  /**
   * 可刷新
   */
  refreshable?: boolean;
  /**
   * 导出功能
   */
  exportable?: boolean;
  /**
   * 导出的文件名
   */
  filename?: string;
  /**
   * 指定容器高宽比例
   */
  aspectRatio?: number | string;
  /**
   * 指定容器宽度
   */
  width?: number | string;
  /**
   * 指定容器高度
   */
  height?: number | string;
  /**
   * 自适应外部容器高宽变化
   */
  autoresize?: boolean;
  /**
   * 显示空数据的提示
   */
  empty?: boolean;

  /**
   * 图表配置
   */
  options?: EChartsOption | EChartsOptionPromise;

  /**
   * Echarts 配置
   */
  echartsConfig?: EChartsConfig;
}

// Default config
const defaultConfig: VEchartsOptions & {
  /**
   * 设置 header(标题栏)，用于所有 v-echarts 实例
   */
  header?: (
    chartRef: { initialized: boolean; error: boolean; empty: boolean; loading: boolean; refresh: () => Promise<any> } & Record<any, any>
  ) => VNode | VNode[];
} = {
  aspectRatio: 2,
  autoresize: true
};

/**
 * 创建 Vue Echarts 默认配置
 * @param options
 */
export function configureVEcharts(options: typeof defaultConfig) {
  Object.assign(defaultConfig, options);
}

/**
 * Vue Echarts 组件
 */
export const VEcharts = defineComponent({
  name: 'v-echarts',
  props: {
    title: {
      type: [Object, String]
    },
    refreshable: {
      type: Boolean,
      default: true
    },
    // 可导出的
    exportable: {
      type: Boolean,
      default: true
    },
    filename: {
      type: String
    },
    /* requires: {
      type: Array as PropType<EchartsSeriesType>,
      default: () => []
    }, */
    aspectRatio: {
      type: [Number, String]
    },
    width: {
      type: [Number, String] as PropType<number | 'auto'>
    },
    height: {
      type: [Number, String] as PropType<number | 'auto'>
    },
    autoresize: {
      type: Boolean,
      default: true
    },
    empty: {
      type: Boolean,
      default: false
    },
    instance: {
      type: Object as PropType<EChartsType>
    },
    options: {
      type: [Object, Function] as PropType<EChartsOption | EChartsOptionPromise>
    },
    echartsConfig: {
      type: Object as PropType<EChartsConfig>
    }
  },
  emits: ['touchstart', 'initialized', 'update:instance'],
  setup(props: any, { emit }) {
    const options_ = ref<EChartsOption>();
    const wrapRef = ref();
    const chartRef = ref();
    const loading = ref(false);
    const initialized = ref(false);
    const error = ref<Error>();

    let instance;

    const wrapStyles = computed(() => {
      if (props.aspectRatio) {
        return {
          width: '100%',
          'padding-bottom': 100 / (props.aspectRatio as any) + '%'
        };
      } else {
        return {
          width: props.width ? props.width + 'px' : null,
          height: props.height ? props.height + 'px' : null
        };
      }
    });

    // 用于导出的选项
    const exportOptions: IXButtonExportOptions = {
      async image() {
        return {
          filename: props.filename,
          target: chartRef.value
        };
      }
    };

    const touchstart = (e) => {
      emit('touchstart', e);
    };

    const resize = debounce(
      () => {
        if (instance) {
          if (props.aspectRatio) {
            instance.resize();
          } else {
            instance.resize({ width: props.width, height: props.height });
          }
        }
      },
      300,
      false
    );

    const resizeSubsciber = (function () {
      let resizeObs: ResizeObserver;
      let listened = false;
      return {
        start() {
          // 监听窗口尺寸变化，重新渲染图表
          if (!listened && props.autoresize && wrapRef.value) {
            listened = true;
            if (!resizeObs) {
              resizeObs = new ResizeObserver(resize);
            }
            resizeObs.observe(wrapRef.value);
          }
        },
        stop() {
          // 移除窗口尺寸的监听
          if (listened && wrapRef.value) {
            if (resizeObs) {
              resizeObs.unobserve(wrapRef.value);
            }
            listened = false;
          }
        }
      };
    })();

    const initialize = async () => {
      loading.value = true;

      instance = await createEcharts(
        chartRef.value,
        [],
        props?.echartsConfig?.theme,
        Object.assign(
          {
            width: props.width,
            height: props.height
          },
          props.echartsConfig
        )
      );

      await setOption();

      loading.value = false;
      initialized.value = true;

      // 往外传递实例对象
      emit('update:instance', instance);
      emit('initialized', instance);
    };

    const setOption = async () => {
      loading.value = true;

      // 若提供的 options 参数为函数，异步获取 options
      if (isFunction(props.options)) {
        const [err, r] = await to((props.options as EChartsOptionPromise)());
        if (err) {
          error.value = err;
        } else {
          // await analyseImport(r);
          options_.value = r;
          error.value = null;
        }
      } else {
        options_.value = props.options as any;
      }
      if (options_.value) {
        instance.clear();
        instance.setOption(options_.value);
      }

      loading.value = false;
    };

    watch(
      () => props.options,
      async () => {
        if (instance) {
          await setOption();
          resize();
        }
      }
    );

    onMounted(() => {
      initialize().then(() => {
        resizeSubsciber.start();
      });
    });

    onActivated(() => {
      resizeSubsciber.start();
      if (chartRef.value && chartRef.value.style.position === 'relative') {
        // Reload chart
        chartRef.value.style.position = '';
        initialize();
      }
    });

    onDeactivated(() => {
      resizeSubsciber.stop();
    });

    onUnmounted(() => {
      resizeSubsciber.stop();
    });

    const getChartElement = () => {
      return chartRef.value;
    };

    return {
      wrapRef,
      chartRef,
      wrapStyles,
      exportOptions,
      options_,
      loading,
      initialized,
      error,
      resize,
      refresh: setOption,
      getChartElement,
      touchstart
    };
  },
  render(ctx) {
    const solts = [];
    if (ctx.loading) {
      solts.push(
        <div class={styles.transition} key='loading'>
          {ctx.$slots?.loading ? ctx.$slots?.loading({ refresh: ctx.refresh }) : <Spin size='large' />}
        </div>
      );
    } else if (ctx.error) {
      solts.push(
        <div class={styles.transition} key='error'>
          {ctx.$slots?.error ? (
            ctx.$slots?.error({ error: ctx.error, refresh: ctx.refresh })
          ) : (
            <div class={styles.error}>
              <span>{ctx.error}</span>
              <XButtonRefresh handler={ctx.refresh} only-icon color='primary' size='small' type='link' />
            </div>
          )}
        </div>
      );
    } else if (ctx.empty) {
      solts.push(
        <div class={styles.transition} key='empty'>
          {ctx.$slots?.empty ? ctx.$slots?.empty({ refresh: ctx.refresh }) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        </div>
      );
    }

    return (
      <div>
        {ctx.$slots?.header ? (
          ctx.$slots.header({ initialized: ctx.initialized, error: ctx.error, empty: ctx.empty, loading: ctx.loading, refresh: ctx.refresh })
        ) : defaultConfig?.header ? (
          defaultConfig.header(ctx)
        ) : ctx.title || ctx.refreshable || ctx.exportable ? (
          <div class='tw-flex tw-items-center tw-justify-end tw-mb-2'>
            <div class='tw-flex-1'>
              {ctx.$slots?.title ? ctx.$slots.title() : ctx.title?.el ? ctx.title : <div class='tw-pl-2 tw-pr-2 tw-text-base'>{ctx.title}</div>}
            </div>
            {ctx.error ? (
              ''
            ) : (
              <div class='tw-flex-initial tw-space-x-2'>
                {ctx.refreshable ? <XButtonRefresh disabled={ctx.loading} color='primary' size='small' type='link' handler={ctx.refresh} /> : ''}
                {ctx.exportable ? <XButtonExport disabled={ctx.loading} size='small' placement='bottomRight' options={ctx.exportOptions} /> : ''}
              </div>
            )}
          </div>
        ) : (
          ''
        )}
        <div ref='wrapRef' class={styles.wrap} style={ctx.wrapStyles}>
          <TransitionGroup
            enterFromClass={styles['transition-enter-from']}
            enterToClass={styles['transition-enter-to']}
            leaveToClass={styles['transition-leave-to']}
            enterActiveClass={styles['transition-enter-active']}
            leaveActiveClass={styles['transition-enter-active']}
          >
            {solts}
          </TransitionGroup>
          <div ref='chartRef' class={[styles.container, ctx.empty || !ctx.options_ ? styles.empty : '']} onTouchstart={ctx.touchstart} />
        </div>
      </div>
    );
  }
});
