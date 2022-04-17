import dayjs from 'dayjs';
import { toFixed } from '@fatesigner/utils';
import { isNullOrUndefined } from '@fatesigner/utils/type-check';

/**
 * Antdvx 管道操作符配置
 */
export interface IAntdvxPipesConfig {
  /**
   * 设置到 App.config.globalProperties 的变量名，默认为 $pipes
   */
  globalPropertyName?: string;
  /**
   * 默认的日期格式化
   */
  dateFormat?: string;
  /**
   * 货币格式化, 指定提供的一个国际化数字格式对象
   * style: decimal 數字格式; currency 货币格式(千分位); percent 百分比格式; 默认值为 decimal
   * currency: 货币符号, CNY 人民币; USD 美元; EUR 歐元
   * minimumFractionDigits: 使用的小数位数的最小长度, 可能的值为 0 至 20; 默认为整数和百分比格式;若沒有提供则其值为 2
   * maximumFractionDigits: 使用的小数位数的最大长度, 可能的值为 0 至 20; 默认为整数和百分比格式;若沒有提供则其值为 2
   */
  currencyFormat?: Intl.NumberFormat;
  /**
   * 小数格式化
   */
  fixed?: {
    /**
     * digits 小数点后数字的个数；介于 0 到 20 （包括）之间, 实现环境可能支持更大范围如果忽略该参数, 则默认为 0
     */
    digits?: number;
    /**
     * 当有效位数确定后，其后多余位数的处理模式，默认为 normal：即银行家舍入法 "四舍六入五成双"；round：标准的四舍五入；increase：无论数值大小，一律进 1；ignore：一律舍弃
     */
    mode?: 'ignore' | 'normal' | 'round' | 'increase';
  };
}

const antdvxPipesConfig: IAntdvxPipesConfig = {
  globalPropertyName: '$pipes',
  dateFormat: 'YYYY-MM-DD HH:mm:ss',
  currencyFormat: new Intl.NumberFormat('zh-CN', {
    // style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }),
  fixed: {
    digits: 2,
    mode: 'round'
  }
};

/**
 * 更新 Antdvx 管道操作符 配置
 * @param config
 */
export function setAntdvxPipesConfig(config?: IAntdvxPipesConfig) {
  Object.assign(antdvxPipesConfig, config);
}

/**
 * Antdvx 管道操作符，包含一些通用的格式化、过滤器
 */
export const AntdvxPipes = {
  /**
   * 货币格式化
   * @param value
   * @param currencyFormat
   * @param fixed
   */
  currencyFormat(value: number | string, currencyFormat: IAntdvxPipesConfig['currencyFormat'], fixed: IAntdvxPipesConfig['fixed']): string {
    if (isNullOrUndefined(value)) {
      return '';
    } else if (isNaN(value as any)) {
      return value as any;
    } else {
      let str = '';

      if (!isNullOrUndefined(fixed?.digits) || !isNullOrUndefined(antdvxPipesConfig?.fixed?.digits)) {
        str = toFixed(value as any, fixed?.digits ?? antdvxPipesConfig?.fixed?.digits, fixed?.mode ?? antdvxPipesConfig?.fixed?.mode);
      }

      if (currencyFormat) {
        str = currencyFormat.format(str as any);
      } else if (antdvxPipesConfig?.currencyFormat) {
        str = antdvxPipesConfig.currencyFormat.format(str as any);
      }

      return str.toString();
    }
  },
  /**
   * 日期格式化，基于 dayjs 库
   * @param value 待格式化的日期，Date、字符串或者数字类型
   * @param format 格式化占位符
   */
  dateFormat(value: any, format?: string): string {
    if (isNullOrUndefined(value)) {
      return '';
    } else {
      return dayjs(value).format(format ?? antdvxPipesConfig.dateFormat);
    }
  },
  /**
   * 千分位格式化
   * @param value
   * @param fixed
   */
  thousandsFormat(value: number | string, fixed: IAntdvxPipesConfig['fixed']) {
    if (isNullOrUndefined(value)) {
      return '';
    } else if (isNaN(value as any)) {
      return value;
    } else {
      if (!isNullOrUndefined(fixed?.digits) || !isNullOrUndefined(antdvxPipesConfig?.fixed?.digits)) {
        const digits = fixed?.digits ?? antdvxPipesConfig?.fixed?.digits;
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: digits,
          maximumFractionDigits: digits
        }).format(toFixed(value as any, digits, fixed?.mode ?? antdvxPipesConfig?.fixed?.mode) as any);
      }
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value as any);
    }
  }
};

// 覆盖原生 toFixed
// eslint-disable-next-line no-extend-native
Number.prototype.toFixed = function (digits) {
  return toFixed(this, digits ?? antdvxPipesConfig?.fixed?.digits ?? 2, antdvxPipesConfig?.fixed?.mode ?? 'round');
};
