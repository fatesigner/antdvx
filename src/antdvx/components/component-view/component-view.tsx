import { isNullOrUndefined } from '@fatesigner/utils/type-check';
import { Component, ComponentPublicInstance } from '@vue/runtime-core';
import { RouteLocationNormalizedLoaded, Router, useRoute, useRouter } from 'vue-router';
import { KeepAlive, PropType, defineComponent, h, onActivated, onMounted, onUnmounted, ref, shallowRef, toRaw, watch } from 'vue';

import { TransitionCollapse, TransitionOpacity, TransitionSlide } from '../transitions';

export interface IComponentViewItem<
  T extends Component = {
    new (): ComponentPublicInstance;
  }
> {
  name: string;
  label?: string;
  keepAlive?: boolean;
  component: T;
  props?: Record<string, any>;
}

let timer;
const params = {};
const replaceView = function (router: Router, route: RouteLocationNormalizedLoaded, routeParamKey: string, value?: string) {
  if (timer) {
    window.clearTimeout(timer);
    timer = null;
  }
  params[routeParamKey] = value;
  timer = setTimeout(function () {
    const params_ = Object.assign({}, route.params);
    Object.keys(params).forEach(function (key) {
      if (isNullOrUndefined(params[key])) {
        delete params_[key];
      } else {
        params_[key] = params[key];
      }
    });
    router.replace({
      name: route.name,
      params: params_
    });
  }, 100);
};

/**
 * 组件视图
 */
export const ComponentView = defineComponent({
  name: 'component-view',
  props: {
    animation: {
      type: String as PropType<'horizontal' | 'opacity' | 'slide'>,
      default: 'slide'
    },
    keepAlive: {
      type: Boolean,
      default: false
    },
    activeKey: [Number, String] as PropType<number | string>,
    routeParamKey: String,
    comps: {
      type: Array as PropType<IComponentViewItem[]>,
      default() {
        return [];
      }
    }
  },
  emits: ['update:active-key'],
  setup(props: any, { emit }) {
    const route = useRoute();
    const router = useRouter();

    const current = shallowRef();

    const activeKey_ = ref<string>(props.comps?.[0]?.name);

    if (!isNullOrUndefined(props.routeParamKey)) {
      const _routeParamKey = route.params[props.routeParamKey] as string;
      if (!isNullOrUndefined(_routeParamKey)) {
        activeKey_.value = _routeParamKey;
      }
    }

    const toggle = (key: number | string) => {
      if (!isNullOrUndefined(key)) {
        let c = props.comps?.find((x) => x.name === key);
        if (!c) {
          c = props.comps?.[0];
        }

        current.value = toRaw(c);
        activeKey_.value = c.name;

        // 更新 route 参数
        if (!isNullOrUndefined(props.routeParamKey)) {
          replaceView(router, route, props.routeParamKey, activeKey_.value);
        }
      }
      if (props.activeKey !== key) {
        emit('update:active-key', key);
      }
    };

    watch(
      () => props.activeKey,
      (val) => {
        if (!isNullOrUndefined(val)) {
          if (activeKey_.value !== val) {
            activeKey_.value = val;
          }
        }
      },
      {
        immediate: true
      }
    );

    watch(activeKey_, (val) => {
      toggle(val);
    });

    onMounted(() => {
      toggle(activeKey_.value);
    });

    onActivated(() => {
      toggle(activeKey_.value);
    });

    onUnmounted(() => {
      // 更新 route 参数
      if (!isNullOrUndefined(props.routeParamKey)) {
        replaceView(router, route, props.routeParamKey, null);
      }
    });

    return {
      current,
      toggle
    };
  },
  render(ctx) {
    return ctx.current ? (
      ctx.$slots.default ? (
        ctx.$slots.default(ctx.current)
      ) : ctx.current?.component ? (
        ctx.keepAlive || !!ctx.current?.keepAlive ? (
          ctx.animation === 'slide' ? (
            <TransitionSlide mode='out-in'>
              <KeepAlive>{h(ctx.current.component, ctx.current.props)}</KeepAlive>
            </TransitionSlide>
          ) : ctx.animation === 'opacity' ? (
            <TransitionOpacity mode='out-in'>
              <KeepAlive>{h(ctx.current.component, ctx.current.props)}</KeepAlive>
            </TransitionOpacity>
          ) : (
            <KeepAlive>{h(ctx.current.component, ctx.current.props)}</KeepAlive>
          )
        ) : ctx.animation === 'slide' ? (
          <TransitionSlide mode='out-in'>{h(ctx.current.component, ctx.current.props)}</TransitionSlide>
        ) : ctx.animation === 'opacity' ? (
          <TransitionOpacity mode='out-in'>{h(ctx.current.component, ctx.current.props)}</TransitionOpacity>
        ) : (
          h(ctx.current.component, ctx.current.props)
        )
      ) : (
        ''
      )
    ) : (
      ''
    );
  }
});
