import { timer } from 'rxjs';
import { merge } from 'lodash-es';
import { Drawer, Spin } from 'ant-design-vue';
import { bindLazyFunc } from '@fatesigner/utils';
import { getGUID } from '@fatesigner/utils/random';
import { createApp, h, nextTick, onMounted, reactive, ref } from 'vue';
import { AsyncComponentLoader, AsyncComponentOptions, Component, ComponentPublicInstance } from '@vue/runtime-core';

import { Iconfont } from '../iconfont';

import { IXDrawerPropsType, IXDrawerRef } from './types';

import './drawer.scss';

const SYMBOLS = {
  BASE_CLASS: 'ant-drawer-x',
  FULLSCREEN_CLASS: 'ant-drawer-x-fullscreen',
  LOADING_CLASS: 'ant-modal-x-loading'
};

export const defaultXDrawerProps: Partial<IXDrawerPropsType> = {
  // Antd
  title: null,

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
 * 创建 XDrawer 实例
 * @param source 组件
 * @param compProps 组件 props
 * @param options XModal 选项
 */
export function createXDrawer<
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
   * XDrawer 选项
   */
  options?: Partial<IXDrawerPropsType>
): IXDrawerRef<PropsOptions, Args> {
  type XDrawerRefType = IXDrawerRef<PropsOptions, Args>;

  const $app = document.createElement('div');
  document.body.appendChild($app);

  const drawerRef: XDrawerRefType = {
    compProps: reactive(compProps ?? {}) as any,
    options: reactive(merge({}, defaultXDrawerProps, options)),
    present: null,
    dismiss: null,
    destroy: null
  };

  bindLazyFunc(drawerRef, ['present', 'dismiss', 'destroy']);

  const wrapClassName = 'p_' + getGUID(12);

  const app = createApp({
    // parent: parent,
    setup() {
      const vIf = ref(false);

      let hooks: ((...args: any[]) => void)[] = [];

      const afterVisibleChange = (visible) => {
        // If keepAlive is false, then destroy it
        if (visible) {
          // Emit presented event
          drawerRef?.options?.onPresented?.();
        } else {
          if (!drawerRef.options.keepAlive) {
            destroy(app, $app, wrapClassName);
          }
          // Emit dismissed event
          drawerRef?.options?.onDismissed?.();
        }
      };

      const present: XDrawerRefType['present'] = async (onDismissed) => {
        if (onDismissed) {
          hooks.push(onDismissed);
        }
        vIf.value = true;
        await timer(1000)
          .toPromise()
          .finally(() => {
            // Emit presented event
            drawerRef?.options?.onPresented?.();
          });
      };

      const dismiss: XDrawerRefType['dismiss'] = async (...args: any[]) => {
        vIf.value = false;
        timer(1000)
          .toPromise()
          .finally(() => {
            // Emit dismissed event
            drawerRef?.options?.onDismissed?.();
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
        drawerRef.present = present;
        drawerRef.dismiss = dismiss;
        drawerRef.destroy = () => {
          destroy(app, $app, wrapClassName);
        };

        if (drawerRef.options.autoOpened) {
          nextTick(() => {
            drawerRef.present();
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
          Drawer,
          {
            visible: vIf.value,
            destroyOnClose: drawerRef.options.destroyOnClose,
            afterVisibleChange: afterVisibleChange,
            title: drawerRef.options.title,
            closable: drawerRef.options.closable,
            maskClosable: drawerRef.options.maskClosable,
            mask: drawerRef.options.mask,
            width: drawerRef.options.width,
            footer: null,
            wrapClassName: [SYMBOLS.BASE_CLASS, drawerRef.options?.fullscreen ? SYMBOLS.FULLSCREEN_CLASS : '', drawerRef.options?.wrapClassName ?? ''].join(
              ' '
            ),
            onClose() {
              (dismiss as any)();
            }
          },
          {
            closeIcon() {
              return h(Iconfont, {
                name: 'times',
                scale: 1.2
              });
            },
            default() {
              return h(source as any, drawerRef.compProps);
            }
          }
        )
      ];
    }
  }).mount($app);

  return drawerRef;
}
