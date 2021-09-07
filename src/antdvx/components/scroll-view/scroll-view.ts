import { ANTDVX_SIZES } from '../../constants';

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
