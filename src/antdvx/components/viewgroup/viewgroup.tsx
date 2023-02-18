import {
  computed,
  defineComponent,
  getCurrentInstance,
  h,
  inject,
  KeepAlive,
  nextTick,
  onActivated,
  onDeactivated,
  onMounted,
  onUnmounted,
  PropType,
  provide,
  ref,
  shallowReactive,
  shallowRef,
  toRaw,
  watch
} from 'vue';
import { RouteLocationNormalizedLoaded, Router, useRoute, useRouter } from 'vue-router';
import { bindLazyFunc } from '@fatesigner/utils';
import { isArray, isFunction, isNullOrUndefined, isObject } from '@fatesigner/utils/type-check';
import { Component, ComponentPublicInstance } from '@vue/runtime-core';
import { mergeWith } from 'lodash-es';
import { Observable, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { TransitionOpacity, TransitionSlide } from '../transitions';

type PayloadType = any;

type NameType = number | string | symbol;

type HookType = () => void;

type ObservablePayloadType<T extends PayloadType = PayloadType> = { current: NameType; name: NameType; payload: T };

type HooksType<T extends PayloadType = PayloadType> = {
  /**
   * 注册一个回调函数，在组件需要更新时调用。
   * @param payload 参数
   * @returns
   */
  onUpdated?: (payload?: T) => void;
  /**
   * 注册一个回调函数，若组件实例是 <KeepAlive> 缓存树的一部分，当组件被插入到 DOM 中时调用。
   * @returns
   */
  onActivated?: HookType;
  /**
   * 注册一个回调函数，若组件实例是 <KeepAlive> 缓存树的一部分，当组件从 DOM 中被移除时调用。
   * @returns
   */
  onDeactivated?: HookType;
  /**
   * 注册一个回调函数，在组件实例被卸载之后调用。
   * @param hook 回调函数
   * @returns
   */
  onUnmounted?: HookType;
};

export interface IViewgroupItem<
  N extends NameType = NameType,
  T extends PayloadType = PayloadType,
  C extends Component = {
    new (): ComponentPublicInstance;
  }
> {
  /**
   * 视图名称
   */
  name: N;
  /**
   * 视图标签、描述
   */
  label?: string;
  /**
   * 视图动态切换时候是否缓存
   */
  keepAlive?: boolean;
  /**
   * 视图组件
   */
  component: C;
  /**
   * 传递至视图组件的 props
   */
  props?: T;
}

/**
 * 获取 ViewgroupItems 中 Name 的联合类型
 */
export type NamesTypeOfViewgroupItems<Items extends Readonly<IViewgroupItem[]>> = Items[number]['name'];

/**
 * ViewGroup 事件
 */
export interface IViewgroupListenersType {
  change?: (value: NameType) => void;
}

/**
 * ViewGroup 选项
 */
export interface IViewgroupOptions<
  Name extends NameType = NameType,
  Items extends IViewgroupItem<Name>[] = IViewgroupItem<Name>[]
> {
  /**
   * 启用视图切换时的动画效果
   */
  animation?: 'slide' | 'opacity';
  /**
   * 视图动态切换时候是否缓存
   */
  keepAlive?: boolean;
  /**
   * 路由参数
   */
  routeParamKey?: string;
  /**
   * 当前已激活的视图 name
   */
  value: Items[number]['name'];
  /**
   * 视图组件集合
   */
  items: Items;
  /**
   * 事件
   */
  listeners?: IViewgroupListenersType;
}

/**
 * ViewGroup Refrence
 */
export interface IViewgroupRef<Name extends NameType = NameType, Payload extends PayloadType = PayloadType> {
  /**
   * 指定待更新的视图，该视图将在下一次的 onMounted 或 onActivated 事件中触发，若不指定 name，则将所有视图都视为待更新
   * @param name 视图名
   * @param payload 传递的 data 参数
   * @returns
   */
  update: (name?: Name, payload?: Payload) => void;
}

const defaultOptions: IViewgroupOptions = {
  animation: undefined,
  keepAlive: false,
  routeParamKey: undefined,
  value: undefined,
  items: []
};

// 自动更新 history state
let timer;
const params = {};
const replaceView = function (
  router: Router,
  route: RouteLocationNormalizedLoaded,
  routeParamKey: string,
  value?: string
) {
  if (timer) {
    window.clearTimeout(timer);
    timer = null;
  }
  params[routeParamKey] = value;
  const no = parseInt(routeParamKey?.replace('p', ''));
  for (let i = no + 1; i < 12; i++) {
    params['p' + i] = null;
  }
  timer = setTimeout(function () {
    const params_ = Object.assign({}, route.params);
    Object.keys(params).forEach(function (key) {
      if (isNullOrUndefined(params[key])) {
        delete params_[key];
      } else {
        params_[key] = params[key];
      }
    });
    const { href, fullPath } = router.resolve({
      name: route.name,
      params: params_
    });
    window.history.replaceState(
      Object.assign(window.history.state, {
        current: fullPath,
        params: params_
      }),
      null,
      href
    );
    /* router.replace({
      name: route.name,
      params: params_
    }); */
  }, 100);
};

const updatedHookKey = Symbol.for('SubviewUpdatedHook');

/**
 * ViewGroup 视图容器
 */
export const Viewgroup = defineComponent({
  name: 'Viewgroup',
  props: {
    options: {
      type: Object as PropType<IViewgroupOptions>
    },
    // handler
    handler: {
      type: Object as PropType<IViewgroupRef>
    },
    animation: {
      type: String as PropType<IViewgroupOptions['animation']>
    },
    keepAlive: {
      type: Boolean,
      default: false
    },
    routeParamKey: String,
    value: [Number, String, Symbol] as PropType<IViewgroupItem['name']>,
    items: {
      type: Array as PropType<IViewgroupOptions['items']>,
      default() {
        return [];
      }
    }
  },
  emits: ['update:value', 'change'],
  setup(props, { emit, expose }) {
    const route = useRoute();
    const router = useRouter();

    const comp = shallowRef();
    const current = shallowRef();
    const value = ref(props.options?.items?.[0]?.name);
    const animation = computed(() => {
      return props.options?.animation;
    });
    const keepAlive = computed(() => {
      return props.options?.keepAlive;
    });

    if (!isNullOrUndefined(props.options?.routeParamKey)) {
      const _routeParamKey = route.params[props.options?.routeParamKey] as string;
      if (!isNullOrUndefined(_routeParamKey)) {
        value.value = _routeParamKey;
      }
    }

    const updateSubject = new ReplaySubject<ObservablePayloadType>(1);
    const updateObs$ = updateSubject.asObservable();

    provide(updatedHookKey, updateObs$);

    const toggle = (name: NameType) => {
      if (!isNullOrUndefined(name)) {
        let c = props.options?.items?.find((x) => x.name === name);
        if (!c) {
          c = props.options?.items?.[0];
        }

        if (c) {
          current.value = c;
          comp.value = toRaw(c.component);
          value.value = c.name;

          // 更新 route 参数
          if (!isNullOrUndefined(props.options?.routeParamKey)) {
            replaceView(router, route, props.options?.routeParamKey, value.value?.toString());
          }
        }
      }
      if (props.options?.value !== name) {
        emit('update:value', name);
        props.options.value = name;
      }
    };

    // 指定待更新的视图，该视图将在下一次的 onMounted 或 onActivated 事件中触发，若不指定 name，则将所有视图都视为待更新
    const update: IViewgroupRef['update'] = (name: NameType, payload: PayloadType) => {
      if (name) {
        if (value.value === name) {
          // 若指定的视图当前已激活，则直接触发
          updateSubject.next({ current: value.value, name, payload });
        } else {
          // 延迟触发
          updateSubject.next({ current: value.value, name, payload });
        }
      } else {
        props.options?.items?.forEach((x) => {
          update(x.name, payload);
        });
      }
    };

    watch(
      () => props.options?.value,
      (val) => {
        if (!isNullOrUndefined(val)) {
          if (value.value !== val) {
            value.value = val;
          }
        }
      },
      {
        immediate: true
      }
    );

    watch(
      () => props.options?.items,
      () => {
        toggle(value.value);
      }
    );

    watch(value, (val) => {
      toggle(val);
      nextTick(function () {
        emit('change', val);
        props.options?.listeners?.change(val);
      });
    });

    onMounted(() => {
      toggle(value.value);
    });

    /* onActivated(() => {
      toggle(value.value);
    }); */

    onDeactivated(() => {
      // 更新 route 参数
      if (!isNullOrUndefined(props.options?.routeParamKey)) {
        // replaceView(router, route, props.routeParamKey, null);
      }
    });

    /* onUnmounted(() => {
      // 更新 route 参数
      if (!isNullOrUndefined(props.routeParamKey)) {
        replaceView(router, route, props.routeParamKey, null);
      }
    }); */

    // 指定暴露到外部的函数
    expose({
      update
    });

    // update handlers
    if (props.handler) {
      Object.assign(props.handler, {
        update
      } as IViewgroupRef);
    }

    return {
      comp,
      current,
      value,
      animation,
      keepAlive,
      toggle
    };
  },
  render(ctx) {
    return ctx.current ? (
      ctx.$slots.default ? (
        ctx.$slots.default(ctx.current)
      ) : ctx.comp ? (
        ctx.keepAlive || !!ctx.current?.keepAlive ? (
          ctx.animation === 'slide' ? (
            <TransitionSlide>
              <KeepAlive>
                {h(ctx.comp, {
                  key: ctx.value,
                  ...ctx.current.props
                })}
              </KeepAlive>
            </TransitionSlide>
          ) : ctx.animation === 'opacity' ? (
            <TransitionOpacity>
              <KeepAlive>
                {h(ctx.comp, {
                  key: ctx.value,
                  ...ctx.current.props
                })}
              </KeepAlive>
            </TransitionOpacity>
          ) : (
            <KeepAlive>
              {h(ctx.comp, {
                key: ctx.value,
                ...ctx.current.props
              })}
            </KeepAlive>
          )
        ) : ctx.animation === 'slide' ? (
          <TransitionSlide>
            {h(ctx.comp, {
              key: ctx.value,
              ...ctx.current.props
            })}
          </TransitionSlide>
        ) : ctx.animation === 'opacity' ? (
          <TransitionOpacity>
            {h(ctx.comp, {
              key: ctx.value,
              ...ctx.current.props
            })}
          </TransitionOpacity>
        ) : (
          h(ctx.comp, {
            key: ctx.value,
            ...ctx.current.props
          })
        )
      ) : undefined
    ) : undefined;
  }
});

/**
 * 视图组件挂载完毕后执行函数的钩子。
 * @param hooks 回调函数
 */
export function useViewgroupMount<T extends PayloadType = PayloadType>(hooks: () => void | HookType | HooksType<T>) {
  const currentInstance = getCurrentInstance();
  const name = currentInstance.vnode.key;
  const hooks_: HooksType<T> = {};
  const subscriptions = [];

  const updateObs$ = inject<Observable<ObservablePayloadType<T>>>(updatedHookKey);

  // 暂存状态
  const stage = {
    updated: false,
    payload: undefined
  };

  onMounted(() => {
    const res = hooks();
    if (res) {
      if (isObject(res)) {
        if ((res as any).onUpdated) {
          hooks_.onUpdated = (res as any).onUpdated;
          const sub = updateObs$.pipe(filter((x) => x.name === name)).subscribe(({ current, payload }) => {
            if (current === name) {
              hooks_.onUpdated(payload);
            } else {
              stage.updated = true;
              stage.payload = payload;
            }
          });
          subscriptions.push(sub);
        } else if ((res as any).onUnmounted) {
          hooks_.onUnmounted = (res as any).onUnmounted;
        } else if ((res as any).onActivated) {
          hooks_.onActivated = (res as any).onActivated;
        } else if ((res as any).onDeactivated) {
          hooks_.onDeactivated = (res as any).onDeactivated;
        }
      } else if (isFunction(res)) {
        hooks_.onUnmounted = res as HookType;
      }
    }
  });

  onActivated(() => {
    hooks_.onActivated?.();
    if (stage.updated) {
      stage.updated = false;
      hooks_.onUpdated?.(stage.payload);
    }
  });

  onDeactivated(() => {
    hooks_.onDeactivated?.();
  });

  onUnmounted(() => {
    // 取消已订阅的事件
    subscriptions.forEach((sub) => {
      sub?.unsubscribe?.();
    });
    hooks_.onUnmounted?.();
  });
}

/**
 * 创建一个视图容器
 * @param options
 * @returns
 */
export function useViewgroup<
  Payload extends PayloadType,
  Name extends NameType = NameType,
  Items extends IViewgroupItem<Name>[] = IViewgroupItem<Name>[]
>(
  options: IViewgroupOptions<Name, Items>
): {
  options: IViewgroupOptions<Name, Items>;
  handler: IViewgroupRef<Name, Payload>;
} {
  const handler: IViewgroupRef<Name, Payload> = {
    update: null
  };

  // 代理异步函数
  const bindProperties: Array<keyof IViewgroupRef<Name, Payload>> = ['update'];

  bindLazyFunc(handler, bindProperties);

  return {
    options: shallowReactive(
      mergeWith({}, defaultOptions, options, (objVal, srcVal) => (isArray(objVal) ? srcVal : undefined)) as any
    ),
    handler
  };
}
