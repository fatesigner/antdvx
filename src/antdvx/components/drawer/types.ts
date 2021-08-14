/**
 * types
 */

export interface IXDrawerHandlers<TArgs extends any[]> {
  present: (onDismissed?: (...args: TArgs) => void) => Promise<void>;
  dismiss: (...args: TArgs) => Promise<void>;
  destroy: () => void;
}

export interface IXDrawerPropsType {
  /**
   * 是否显示右上角的关闭按钮
   */
  closable: boolean;
  /**
   * 关闭时销毁 Drawer 里的子元素
   */
  destroyOnClose: boolean;
  /**
   * 点击蒙层是否允许关闭
   */
  maskClosable: boolean;
  /**
   * 是否展示遮罩
   */
  mask: boolean;
  /**
   * 标题
   */
  title: string;
  /**
   * 高度
   */
  width?: number | string;
  /**
   * 抽屉的方向
   */
  placement: 'top' | 'right' | 'bottom' | 'left';
  /**
   * 是否支持键盘 esc 关闭
   */
  keyboard: boolean;
  /**
   * 对话框外层容器的类名
   */
  wrapClassName: string;

  // Custom
  /**
   * 自动显示
   */
  autoOpened;
  /**
   * 全屏显示
   */
  fullscreen?: boolean;
  /**
   * 保持组件处于活动状态，关闭后不销毁
   */
  keepAlive?: boolean;

  /**
   * Modal 弹出事件
   */
  onPresented: () => void;

  /**
   * Modal 关闭事件
   */
  onDismissed: () => void;
}

/**
 * XDrawer 选项
 */
export interface IXDrawerRef<CompProps extends Record<string, any>, Args extends any[]> extends IXDrawerHandlers<Args> {
  /**
   * 待加载的组件的 props 选项
   */
  compProps: Partial<CompProps>;
  /**
   * XModal 选项
   */
  options: Partial<IXDrawerPropsType>;
}
