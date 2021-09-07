import { timer } from 'rxjs';
import { merge } from 'lodash-es';
import { Modal, Spin } from 'ant-design-vue';
import { bindLazyFunc } from '@fatesigner/utils';
import { getGUID } from '@fatesigner/utils/random';
import { createApp, h, nextTick, onMounted, reactive, ref } from 'vue';
import { Component, ComponentPublicInstance } from '@vue/runtime-core';

import { IconCloseLine } from '../iconfont';

import { IXModalPropsType, IXModalRef } from './types';

import './modal.less';

const SYMBOLS = {
  BASE_CLASS: 'ant-modal-x',
  FULLSCREEN_CLASS: 'ant-modal-x-fullscreen',
  LOADING_CLASS: 'ant-modal-x-loading'
};

export const defaultXModalProps: Partial<IXModalPropsType> = {
  // Antd
  title: null,
  footer: null,

  // Custom
  autoOpened: false,
  fullscreen: false,
  keepAlive: false
};

function destroy(instance, $container, wrapClassName) {
  if (instance && $container.parentNode) {
    instance.vIf = false;
    instance = null;
    $container.parentNode.removeChild($container);
    // get root element, then remove it
    const $dialog = document.querySelector('.' + wrapClassName);
    if ($dialog) {
      const $root = $dialog.closest('body > div');
      $root.parentNode.removeChild($root);
    }
  }
}

/**
 * 创建 XModal 实例
 * @param source 组件
 * @param compProps 组件 props
 * @param options XModal 选项
 */
export function createXModal<
  PropsOptions extends Record<string, any>,
  Args extends any[] = any[],
  T extends Component = {
    new (): ComponentPublicInstance;
  }
>(
  source: T,
  /**
   * 待加载的组件的 props 选项
   */
  compProps?: PropsOptions,
  /**
   * XModal 选项
   */
  options?: Partial<IXModalPropsType>
): IXModalRef<PropsOptions, Args> {
  type XModalRefType = IXModalRef<PropsOptions, Args>;

  const $app = document.createElement('div');
  document.body.appendChild($app);

  const modalRef: XModalRefType = {
    compProps: reactive(compProps ?? {}) as any,
    options: reactive(merge({}, defaultXModalProps, options)),
    present: null,
    dismiss: null,
    destroy: null
  };

  bindLazyFunc(modalRef, ['present', 'dismiss', 'destroy']);

  // Load async component
  /*if (comp) {
    (comp as any)()
      .then((comp: any) => {})
      .catch((err) => {
        notification.error({ message: err.message });
      });
  }*/

  const wrapClassName = 'p_' + getGUID(12);

  const app = createApp({
    // parent: parent,
    setup() {
      const vIf = ref(false);

      let hooks: ((...args: any[]) => void)[] = [];

      const afterClose = () => {
        // If keepAlive is false, then destroy it
        if (!modalRef.options.keepAlive) {
          destroy(app, $app, wrapClassName);
        }
        // Emit dismissed event
        modalRef?.options?.onDismissed?.();
      };

      const present: XModalRefType['present'] = async (onDismissed) => {
        if (onDismissed) {
          hooks.push(onDismissed);
        }
        vIf.value = true;
        await timer(1000)
          .toPromise()
          .finally(() => {
            // Emit presented event
            modalRef?.options?.onPresented?.();
          });
      };

      const dismiss: XModalRefType['dismiss'] = async (...args: any[]) => {
        vIf.value = false;
        timer(1000)
          .toPromise()
          .finally(() => {
            // Emit dismissed event
            modalRef?.options?.onDismissed?.();
            if (hooks.length) {
              hooks.forEach((hook) => {
                if (hook) {
                  hook.call(null, ...args);
                }
              });
              hooks = [];
            }
          });
      };

      onMounted(() => {
        modalRef.present = present;
        modalRef.dismiss = dismiss;
        modalRef.destroy = () => {
          destroy(app, $app, wrapClassName);
        };

        if (modalRef.options.autoOpened) {
          nextTick(() => {
            modalRef.present();
          });
        }
      });

      return () => [
        vIf.value
          ? h(
              'div',
              {
                class: SYMBOLS.LOADING_CLASS
              },
              h(Spin)
            )
          : null,
        h(
          Modal,
          {
            visible: vIf.value,
            destroyOnClose: modalRef.options.destroyOnClose,
            afterClose: afterClose,
            title: modalRef.options.title,
            closable: modalRef.options.closable,
            width: modalRef.options.width,
            footer: null,
            wrapClassName: [SYMBOLS.BASE_CLASS, modalRef.options?.fullscreen ? SYMBOLS.FULLSCREEN_CLASS : '', modalRef.options?.wrapClassName ?? ''].join(' '),
            onCancel() {
              (dismiss as any)();
            }
          },
          {
            closeIcon() {
              return h(IconCloseLine, {
                scale: 1.2
              });
            },
            default() {
              return h(source as any, modalRef.compProps);
            }
          }
        )
      ];
    }
  }).mount($app);

  return modalRef;
}
