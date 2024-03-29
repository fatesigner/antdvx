/**
 * constants
 * 全局常量（大写和_连字符命名）
 */

// 颜色
export const ANTDVX_COLORS = [
  // 主色
  'primary',
  // 辅色
  'secondary',
  // 配色
  'tertiary',

  // 成功
  'success',
  // 警告
  'warning',
  // 危险
  'danger',

  // 七种基本色
  'red',
  'orange',
  'yellow',
  'green',
  'cyan',
  'blue',
  'purple'
] as const;

// 尺寸
export const ANTDVX_SIZES = ['default', 'large', 'small', 'mini'] as const;

// 方向
export const ANTDVX_DIRECTIONS = ['up', 'right', 'down', 'left'] as const;

// 按钮类型
export const ANTDVX_BUTTON_TYPES = [
  'default',
  'primary',
  // 'ghost',
  'dashed',
  'link',
  'text',
  'outline',
  '3d'
] as const;

// 弹出框位置
export const ANTDVX_PLACEMENTS = [
  'top',
  'left',
  'right',
  'bottom',
  'topLeft',
  'topRight',
  'bottomLeft',
  'bottomRight',
  'leftTop',
  'leftBottom',
  'rightTop',
  'rightBottom'
] as const;
