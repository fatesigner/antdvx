import { PropType } from 'vue';

import { ANTDVX_COLORS, ANTDVX_SIZES } from '../../constants';

/**
 * XButton component props type
 */
export const XButtonProps = {
  // Antd
  /**
   * 将按钮宽度调整为其父宽度的选项
   */
  block: {
    type: Boolean,
    default: false
  },
  /**
   * 设置危险按钮
   */
  /*danger: {
    type: Boolean,
    default: false
  },*/
  /**
   * 按钮失效状态
   */
  disabled: {
    type: Boolean,
    default: false
  },
  /**
   * 幽灵属性，使按钮背景透明
   */
  ghost: {
    type: Boolean,
    default: false
  },
  /**
   * 点击跳转的地址，指定此属性 button 的行为和 a 链接一致
   */
  href: {
    type: String
  },
  /**
   * 设置 button 原生的 type 值，可选值请参考 HTML 标准 https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-type
   */
  htmlType: {
    type: String
  },
  /**
   * 设置按钮的图标类型
   */
  /*icon: {
    type: String,
  },*/
  /**
   * 设置按钮载入状态
   */
  loading: {
    type: Boolean,
    default: false
  },
  /**
   * 设置按钮形状
   */
  shape: {
    type: String as PropType<'circle' | 'round'>
  },
  /**
   * 设置按钮大小
   */
  size: {
    type: String as PropType<typeof ANTDVX_SIZES[number]>,
    default: 'default'
  },
  /**
   * 相当于 a 链接的 target 属性，href 存在时生效
   */
  target: {
    type: String
  },
  /**
   * 设置按钮类型，新增 outline、3d 类型
   */
  type: {
    type: String as PropType<'default' | 'primary' | 'ghost' | 'dashed' | 'link' | 'text' | 'outline' | '3d'>,
    default: 'default'
  },

  // Custom
  /**
   * 按钮颜色
   */
  color: {
    type: String as PropType<typeof ANTDVX_COLORS[number]>
  },
  /**
   * 是否自动弹出消息通知，当设置  handler 后生效
   */
  handler: {
    type: Function as PropType<(...args: any[]) => Promise<any>>
  },
  /**
   * 是否自动弹出消息通知，当设置  handler 后生效
   */
  notify: {
    type: Boolean,
    default: false
  },
  /**
   * html title
   */
  title: {
    type: String
  },

  // events
  onClick: {
    type: Function
  }
};
