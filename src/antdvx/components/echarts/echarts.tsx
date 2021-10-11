/**
 * echarts
 */

import to from 'await-to-js';
import { merge } from 'lodash-es';
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';
import { debounce } from '@fatesigner/utils';
import { isFunction } from '@fatesigner/utils/type-check';
import { PropType, TransitionGroup, computed, defineComponent, onActivated, onDeactivated, onMounted, onUnmounted, ref, watch } from 'vue';

import styles from './echarts.module.less';

export { echarts };

export type EChartsOption = any;
export type RendererType = any;
export type LocaleOption = any;
export type SeriesOption = any;
export type ThemeOption = any;
export type EchartsSeriesType = any;
export type EChartsType = any;

export type EChartsOptionPromise = (...args: any) => Promise<EChartsOption>;

// Default config
const defaultConfig: {
  options: EChartsOption;
  theme?: string | ThemeOption;
  opts?: {
    locale?: string | LocaleOption;
    renderer?: RendererType;
    devicePixelRatio?: number;
    useDirtyRect?: boolean;
    width?: number;
    height?: number;
  };
} = {
  options: {
    color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
    grid: {
      right: '0',
      bottom: '10',
      left: '0',
      containLabel: true
    }
  },
  theme: null,
  opts: {
    renderer: 'canvas',
    useDirtyRect: true
  }
};

/**
 * 创建 echarts 默认配置
 * @param options
 * @param theme
 * @param opts
 */
export function echartsConfigure<Opt extends EChartsOption>(
  options: Opt,
  theme?: string | ThemeOption,
  opts?: {
    locale?: string | LocaleOption;
    renderer?: RendererType;
    devicePixelRatio?: number;
    useDirtyRect?: boolean;
    width?: number;
    height?: number;
  }
) {
  Object.assign(defaultConfig, {
    theme,
    opts
  });
}

/**
 * 获取 echarts 配置
 * @param options
 * @param config
 */
export function getEchartsOptions(
  options: EChartsOption,
  config?: {
    // 是否显示缩放滚动条
    dataZoom?: boolean;
  }
) {
  const args = [{}, defaultConfig.options];

  if (config?.dataZoom) {
    args.push({
      dataZoom: [
        {
          type: 'slider',
          show: true,
          xAxisIndex: [0],
          startValue: 0,
          endValue: 10,
          zoomLock: true
        },
        {
          type: 'inside',
          xAxisIndex: [0],
          startValue: 0,
          endValue: 10,
          zoomLock: true,
          zoomOnMouseWheel: false,
          moveOnMouseMove: false
        },
        /* {
        type: 'slider',
        show: true,
        yAxisIndex: [0],
        start: 0,
        zoomLock: true,
        left: '96%'
      }, */
        {
          type: 'inside',
          yAxisIndex: [0],
          start: 0,
          zoomLock: true
        }
      ]
    });
  }

  args.push(options);

  return merge.apply(this, args);
}

/**
 * 创建 echarts 实例
 * @param dom
 * @param requires 当前实例所使用到的类型集合，用于模块的按需加载
 * @param theme
 * @param opts
 */
export async function createEcharts<Opt extends EChartsOption>(
  dom: HTMLElement,
  requires: EchartsSeriesType,
  theme?: string | Record<string, any>,
  opts?: {
    devicePixelRatio?: number;
    renderer?: RendererType;
    useDirtyRect: any;
    width?: number | 'auto';
    height?: number | 'auto';
    locale?: string | LocaleOption;
  }
): Promise<EChartsType> {
  await Promise.all([
    // 标签自动布局，全局过渡动画等特性
    import('echarts/features'),
    // 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
    import('echarts/renderers'),
    // 引入图表，后缀都为 Chart
    import('echarts/lib/chart/pie'),
    import('echarts/lib/chart/bar'),
    import('echarts/lib/chart/line'),
    import('echarts/lib/chart/custom'),
    // 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
    import('echarts/lib/component/title'),
    import('echarts/lib/component/tooltip'),
    import('echarts/lib/component/dataset'),
    import('echarts/lib/component/transform'),
    import('echarts/lib/component/grid'),
    import('echarts/lib/component/polar'),
    import('echarts/lib/component/dataZoom'),
    import('echarts/lib/component/toolbox'),
    import('echarts/lib/component/legend'),
    import('echarts/lib/component/legendScroll')
  ]).then(([{ LabelLayout, UniversalTransition }, { CanvasRenderer, SVGRenderer }]) => {
    // 注册必须的组件，默认使用 SVGRenderer
    echarts.use([LabelLayout, UniversalTransition, SVGRenderer]);
  });

  // 销毁旧实例
  const existInstance = echarts.getInstanceByDom(dom);
  if (existInstance) {
    existInstance.dispose();
  }

  return echarts.init(dom, theme ?? defaultConfig.theme, merge({}, defaultConfig.opts, opts));
}

export async function analyseImport(options: EChartsOption) {
  if (options?.series) {
    // 分析 series
    let series = [];
    if (!Array.isArray(options.series)) {
      series.push(options.series);
    } else {
      series = options.series;
    }

    await Promise.all(
      series.map((serie) => {
        if (serie.type === 'bar') {
          return import('echarts/lib/chart/bar');
        } else if (serie.type === 'line') {
          return import('echarts/lib/chart/line');
        } else if (serie.type === 'custom') {
          return import('echarts/lib/chart/custom');
        } else if (serie.type === 'pie') {
          return import('echarts/lib/chart/pie');
        }
        return null;
      })
    ).then((res) => {
      return res[0];
    });
  }
}

