/**
 * 全局过滤器
 */

import dayjs from 'dayjs';
import { toFixed } from '@fatesigner/utils';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

export const Pipes = {
  install(Vue) {
    Vue.config.globalProperties.$pipes = {
      currency(value: string | number, replaced?: boolean): string {
        const str = formatter.format(value as any).replace('$', '');
        if (replaced) {
          return str.replace('.00', '');
        }
        return str;
        // return `￥${value}`;
      },
      dateFormat(value: any, format = 'YYYY-MM-DD HH:mm:ss'): string {
        if (value) {
          return dayjs(value).format(format);
        }
        return '';
      }
    };

    // 覆盖原生 toFixed
    // eslint-disable-next-line no-extend-native
    Number.prototype.toFixed = function (digits) {
      return toFixed(this, digits);
    };
  }
};
