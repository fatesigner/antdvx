import to from 'await-to-js';
import { timer } from 'rxjs';
import { isArray, mergeWith } from 'lodash-es';
import { Alert, Modal } from 'ant-design-vue';
import { bindLazyFunc } from '@fatesigner/utils';
import { AsyncComponentLoader } from '@vue/runtime-core';
import { PropType, defineComponent, h, reactive, ref, shallowRef } from 'vue';

import { XButtonRefresh } from '../button';
import { SpinnerLoading } from '../loading';
import { IconCloseLine } from '../iconfont';
import { ScrollView } from '../scroll-view';
import { TransitionCollapse, TransitionOpacity, TransitionZoom } from '../transitions';

import { IXModalHandlers, IXModalPropsType, IXModalRefType } from './types';

const SYMBOLS = {
  BASE_CLASS: 'ant-modal-x',
  FULLSCREEN_CLASS: 'ant-modal-x-fullscreen'
};

const defaultXModalProps: Partial<IXModalPropsType> = {
  // Custom
  fullscreen: false
};

const XModalLoading = defineComponent({
  name: 'x-modal-loading',
  render() {
    return (
      <div class='tw-flex tw-items-center tw-justify-center'>
        <div class='tw-p-4'>
          <SpinnerLoading class='tw-align-top' />
        </div>
      </div>
    );
  }
});

const XModalError = defineComponent({
  name: 'x-modal-error',
  props: {
    error: String,
    reload: Function
  },
  render(ctx) {
    return (
      <div class='tw-flex tw-items-center tw-justify-center'>
        <div class='tw-p-4'>
          <Alert
            type='error'
            show-icon
            v-slots={{
              message: () => [ctx.error, <XButtonRefresh only-icon color='primary' size='small' type='link' handler={ctx.reload} />]
            }}
          />
        </div>
      </div>
    );
  }
});

/**
 * Modal 弹出层，基于 AntModal
 */
