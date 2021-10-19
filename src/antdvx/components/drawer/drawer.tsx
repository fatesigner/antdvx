import to from 'await-to-js';
import { timer } from 'rxjs';
import { merge } from 'lodash-es';
import { Alert, Drawer } from 'ant-design-vue';
import { bindLazyFunc } from '@fatesigner/utils';
import { AsyncComponentLoader } from '@vue/runtime-core';
import { PropType, defineComponent, h, reactive, ref, shallowRef } from 'vue';

import { XButtonRefresh } from '../button';
import { SpinnerLoading } from '../loading';
import { ScrollView } from '../scroll-view';
import { TransitionOpacity, TransitionZoom } from '../transitions';

import { IXDrawerHandlers, IXDrawerPropsType, IXDrawerRefType } from './types';

const SYMBOLS = {
  BASE_CLASS: 'ant-drawer-x',
  FULLSCREEN_CLASS: 'ant-drawer-x-fullscreen'
};

const defaultXDrawerProps: Partial<IXDrawerPropsType> = {
  // Custom
  fullscreen: false
};

const XDrawerLoading = defineComponent({
  name: 'x-modal-loading',
  render() {
    return (
      <div class='tw-p-4'>
        <SpinnerLoading class='tw-align-top' />
      </div>
    );
  }
});

const XDrawerError = defineComponent({
  name: 'x-modal-error',
  props: {
    error: String,
    reload: Function
  },
  render(ctx) {
    return (
      <div class='tw-p-4'>
        <Alert
          type='error'
          show-icon
          v-slots={{
            message: () => [ctx.error, <XButtonRefresh only-icon color='primary' size='small' type='link' handler={ctx.reload} />]
          }}
        />
      </div>
    );
  }
});

/**
 * Drawer 抽屉层，基于 AntDrawer
 */
export const XDrawer = defineComponent({
  name: 'x-drawer',
  props: {
    options: {
      type: Object as PropType<IXDrawerPropsType>,
      default() {
        return defaultXDrawerProps;
      }
    },
    component: Function,
    compProps: {
      type: Object
    },
    handler: {
      type: Object as PropType<IXDrawerHandlers<any>>
    }
  },
  setup(props: any) {
    let hooks: ((...args: any[]) => void)[] = [];

    const error = ref();
    const loading = ref(false);
    const visible_ = ref(false);
    const component_ = shallowRef();

    const afterVisibleChange = (visible) => {
      // If keepAlive is false, then destroy it
      if (visible) {
        // Emit presented event
        props?.options?.onPresented?.();
      } else {
        // Emit dismissed event
        props?.options?.onDismissed?.();
      }
    };

    let loadComponentTimer;
    const loadComponent: IXDrawerHandlers<any>['loadComponent'] = async (loader) => {
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

    const present: IXDrawerHandlers<any>['present'] = async (onDismissed) => {
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

    const dismiss: IXDrawerHandlers<any>['dismiss'] = async (...args: any[]) => {
      visible_.value = false;
      timer(1000)
        .toPromise()
        .finally(() => {
          // Emit dismissed event
          props?.options?.onDismissed?.();
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

    const onClose = (e) => {
      (dismiss as any)();
      props?.options?.onClose?.(e);
    };

    // update handlers
    if (props.handler) {
      Object.assign(props.handler, {
        present,
        dismiss,
        loadComponent
      } as IXDrawerHandlers<any>);
    }

    return { error, loading, visible_, component_, afterVisibleChange, loadComponent, reload, present, dismiss, onClose };
  },
  render(ctx) {
    const content = ctx?.component
      ? [
          <TransitionZoom>{ctx.loading ? <XDrawerLoading /> : ''}</TransitionZoom>,
          <TransitionZoom>{!ctx.loading && !!ctx.error ? <XDrawerError error={ctx.error} reload={ctx.reload} /> : ''}</TransitionZoom>,
          <TransitionOpacity>{!ctx.loading && !ctx.error ? (ctx.component_ ? h(ctx.component_, ctx.compProps) : '') : ''}</TransitionOpacity>
        ]
      : ctx.$slots?.default
      ? ctx.$slots?.default()
      : '';
    return (
      <Drawer
        closable={ctx.options.closable}
        destroyOnClose={ctx.options.destroyOnClose}
        getContainer={ctx.options.getContainer}
        mask={ctx.options.mask}
        maskClosable={ctx.options.maskClosable}
        maskStyle={ctx.options.maskStyle}
        title={ctx.options.title}
        visible={ctx.visible_}
        wrapClassName={[SYMBOLS.BASE_CLASS, ctx.options?.fullscreen ? SYMBOLS.FULLSCREEN_CLASS : undefined, ctx.options?.wrapClassName ?? undefined]
          .filter(Boolean)
          .join(' ')}
        wrapStyle={ctx.options.wrapStyle}
        drawerStyle={ctx.options.drawerStyle}
        headerStyle={ctx.options.headerStyle}
        bodyStyle={ctx.options.bodyStyle}
        width={ctx.options.width}
        height={ctx.options.height}
        zIndex={ctx.options.zIndex}
        placement={ctx.options.placement}
        handle={ctx.options.handle}
        afterVisibleChange={ctx.afterVisibleChange}
        keyboard={ctx.options.keyboard}
        onClose={ctx.onClose}
        v-slots={{
          title: () => (ctx.$slots?.title ? ctx.$slots?.title() : ''),
          handle: () => (ctx.$slots?.handle ? ctx.$slots?.handle() : ''),
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
 * 创建 Drawer 抽屉层实例
 * @param options XDrawer 选项
 * @param component 组件
 * @param compProps 组件 props
 */
export function createXDrawer<TProps extends Record<string, any>, TComponent extends any, TArgs extends any[]>(
  options: Partial<Omit<IXDrawerPropsType, 'component'>>,
  component?: AsyncComponentLoader<TComponent>,
  compProps?: TProps
): IXDrawerRefType<TProps, TArgs> {
  const handler: IXDrawerHandlers<TArgs> = {
    present: null,
    dismiss: null,
    loadComponent: null
  };

  // 代理异步函数
  const bindProperties: Array<keyof IXDrawerHandlers<TArgs>> = ['present', 'dismiss', 'loadComponent'];

  bindLazyFunc(handler, bindProperties as string[]);

  return {
    handler,
    component,
    compProps: reactive(compProps ?? {}),
    options: reactive(merge({}, defaultXDrawerProps, options))
  } as any;
}
