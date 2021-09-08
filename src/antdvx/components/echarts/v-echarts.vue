<template>
  <div ref="wrap" :class="$style.wrap" :style="styles">
    <transition-group name="v-echarts-transition">
      <div :class="$style.transition" key="loading" v-if="loading">
        <slot name="loading" v-bind="{ refresh }" />
      </div>
      <div :class="$style.transition" key="error" v-else-if="error">
        <slot name="error" v-bind="{ error, refresh }" />
      </div>
      <div :class="$style.transition" key="empty" v-else-if="empty">
        <slot name="empty" v-bind="{ refresh }" />
      </div>
    </transition-group>

    <template v-if="initialized">
      <slot name="default" v-bind="{ loading, refresh }" />
    </template>

    <div ref="chart" :class="[$style.container, empty || !options_ ? $style.empty : '']" @touchstart="touchstart" />
  </div>
</template>

<script lang="ts">
import to from 'await-to-js';
import { debounce } from '@fatesigner/utils';
import { isFunction } from '@fatesigner/utils/type-check';
import { PropType, computed, defineComponent, onActivated, onDeactivated, onMounted, onUnmounted, ref, watch } from 'vue';

import { EChartsOption, EChartsOptionPromise, EChartsType, LocaleOption, RendererType, createEcharts } from './echarts';

const elementResizeDetectorMaker = require('element-resize-detector');

const erd = elementResizeDetectorMaker();

export default defineComponent({
  name: 'VEcharts',
  props: {
    theme: {
      type: String,
      default: null
    },
    devicePixelRatio: {
      type: Number,
      default: null
    },
    renderer: {
      type: Object as PropType<RendererType>,
      default: null
    },
    useDirtyRect: {
      type: Boolean,
      default: true
    },
    locale: {
      type: String as PropType<string | LocaleOption>,
      default: null
    },
    /*requires: {
      type: Array as PropType<EchartsSeriesType>,
      default: () => []
    },*/
    instance: {
      type: Object as PropType<EChartsType>,
      default: null
    },
    options: {
      type: [Object, Function] as PropType<EChartsOption | EChartsOptionPromise>,
      default: null
    },
    aspectRatio: {
      type: [Number, String],
      default: null
    },
    width: {
      type: [Number, String] as PropType<number | 'auto'>,
      default: null
    },
    height: {
      type: [Number, String] as PropType<number | 'auto'>,
      default: null
    },
    autoresize: {
      type: Boolean,
      default: true
    },
    empty: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const options = ref<EChartsOption>(null);
    const $wrap = ref(null);
    const $chart = ref(null);
    const loading = ref(false);
    const initialized = ref(false);
    const error = ref<Error>(null);

    let instance;

    const styles = computed(() => {
      if (props.aspectRatio) {
        return {
          width: '100%',
          'padding-bottom': 100 / (props.aspectRatio as any) + '%'
        };
      } else {
        return {
          width: props.width ? props.width + 'px' : null,
          height: props.height ? props.height + 'px' : null
        };
      }
    });

    const touchstart = (e) => {
      emit('touchstart', e);
    };

    const resize = debounce(
      () => {
        if (instance) {
          if (props.aspectRatio) {
            instance.resize();
          } else {
            instance.resize({ width: props.width, height: props.height });
          }
        }
      },
      300,
      false
    );

    const resizer = (function () {
      let listened = false;
      return {
        start() {
          // 监听窗口尺寸变化，重新渲染图表
          if (!listened && props.autoresize && $wrap.value) {
            erd.listenTo($wrap.value, resize);
            listened = true;
          }
        },
        stop() {
          // 移除窗口尺寸的监听
          if (listened && $wrap.value) {
            erd.removeListener($wrap.value, resize);
            listened = false;
          }
        }
      };
    })();

    const initialize = async () => {
      loading.value = true;

      instance = await createEcharts($chart.value, [], props.theme, {
        devicePixelRatio: props.devicePixelRatio,
        renderer: props.renderer,
        useDirtyRect: props.useDirtyRect,
        width: props.width,
        height: props.height,
        locale: props.locale
      });

      await setOption();

      loading.value = false;
      initialized.value = true;

      // 往外传递实例对象
      emit('update:instance', instance);
    };

    const setOption = async () => {
      loading.value = true;

      // 若提供的 options 参数为函数，异步获取 options
      if (isFunction(props.options)) {
        const [err, r] = await to((props.options as EChartsOptionPromise)());
        if (err) {
          error.value = err;
        } else {
          // await analyseImport(r);
          options.value = r;
          error.value = null;
        }
      } else {
        options.value = props.options as any;
      }
      if (options.value) {
        instance.clear();
        instance.setOption(options.value);
      }

      loading.value = false;
    };

    watch(
      () => props.options,
      async () => {
        if (instance) {
          await setOption();
          resize();
        }
      }
    );

    onMounted(() => {
      initialize().then(() => {
        resizer.start();
      });
    });

    onActivated(() => {
      resizer.start();
      if ($chart.value && $chart.value.style.position === 'relative') {
        // Reload chart
        $chart.value.style.position = '';
        console.log('initialize');
        initialize();
      }
    });

    onDeactivated(() => {
      resizer.stop();
    });

    onUnmounted(() => {
      resizer.stop();
    });

    const getChartElement = () => {
      return $chart.value;
    };

    return {
      wrap: $wrap,
      chart: $chart,
      styles,
      options_: options,
      loading,
      initialized,
      error,
      resize,
      refresh: setOption,
      getChartElement,
      touchstart
    };
  }
});
</script>

<style lang="less" module>
.wrap {
  position: relative;
}

.container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.transition {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;
  transform: translate3d(-50%, -50%, 0);
}
</style>

<style lang="less">
.v-echarts-transition-enter-from {
  opacity: 0;
  transform: translate3d(-50%, -50%, 0) scale(0.7);
}

.v-echarts-transition-enter-to {
  opacity: 1;
  transform: translate3d(-50%, -50%, 0) scale(1);
}

.v-echarts-transition-leave-to {
  opacity: 0;
  transform: translate3d(-50%, -50%, 0) scale(0.6);
}

.v-echarts-transition-enter-active,
.v-echarts-transition-leave-active {
  transition-timing-function: ease-in-out;
  transition-duration: 0.2s;
}
</style>
