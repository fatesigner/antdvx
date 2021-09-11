<template>
  <VEcharts
    ref="chartRef"
    :instance="instance"
    :options="options"
    :aspect-ratio="aspectRatio"
    :autoresize="autoresize"
    :width="width"
    :height="height"
    :empty="empty"
  >
    <template #loading>
      <ASpin :class="$style.loading" size="large" />
    </template>

    <template #error="{ error }">
      <div :class="$style.error">{{ error }}<XButtonRefresh class="tw-ml-2" :handler="refresh" only-icon color="primary" size="small" type="link" /></div>
    </template>

    <template #empty>
      <div :class="$style.empty">
        <AEmpty :image="simpleImage" />
      </div>
    </template>

    <template #default="{ loading }">
      <div class="tw-absolute tw-top-0 tw-left-0 tw-z-10" v-if="logo">
        <img width="100" height="50" src="@/assets/img/logo.png" alt="" title="" />
      </div>
      <div :class="$style.actions">
        <XButtonRefresh v-if="refreshable" :disabled="loading" class="tw-mr-2" color="primary" only-icon size="mini" type="link" :handler="refresh" />
        <XButtonExport :disabled="loading" size="small" placement="bottomRight" :options="exportOptions" />
      </div>
    </template>
  </VEcharts>
</template>

<script lang="ts">
import { Empty, Spin } from 'ant-design-vue';
import { PropType, defineComponent, ref } from 'vue';
import { EChartsOption, EChartsOptionPromise, EChartsType, IXButtonExportOptions, VEcharts, XButtonExport, XButtonRefresh } from '@/antdvx';

export default defineComponent({
  components: {
    VEcharts,
    XButtonExport,
    XButtonRefresh,
    [Spin.name]: Spin,
    [Empty.displayName]: Empty
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
    filename: {
      type: String
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
  setup(props) {
    const chartRef = ref(null);

    const exportOptions: IXButtonExportOptions = {
      async image() {
        return {
          filename: props.filename,
          target: chartRef.value?.getChartElement()
        };
      }
    };

    const refresh = async () => {
      if (chartRef.value) {
        return chartRef.value.refresh();
      }
    };

    return {
      chartRef,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      exportOptions,
      refresh
    };
  }
});
</script>

<style lang="less" module>
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
  right: 20px;
  z-index: 2;
  display: flex;
  justify-content: flex-end;
}
</style>

<style lang="less">
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
