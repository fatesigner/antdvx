/**
 * types
 */

import { AsyncComponentLoader } from '@vue/runtime-core';
import { ModalProps } from 'ant-design-vue/es/modal/modal';

export interface IXModalHandlers<TArgs extends any[]> {
  present: (onDismissed?: (...args: TArgs) => void) => Promise<void>;
  dismiss: (...args: TArgs) => Promise<void>;
  loadComponent: (loader: AsyncComponentLoader) => Promise<void>;
}

export interface IXModalPropsType extends Omit<ModalProps, 'afterClose' | 'visible'> {
  // Custom
  /**
   * 允许横向滚动, 默认为 false
   */
  scrollX?: boolean;

  /**
   * 允许纵向滚动, 默认为 false
   */
  scrollY?: boolean;
  /**
   * 全屏显示
   */
  fullscreen?: boolean;

  /**
   * Modal 弹出事件
   */
  onPresented?: () => void;

  /**
   * Modal 关闭事件
   */
  onDismissed?: () => void;

  /**
   * 点击确定回调
   */
  onCancel?: (e: any) => void;

  /**
   * 点击确定回调
   */
  onOk?: (e: any) => void;
}

/**
 * XModal 实例
 */
export interface IXModalRefType<TCompProps extends Record<string, any>, TArgs extends any[]> {
  /**
   * 待加载的组件的 props 选项
   */
  compProps: Partial<TCompProps>;
  /**
   * XModal 选项
   */
  options: IXModalPropsType;
  /**
   * XModal handlers
   */
  handler: IXModalHandlers<TArgs>;
}
