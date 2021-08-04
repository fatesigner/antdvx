<template>
  <v-echarts
    ref="chart"
    :instance="instance"
    :options="options"
    :aspect-ratio="aspectRatio"
    :autoresize="autoresize"
    :width="width"
    :height="height"
    :empty="empty"
  >
    <template #loading>
      <a-spin :class="$style.loading" size="large" />
    </template>

    <template #error="{ error }">
      <div :class="$style.error">{{ error }}<ActionRefresh :handler="refresh" size="small" /></div>
    </template>

    <template #empty>
      <div :class="$style.empty">
        <empty />
      </div>
    </template>

    <template #default="{ loading }">
      <div class="tw-absolute tw-top-0 tw-left-0 tw-z-10" v-if="logo">
        <img width="100" height="50" src="@/assets/img/logo.png" alt="" title="" />
      </div>
      <div :class="$style.actions">
        <ActionRefresh v-if="refreshable" :disabled="loading" class="tw-mr-2" size="small" :handler="refresh" />
        <ActionExport :disabled="loading" size="small" placement="bottomRight" filename="Selected Alpha Group" :target="getTarget" />
      </div>
    </template>
  </v-echarts>
</template>

<script lang="ts">
import { Empty, Spin } from 'ant-design-vue';
import { PropType, defineComponent, ref } from 'vue';
import { IconRedo, IconSync } from 'antdvx/components/iconfont';
import { ActionExport, ActionRefresh } from 'antdvx/components/action-bars';
import { EChartsOption, EChartsOptionPromise, EChartsType, VEcharts } from 'antdvx/components/echarts';

export default defineComponent({
  components: {
    ActionExport,
    ActionRefresh,
    VEcharts,
    // Antd
    [Empty.name]: Empty,
    [Spin.name]: Spin,
    IconRedo,
    IconSync
  },
  props: {
    logo: {
      type: Boolean,
      default: false
    },
    instance: {
      type: Object as PropType<EChartsType>,
      default: null
    },
    options: {
      type: [Object, Function] as PropType<EChartsOption | EChartsOptionPromise>,
      default: () => []
    },
    aspectRatio: {
      type: [Number, String],
      default: null
    },
    width: {
      type: [Number, String],
      default: null
    },
    height: {
      type: [Number, String],
      default: null
    },
    autoresize: {
      type: Boolean,
      default: true
    },
    empty: {
      type: Boolean,
      default: false
    },
    refreshable: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    const $chart = ref(null);

    const getTarget = (): HTMLElement => {
      return $chart.value.getChartElement();
    };

    const refresh = async () => {
      if ($chart.value) {
        return $chart.value.refresh();
      }
    };

    return {
      chart: $chart,
      getTarget,
      refresh
    };
  }
});
</script>

<style lang="scss" module>
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 2;
  transform: translate3d(-50%, -50%, 0);
}

.error {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;
  color: #b02e2e;
  white-space: nowrap;
  transform: translate3d(-50%, -50%, 0);
}

.empty {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;
  transform: translate3d(-50%, -50%, 0);
}

.actions {
  position: absolute;
  right: 0;
  z-index: 2;
  display: flex;
  justify-content: flex-end;
}
</style>

<style lang="scss">
.chart-empty-enter-active,
.chart-empty-leave-to {
  opacity: 0;
  transition: opacity 32s;

  :deep(.ant-empty) {
    transition: transform 32s ease-in-out;
    transform: scale(0.68);
  }
}

.chart-empty-leave-active,
.chart-empty-enter-to {
  opacity: 1;

  :deep(.ant-empty) {
    transform: scale(1);
  }
}
</style>
