/**
 * echarts
 */

// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';
import { isArray, mergeWith } from 'lodash-es';
import { isNullOrUndefined, isNumber } from '@fatesigner/utils/type-check';

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
export function configureEcharts<Opt extends EChartsOption>(
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
  mergeWith(
    defaultConfig,
    {
      options,
      theme,
      opts
    },
    (objVal, srcVal) => (isArray(objVal) ? srcVal : undefined)
  );
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

  args.push((objVal, srcVal) => (isArray(objVal) ? srcVal : undefined));

  return mergeWith.apply(this, args);
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
    import('echarts/lib/chart/scatter'),
    import('echarts/lib/chart/radar'),
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

  return echarts.init(
    dom,
    theme ?? defaultConfig.theme,
    mergeWith({}, defaultConfig.opts, opts, (objVal, srcVal) => (isArray(objVal) ? srcVal : undefined))
  );
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
 * 获取指定数值向下取(由指定的底数确定，默认为 10)最接近的整數
 * @param value
 * @param radix
 */
export function getFloorByRadix(value: number, radix = 10) {
  // const exe = Math.floor(Math.log(value) / Math.log(radix));
  // return Math.pow(radix, exe);
  if (isNumber(value)) {
    return Math.pow(radix, Math.floor(value).toString().length - 1);
  }
  return 0;
}

function getFloors(value: number) {
  const floor = getFloorByRadix(value, 10);
  const base = Math.floor(value / floor);
  return [base, floor];
}

function getCeils(value: number) {
  let floor = getFloorByRadix(value, 10);
  let base = Math.ceil(value / floor);
  if (base === 10) {
    base = 1;
    floor = floor * 10;
  }
  return [base, floor];
}

/**
 * 获取 chart 间隔数量
 * max 坐标轴刻度最大值;
 * digits 允许的 interval 小数位数，默认为 null;
 * splitNumber 分割段数，默认为 null 即按照可读性自动分割;
 */
export function getEchartsSplit(options: {
  max: number;
  digits?: number;
  interval?: number;
  splitNumber?: number;
  maxSplitNumber?: number;
  minInterval?: number;
  maxInterval?: number;
}) {
  let max;
  let interval;
  let splitNumber;

  const res = {
    max: undefined,
    interval: undefined,
    splitNumber: undefined,
    minInterval: options?.minInterval,
    maxInterval: options?.maxInterval
  };

  if (options?.max && isNumber(options.max)) {
    max = options.max;
  }

  if (options?.interval && /^[0-9]+$/.test(options.interval?.toString())) {
    interval = options.interval;
  }

  if (options?.splitNumber && /^[0-9]+$/.test(options.splitNumber?.toString())) {
    splitNumber = options.splitNumber;
  }

  if (options?.minInterval && isNumber(options.minInterval)) {
    res.minInterval = options.minInterval;
  }

  if (options?.maxInterval && isNumber(options.maxInterval)) {
    res.maxInterval = options.maxInterval;
  }

  if (!interval || !splitNumber) {
    if (max) {
      res.max = options.max;
      if (interval) {
        // 若指定了 max，则对 max 尝试进行分割
        const num = Math.ceil(res.max / interval);
        res.splitNumber = num || 5;
        res.interval = interval;
      } else if (splitNumber) {
        const interval = res.max / splitNumber;
        const floor = getFloors(interval);
        const interval0 = (floor[0] + 0.5) * floor[1];
        if (interval > interval0) {
          res.interval = (floor[0] + 1) * floor[1];
        } else {
          res.interval = interval0;
        }
        res.splitNumber = splitNumber;
      } else {
        // 未指定 splitNumber
        const floor = getCeils(res.max);
        if (floor[0] === 1) {
          res.interval = floor[1] / 5;
        } else if (floor[0] < 4) {
          res.interval = floor[1] / 2;
        } else {
          res.interval = floor[1];
        }

        if (res.minInterval && res.interval < res.minInterval) {
          const floor = getFloors(res.minInterval);
          const interval0 = (floor[0] + 0.5) * floor[1];
          if (res.minInterval > interval0) {
            res.interval = (floor[0] + 1) * floor[1];
          } else if (res.minInterval > floor[0] * floor[1]) {
            res.interval = interval0;
          } else {
            res.interval = res.minInterval;
          }
        }

        let digits = 0;
        if (/^[0-9]+$/.test(options?.digits?.toString())) {
          digits = options.digits;
        }
        const dig = res.interval.toString().split('.');
        if (dig?.[1]) {
          // 若间隔值有小数部分，即 max 无法被整除分割
          if (dig[1].length > digits) {
            // 进一位
            if (digits > 0) {
              res.interval = parseFloat(dig[0] + '.' + parseInt(dig[1].substring(0, digits)) + 1);
            } else {
              res.interval = parseInt(dig[0]) + 1;
            }
          }
        }

        res.splitNumber = Math.ceil(res.max / res.interval);
      }
    }
  }

  // 重新计算 max
  res.max = res.interval * res.splitNumber;

  if (!splitNumber) {
    if (max >= res.max - res.interval / 4) {
      res.max += res.interval;
      res.splitNumber += 1;
    }
  }

  return res;
}

/**
 * 获取 tooltip formatter
 * @param itemMap
 */
export function getEchartsTooltipFormatter(itemMap?: (item: unknown) => number | string) {
  return (params) => {
    let res = params.length ? `${params[0].axisValueLabel}<br/>` : '';
    for (const param of params) {
      if (!isNullOrUndefined(param.data)) {
        if (itemMap) {
          res += itemMap(param);
        } else {
          res += `${param.marker}${param.seriesName}：${param.value}<br/>`;
        }
      }
    }
    return res;
  };
}
