/**
 * constants
 */

import { IWidgetSize } from './config';

// 尺寸
export const WIDGET_SIZE_OPTIONS: { label: string; value: IWidgetSize }[] = [
  { label: '大', value: 'large' },
  { label: '默认', value: 'default' },
  { label: '小', value: 'small' }
];

// 布局方式
export const LAYOUT_OPTIONS = [
  { label: '水平', value: 'horizontal' },
  { label: '垂直', value: 'vertical' },
  { label: '内联', value: 'inline' }
];

// 文本对齐方式
export const LABEL_ALIGN_OPTIONS = [
  { label: '左对齐', value: 'left' },
  { label: '右对齐', value: 'right' }
];

// 预置的日期格式化列表
export const DATE_FORMATS = ['YYYY-MM-DD', 'YYYY/MM/DD', 'YYYY-MM-DD HH:mm:ss', 'YYYY/MM/DD HH:mm:ss'];
