import { timer } from 'rxjs';
import { merge } from 'lodash-es';
import { bindLazyFunc } from '@fatesigner/utils';
import { getGUID } from '@fatesigner/utils/random';
import { Drawer, notification } from 'ant-design-vue';
import { createApp, h, nextTick, onMounted, reactive, ref, toRefs } from 'vue';
import { Component } from '@vue/runtime-core';

import { Iconfont } from '../iconfont';

import { IXDrawerCompOptions, IXDrawerListenersType, IXDrawerPropsType, IXDrawerRef } from './types';

import './drawer.scss';

const SYMBOLS = {
  BASE_CLASS: 'ant-drawer-x',
  FULLSCREEN_CLASS: 'ant-drawer-fullscreen'
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
 * 更新布局、尺寸（高宽）
 * @param ref
 * @param $container
 * @param wrapClassName
 */
function resizeLayout<TArgs extends any[], P extends Record<string, any>>(ref: IXDrawerRef<TArgs, P>, $container, wrapClassName) {}

/**
 * XDrawer
 */
export function createXDrawer<C extends Component, P extends Record<string, any>, L extends Record<string, (...args: any[]) => any>>(
  compOptions: IXDrawerCompOptions<C, P, L>,
  drawerOptions?: {
    props?: Partial<IXDrawerPropsType>;
    listeners?: Partial<IXDrawerListenersType>;
  }
): IXDrawerRef<any[], P> {
  const $app = document.createElement('div');
  document.body.appendChild($app);

  const modalRef: IXDrawerRef<any[], P> = {
    compOptions: reactive(compOptions?.props ?? {}) as any,
    options: reactive(merge({}, defaultXDrawerProps, drawerOptions?.props)),
    present: null,
    dismiss: null,
    destroy: null
  };

  bindLazyFunc(modalRef, ['present', 'dismiss', 'destroy']);

  // Load async component
  if (compOptions?.comp) {
    (compOptions.comp as any)()
      .then((comp: any) => {
        const wrapClassName = 'p_' + getGUID(12);
        const app = createApp({
          //parent: config.parentContext,
          setup() {
            const vIf = ref(false);

            let hooks: ((...args: any[]) => void)[] = [];

            const afterVisibleChange = (visible) => {
              // If keepAlive is false, then destroy it
              if (visible) {
                // Emit presented event
                drawerOptions?.listeners?.presented?.();
              } else {
                if (!modalRef.options.keepAlive) {
                  destroy(app, $app, wrapClassName);
                }
                // Emit dismissed event
                drawerOptions?.listeners?.dismissed?.();
              }
            };

            const present: IXDrawerRef<any[], P>['present'] = async (onDismissed) => {
              if (onDismissed) {
                hooks.push(onDismissed);
              }
              vIf.value = true;
              await timer(1000)
                .toPromise()
                .finally(() => {
                  // Emit presented event
                  drawerOptions?.listeners?.presented?.();
                });
            };

            const dismiss: IXDrawerRef<any[], P>['dismiss'] = async (...args: any[]) => {
              vIf.value = false;
              timer(1000)
                .toPromise()
                .finally(() => {
                  // Emit dismissed event
                  drawerOptions?.listeners?.dismissed?.();
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

            return () =>
              h(
                Drawer as any,
                {
                  visible: vIf.value,
                  destroyOnClose: false,
                  afterVisibleChange: afterVisibleChange,
                  title: modalRef.options.title,
                  closable: modalRef.options.closable,
                  maskClosable: modalRef.options.maskClosable,
                  mask: modalRef.options.mask,
                  width: modalRef.options.width,
                  footer: null,
                  wrapClassName: [SYMBOLS.BASE_CLASS, modalRef.options?.fullscreen ? SYMBOLS.FULLSCREEN_CLASS : '', modalRef.options?.wrapClassName ?? ''].join(
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
                    const _refs = toRefs(modalRef.compOptions);
                    const props_ = Object.keys(_refs).reduce((prev, cur) => {
                      prev[cur] = _refs[cur].value;
                      return prev;
                    }, {});
                    return [
                      h(comp.default, {
                        ...props_,
                        ...(compOptions?.listeners
                          ? Object.keys(compOptions.listeners).reduce((prev, cur) => {
                              prev['on' + cur.replace(cur[0], cur[0].toUpperCase())] = compOptions.listeners[cur];
                              return prev;
                            }, {})
                          : null)
                      })
                    ];
                  }
                }
              );
          }
        }).mount($app);
      })
      .catch((err) => {
        notification.error({ message: err.message });
      });
  }

  return modalRef;
}