export const XModal = defineComponent({
  name: 'x-modal',
  props: {
    options: {
      type: Object as PropType<IXModalPropsType>,
      default() {
        return defaultXModalProps;
      }
    },
    component: Function,
    compProps: {
      type: Object
    },
    handler: {
      type: Object as PropType<IXModalHandlers<any>>
    }
  },
  setup(props: any) {
    let hooks: ((...args: any[]) => void)[] = [];

    const error = ref();
    const loading = ref(false);
    const visible_ = ref(false);
    const component_ = shallowRef();

    const afterClose = () => {
      // Emit dismissed event
      props?.options?.onDismissed?.();
    };

    let loadComponentTimer;
    const loadComponent: IXModalHandlers<any>['loadComponent'] = async (loader) => {
      if (loadComponentTimer) {
        clearTimeout(loadComponentTimer);
        loadComponentTimer = null;
      }

      let needLoad = false;

      if (!component_.value) {
        loading.value = true;
        needLoad = true;
      } else if (props.options.destroyOnClose) {
        component_.value = null;
        needLoad = true;
        loadComponentTimer = setTimeout(function () {
          loading.value = true;
          loadComponentTimer = null;
        }, 300);
      }

      if (needLoad) {
        const [err, res] = await to(loader());
        if (err) {
          error.value = err.message;
        } else {
          component_.value = res.default;
        }
      }

      if (loadComponentTimer) {
        clearTimeout(loadComponentTimer);
        loadComponentTimer = null;
      }

      loadComponentTimer = setTimeout(function () {
        loading.value = false;
        loadComponentTimer = null;
      }, 500);
    };

    const reload = async () => {
      if (props.component) {
        await loadComponent(props.component);
      }
    };

    const present: IXModalHandlers<any>['present'] = async (onDismissed) => {
      if (onDismissed) {
        hooks.push(onDismissed);
      }
      visible_.value = true;
      reload();
      await timer(1000)
        .toPromise()
        .finally(() => {
          // Emit presented event
          props?.options?.onPresented?.();
        });
    };

    const dismiss: IXModalHandlers<any>['dismiss'] = async (...args: any[]) => {
      visible_.value = false;
      timer(1000)
        .toPromise()
        .finally(() => {
          // Emit dismissed event
          props?.options?.onDismissed?.();
          if (hooks.length) {
            hooks.forEach((hook) => {
              if (hook) {
                hook(...args);
              }
            });
            hooks = [];
          }
        });
    };

    const onCancel = (e) => {
      (dismiss as any)();
      props?.options?.onCancel?.(e);
    };

    const onOk = (e) => {
      props?.options?.onOk?.(e);
    };

    // update handlers
    if (props.handler) {
      Object.assign(props.handler, {
        present,
        dismiss,
        loadComponent
      } as IXModalHandlers<any>);
    }

    return { error, loading, visible_, component_, afterClose, loadComponent, reload, present, dismiss, onCancel, onOk };
  },
  render(ctx) {
    const content = ctx.options.fullscreen
      ? ctx?.component
        ? [
            <div class='tw-absolute tw-top-1/2 tw-left-1/2 tw-transform tw--translate-x-1/2 tw--translate-y-1/2'>
              <TransitionZoom>{ctx.loading ? <XModalLoading /> : ''}</TransitionZoom>
            </div>,
            <div class='tw-absolute tw-top-1/2 tw-left-1/2 tw-transform tw--translate-x-1/2 tw--translate-y-1/2'>
              <TransitionZoom>{!ctx.loading && !!ctx.error ? <XModalError error={ctx.error} reload={ctx.reload} /> : ''}</TransitionZoom>
            </div>,
            <TransitionOpacity>{!ctx.loading && !ctx.error ? (ctx.component_ ? h(ctx.component_, ctx.compProps) : '') : ''}</TransitionOpacity>
          ]
        : ctx.$slots?.default
        ? ctx.$slots?.default()
        : ''
      : ctx?.component
      ? [
          <TransitionCollapse appear={false}>{ctx.loading ? <XModalLoading /> : ''}</TransitionCollapse>,
          <TransitionCollapse appear={false}>{!ctx.loading && !!ctx.error ? <XModalError error={ctx.error} reload={ctx.reload} /> : ''}</TransitionCollapse>,
          <TransitionCollapse appear={false}>
            {!ctx.loading && !ctx.error ? <div class='tw-w-full tw-h-full'>{ctx.component_ ? h(ctx.component_, ctx.compProps) : ''}</div> : ''}
          </TransitionCollapse>
        ]
      : ctx.$slots?.default
      ? ctx.$slots?.default()
      : '';
    return (
      <Modal
        afterClose={ctx.afterClose}
        bodyStyle={ctx.options.bodyStyle}
        cancelText={ctx.options.cancelText}
        centered={ctx.options.centered}
        closable={ctx.options.closable}
        confirmLoading={ctx.options.confirmLoading}
        destroyOnClose={ctx.options.destroyOnClose}
        footer={ctx.options.footer}
        forceRender={ctx.options.forceRender}
        getContainer={ctx.options.getContainer}
        keyboard={ctx.options.keyboard}
        mask={ctx.options.mask}
        maskClosable={ctx.options.maskClosable}
        maskStyle={ctx.options.maskStyle}
        okText={ctx.options.okText}
        okType={ctx.options.okType}
        okButtonProps={ctx.options.okButtonProps}
        cancelButtonProps={ctx.options.cancelButtonProps}
        title={ctx.options.title}
        visible={ctx.visible_}
        width={ctx.options.width}
        wrapClassName={[SYMBOLS.BASE_CLASS, ctx.options?.fullscreen ? SYMBOLS.FULLSCREEN_CLASS : undefined, ctx.options?.wrapClassName ?? undefined]
          .filter(Boolean)
          .join(' ')}
        zIndex={ctx.options.zIndex}
        // dialogStyle={ctx.options.dialogStyle}
        // dialogClass={ctx.options.dialogClass}
        onCancel={ctx.onCancel}
        onOk={ctx.onOk}
        v-slots={{
          cancelText: () => (ctx.$slots?.cancelText ? ctx.$slots?.cancelText() : ''),
          closeIcon: () => (ctx.$slots?.closeIcon ? ctx.$slots?.closeIcon() : <IconCloseLine scale='1.2' />),
          footer: () => (ctx.$slots?.footer ? ctx.$slots?.footer() : ''),
          okText: () => (ctx.$slots?.okText ? ctx.$slots?.okText() : ''),
          title: () => (ctx.$slots?.title ? ctx.$slots?.title() : ''),
          default: () =>
            ctx.options.scrollX || ctx.options.scrollY ? (
              <ScrollView fillX fillY native scrollX={ctx.options.scrollX} scrollY={ctx.options.scrollY}>
                {content}
              </ScrollView>
            ) : (
              content
            )
        }}
      />
    );
  }
});

/**
 * 创建 Modal 弹出层实例
 * @param options XModal 选项
 * @param component 组件
 * @param compProps 组件 props
 */
export function createXModal<TProps extends Record<string, any>, TComponent extends any, TArgs extends any[]>(
  options: Partial<Omit<IXModalPropsType, 'component'>>,
  component?: AsyncComponentLoader<TComponent>,
  compProps?: TProps
): IXModalRefType<TProps, TArgs> {
  const handler: IXModalHandlers<TArgs> = {
    present: null,
    dismiss: null,
    loadComponent: null
  };

  // 代理异步函数
  const bindProperties: Array<keyof IXModalHandlers<TArgs>> = ['present', 'dismiss', 'loadComponent'];

  bindLazyFunc(handler, bindProperties as string[]);

  return {
    handler,
    component,
    compProps: reactive(compProps ?? {}),
    options: reactive(mergeWith({}, defaultXModalProps, options, (objVal, srcVal) => (isArray(objVal) ? srcVal : undefined)))
  } as any;
}
