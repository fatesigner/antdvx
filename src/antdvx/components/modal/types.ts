/**
 * types
 */

import { ModalProps } from 'ant-design-vue/es/modal/modal';
import { AsyncComponentLoader, AsyncComponentOptions, Component } from '@vue/runtime-core';

export interface IXModalHandlers<TArgs extends any[]> {
  present: (onDismissed?: (...args: TArgs) => void) => Promise<void>;
  dismiss: (...args: TArgs) => Promise<void>;
  destroy: () => void;
}

export interface IXModalPropsType extends Omit<ModalProps, 'afterClose' | 'visible' | 'destroyOnClose'> {
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
}

export interface IXModalListenersType {
  cancel: (e: any) => void;
  ok: (e: any) => void;
  presented: () => void;
  dismissed: () => void;
}

export interface IXModalCompOptions<C extends Component, P extends Record<string, any>, L extends Record<string, (...args: any[]) => any>> {
  comp: AsyncComponentLoader<C> | AsyncComponentOptions<C>;
  props?: P;
  listeners?: L;
}

export interface IXModalRef<TArgs extends any[], P extends Record<string, any>> extends IXModalHandlers<TArgs> {
  compOptions: P;
  options: Partial<IXModalPropsType>;
}
