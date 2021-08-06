/**
 * echarts
 */

import { merge } from 'lodash-es';
/* import { ECharts } from 'echarts/core';
import { LocaleOption } from 'echarts/types/src/core/locale';
import { EChartsOption } from 'echarts/types/src/export/option';
import { RendererType, SeriesOption, ThemeOption } from 'echarts/types/src/util/types'; */

/* import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/custom';
import 'echarts/lib/component/dataset';
import 'echarts/lib/component/title';
import 'echarts/lib/component/polar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/dataZoom';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/legendScroll'; */

export type EChartsOption = any;
export type RendererType = any;
export type LocaleOption = any;
export type SeriesOption = any;
export type ThemeOption = any;
export type EchartsSeriesType = any;
export type EChartsType = any;

// export { EChartsOption, RendererType, LocaleOption };
// export type EchartsSeriesType = SeriesOption['type'][];
// export type EChartsOptionPromise = (...args: any) => Promise<EChartsOption>;
// export interface EChartsType extends ECharts {}

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
  const echarts = await Promise.all([
    import('echarts'),
    import('echarts/lib/chart/pie'),
    import('echarts/lib/chart/bar'),
    import('echarts/lib/chart/line'),
    import('echarts/lib/chart/custom'),
    // 基础模块
    import('echarts/lib/component/dataset'),
    import('echarts/lib/component/title'),
    import('echarts/lib/component/polar'),
    import('echarts/lib/component/tooltip'),
    import('echarts/lib/component/dataZoom'),
    import('echarts/lib/component/legend'),
    import('echarts/lib/component/legendScroll')
  ]).then((res) => {
    return res[0];
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