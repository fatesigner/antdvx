import { AsyncComponentLoader } from '@vue/runtime-core';

/**
 * types
 */

export interface IXDrawerHandlers<TArgs extends any[]> {
  present: (onDismissed?: (...args: TArgs) => void) => Promise<void>;
  dismiss: (...args: TArgs) => Promise<void>;
  loadComponent: (loader: AsyncComponentLoader) => Promise<void>;
}

export interface IXDrawerPropsType {
  /**
   * 是否显示右上角的关闭按钮
   */
  closable?: boolean;
  /**
   * 关闭时销毁 Drawer 里的子元素
   */
  destroyOnClose?: boolean;
  /**
   * 点击蒙层是否允许关闭
   */
  maskClosable?: boolean;
  /**
   * 是否展示遮罩
   */
  mask?: boolean;
  /**
   * 标题
   */
  title?: string;
  /**
   * 高度
   */
  width?: number | string;
  /**
   * 抽屉的方向
   */
  placement?: 'top' | 'right' | 'bottom' | 'left';
  /**
   * 是否支持键盘 esc 关闭
   */
  keyboard?: boolean;
  /**
   * 对话框外层容器的类名
   */
  wrapClassName?: string;

  // Custom
  /**
   * 全屏显示
   */
  fullscreen?: boolean;

  /**
   * Drawer 弹出事件
   */
  onPresented?: () => void;

  /**
   * Drawer 关闭事件
   */
  onDismissed?: () => void;

  /**
   * 点击遮罩层或右上角叉或取消按钮的回调
   */
  onClose?: (e: any) => void;
}

/**
 * XDrawer 选项
 */
export interface IXDrawerRefType<TCompProps extends Record<string, any>, TArgs extends any[]> {
  /**
   * 待加载的组件的 props 选项
   */
  compProps: Partial<TCompProps>;
  /**
   * XDrawer 选项
   */
  options: Partial<IXDrawerPropsType>;
  /**
   * XDrawer handlers
   */
  handler: IXDrawerHandlers<TArgs>;
}
