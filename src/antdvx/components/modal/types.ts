/**
 * types
 */

import { ModalProps } from 'ant-design-vue/es/modal/modal';

export interface IXModalHandlers<TArgs extends any[]> {
  present: (onDismissed?: (...args: TArgs) => void) => Promise<void>;
  dismiss: (...args: TArgs) => Promise<void>;
  destroy: () => void;
}

export interface IXModalPropsType extends Omit<ModalProps, 'afterClose' | 'visible'> {
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
 * XModal 选项
 */
export interface IXModalRef<CompProps extends Record<string, any>, Args extends any[]> extends IXModalHandlers<Args> {
  /**
   * 待加载的组件的 props 选项
   */
  compProps: Partial<CompProps>;
  /**
   * XModal 选项
   */
  options: Partial<IXModalPropsType>;
}
