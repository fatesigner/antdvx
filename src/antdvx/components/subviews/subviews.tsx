import { isNullOrUndefined } from '@fatesigner/utils/type-check';
import { Component, ComponentPublicInstance } from '@vue/runtime-core';
import { RouteLocationNormalizedLoaded, Router, useRoute, useRouter } from 'vue-router';
import { KeepAlive, PropType, defineComponent, h, onActivated, onDeactivated, onMounted, ref, shallowRef, toRaw, watch } from 'vue';

import { TransitionOpacity, TransitionSlide } from '../transitions';

export interface ISubviewsItem<
  T extends Component = {
    new (): ComponentPublicInstance;
  }
> {
  /**
   * 视图名称
   */
  name: number | string;
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
  component: T;
  /**
   * 视图组件的 props
   */
  props?: Record<string, any>;
}

/**
 * 子视图选项
 */
export interface ISubviewsOptions {
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
   * 当前已激活显示激活的的视图名称
   */
  value: string;
  /**
   * 视图组件集合
   */
  data: ISubviewsItem[];
}

// 自动更新 history state
let timer;
const params = {};
const replaceView = function (router: Router, route: RouteLocationNormalizedLoaded, routeParamKey: string, value?: string) {
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

/**
 * 子视图动态切换器
 */
export const Subviews = defineComponent({
  name: 'Subviews',
  props: {
    animation: {
      type: String as PropType<ISubviewsOptions['animation']>
    },
    keepAlive: {
      type: Boolean,
      default: false
    },
    routeParamKey: String,
    value: [Number, String] as PropType<ISubviewsItem['name']>,
    data: {
      type: Array as PropType<ISubviewsOptions['data']>,
      default() {
        return [];
      }
    }
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const route = useRoute();
    const router = useRouter();

    const comp = shallowRef();
    const current = shallowRef();

    const value_ = ref(props.data?.[0]?.name);

    if (!isNullOrUndefined(props.routeParamKey)) {
      const _routeParamKey = route.params[props.routeParamKey] as string;
      if (!isNullOrUndefined(_routeParamKey)) {
        value_.value = _routeParamKey;
      }
    }

    const toggle = (key: number | string) => {
      if (!isNullOrUndefined(key)) {
        let c = props.data?.find((x) => x.name === key);
        if (!c) {
          c = props.data?.[0];
        }

        if (c) {
          current.value = c;
          comp.value = toRaw(c.component);
          value_.value = c.name;

          // 更新 route 参数
          if (!isNullOrUndefined(props.routeParamKey)) {
            replaceView(router, route, props.routeParamKey, value_.value?.toString());
          }
        }
      }
      if (props.value !== key) {
        emit('update:value', key);
      }
    };

    watch(
      () => props.value,
      (val) => {
        if (!isNullOrUndefined(val)) {
          if (value_.value !== val) {
            value_.value = val;
          }
        }
      },
      {
        immediate: true
      }
    );

    watch(
      () => props.data,
      () => {
        toggle(value_.value);
      }
    );

    watch(value_, (val) => {
      toggle(val);
    });

    onMounted(() => {
      toggle(value_.value);
    });

    onActivated(() => {
      toggle(value_.value);
    });

    onDeactivated(() => {
      // 更新 route 参数
      if (!isNullOrUndefined(props.routeParamKey)) {
        // replaceView(router, route, props.routeParamKey, null);
      }
    });

    /* onUnmounted(() => {
      // 更新 route 参数
      if (!isNullOrUndefined(props.routeParamKey)) {
        replaceView(router, route, props.routeParamKey, null);
      }
    }); */

    return {
      comp,
      current,
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
              <KeepAlive>{h(ctx.comp, ctx.current.props)}</KeepAlive>
            </TransitionSlide>
          ) : ctx.animation === 'opacity' ? (
            <TransitionOpacity>
              <KeepAlive>{h(ctx.comp, ctx.current.props)}</KeepAlive>
            </TransitionOpacity>
          ) : (
            <KeepAlive>{h(ctx.comp, ctx.current.props)}</KeepAlive>
          )
        ) : ctx.animation === 'slide' ? (
          <TransitionSlide>{h(ctx.comp, ctx.current.props)}</TransitionSlide>
        ) : ctx.animation === 'opacity' ? (
          <TransitionOpacity>{h(ctx.comp, ctx.current.props)}</TransitionOpacity>
        ) : (
          h(ctx.comp, ctx.current.props)
        )
      ) : undefined
    ) : undefined;
  }
});