/**
 * 获取指定数字往上取整的相同位数的数值，例如 3680 => 4000，9999 => 10000
 * @param value
 * @constructor
 */
export function getCeilNumber(value) {
  const len = value.toString().length - 1;
  const pow = Math.pow(10, len);
  const num = parseFloat(value.toString()[0]);
  return (num + 1) * pow;
}

/**
 * 获取 chart 间隔数量
 * @param max
 * @param splitNumber
 * @param decimal
 * @param divisible
 */
export function getEchartsSplit(max, splitNumber, decimal = 0, divisible = 5) {
  const res = {
    max: max,
    interval: 0,
    splitNumber: 0
  };

  // 尝试分割
  res.interval = max / splitNumber;

  // 获取分割的值的小数位数
  const dig = res.interval.toString().split('.');
  if (dig.length > 1) {
    const dec = dig[1];
    const decLen = dec.length;
    if (decLen > decimal) {
      // 进一位
      if (decimal > 0) {
        res.interval = parseFloat(dig[0] + '.' + parseInt(dec.substr(0, decimal)) + 1);
      } else {
        res.interval = parseInt(dig[0]) + 1;
      }
    }
  }

  if (splitNumber > 0 && res.interval > 0) {
    const ws = res.interval.toString().length;
    const z = Math.pow(10, ws - 1) * divisible;
    res.interval = Math.ceil(res.interval / z) * z;

    const num = max / res.interval;
    res.splitNumber = Math.floor(num);
    const remainder = num - Math.trunc(num);
    if (remainder > 0.5) {
      res.max = res.interval * (res.splitNumber + 2);
    } else {
      res.max = res.interval * (res.splitNumber + 1);
    }
  } else {
    res.splitNumber = 1;
    res.interval = res.max = 5;
  }

  return res;
}

/**
 * Vue Echarts 组件
 */
export const VEcharts = defineComponent({
  name: 'v-echarts',
  props: {
    theme: {
      type: String,
      default: null
    },
    devicePixelRatio: {
      type: Number,
      default: null
    },
    renderer: {
      type: Object as PropType<RendererType>,
      default: null
    },
    useDirtyRect: {
      type: Boolean,
      default: true
    },
    locale: {
      type: String as PropType<string | LocaleOption>,
      default: null
    },
    /*requires: {
      type: Array as PropType<EchartsSeriesType>,
      default: () => []
    },*/
    instance: {
      type: Object as PropType<EChartsType>,
      default: null
    },
    options: {
      type: [Object, Function] as PropType<EChartsOption | EChartsOptionPromise>,
      default: null
    },
    aspectRatio: {
      type: [Number, String],
      default: null
    },
    width: {
      type: [Number, String] as PropType<number | 'auto'>,
      default: null
    },
    height: {
      type: [Number, String] as PropType<number | 'auto'>,
      default: null
    },
    autoresize: {
      type: Boolean,
      default: true
    },
    empty: {
      type: Boolean,
      default: false
    }
  },
  emits: ['touchstart', 'update:instance'],
  setup(props: any, { emit }) {
    const options_ = ref<EChartsOption>();
    const wrapRef = ref();
    const chartRef = ref();
    const loading = ref(false);
    const initialized = ref(false);
    const error = ref<Error>();

    let instance;

    const styles = computed(() => {
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

      instance = await createEcharts(chartRef.value, [], props.theme, {
        devicePixelRatio: props.devicePixelRatio,
        renderer: props.renderer,
        useDirtyRect: props.useDirtyRect,
        width: props.width,
        height: props.height,
        locale: props.locale
      });

      await setOption();

      loading.value = false;
      initialized.value = true;

      // 往外传递实例对象
      emit('update:instance', instance);
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
      styles,
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
          {ctx.$slots?.loading ? ctx.$slots?.loading({ refresh: ctx.refresh }) : ''}
        </div>
      );
    } else if (ctx.error) {
      solts.push(
        <div class={styles.transition} key='error'>
          {ctx.$slots?.error ? ctx.$slots?.error({ error: ctx.error, refresh: ctx.refresh }) : ''}
        </div>
      );
    } else if (ctx.empty) {
      solts.push(
        <div class={styles.transition} key='empty'>
          {ctx.$slots?.empty ? ctx.$slots?.empty({ refresh: ctx.refresh }) : ''}
        </div>
      );
    }

    return (
      <div ref='wrapRef' class={styles.wrap} style={ctx.styles}>
        <TransitionGroup
          enterFromClass={styles['transition-enter-from']}
          enterToClass={styles['transition-enter-to']}
          leaveToClass={styles['transition-leave-to']}
          enterActiveClass={styles['transition-enter-active']}
          leaveActiveClass={styles['transition-enter-active']}
        >
          {solts}
        </TransitionGroup>
        {ctx.initialized
          ? ctx.$slots?.default
            ? ctx.$slots?.default({ error: ctx.error, empty: ctx.empty, loading: ctx.loading, refresh: ctx.refresh })
            : ''
          : ''}
        <div ref='chartRef' class={[styles.container, ctx.empty || !ctx.options_ ? styles.empty : '']} onTouchstart={ctx.touchstart} />
      </div>
    );
  }
});
