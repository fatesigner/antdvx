import { ANTDVX_SIZES } from '../../constants';

/**
 * 可滚动视图选项
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
   * 自适应外部容器尺寸, x: width: 100%, y: height: 100%, xy: width: 100%; height: 100%; 默认为 y
   */
  fill?: 'x' | 'y' | 'xy';

  /**
   * 设置可滚动的方向, x: 水平, y: 垂直, xy: 所有方向均可滚动, 默认为 y
   */
  scroll?: 'x' | 'y' | 'xy';

  /**
   * 显示 loading 层
   */
  loading?: {
    show: boolean;
    size?: typeof ANTDVX_SIZES[number];
    text?: string;
  };

  /**
   * 初始化函数, 若设置该值, 将会在 onMounted 事件中执行，该函数执行期间, 将会持续显示 loading 层
   */
  initialize?: () => Promise<any>;
}
