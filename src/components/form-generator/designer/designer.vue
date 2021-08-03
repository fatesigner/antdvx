<template>
  <div class="tw-flex tw-h-full">
    <div class="tw-flex-initial tw-w-64 tw-h-full">
      <WidgetPanes />
    </div>
    <div class="tw-flex-1 tw-overflow-hidden" :class="$style.center">
      <div class="tw-flex tw-w-full tw-h-full tw-flex-col">
        <div class="tw-flex-initial tw-w-full" :class="$style.header">
          <WidgetActions :binds="binds" />
        </div>
        <div class="tw-flex-1 tw-overflow-hidden">
          <WidgetForm :binds="binds" @activatedChange="onFieldActivatedChange" />
        </div>
      </div>
    </div>
    <div class="tw-flex-initial tw-w-72 tw-h-full tw-overflow-hidden">
      <WidgetSettings :binds="binds" :widget="selectedWidget" />
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent, reactive, ref, watch } from 'vue';

import { ScrollView } from '../../scroll-view';

import { IFormDesignerBinds, IFormGeneratorData } from '../config';

import { FormDesignerConfig, analyzeFormDesignerJsonData, getFormDesignerJsonData } from './designer';

import WidgetForm from './form.vue';
import WidgetPanes from './panes.vue';
import WidgetActions from './actions.vue';
import WidgetSettings from './settings.vue';

export default defineComponent({
  name: 'antd-form-designer',
  components: {
    ScrollView,
    WidgetPanes,
    WidgetActions,
    WidgetForm,
    WidgetSettings
  },
  props: {
    data: {
      type: Object as PropType<IFormGeneratorData>,
      default: null
    }
  },
  setup(props: any) {
    const selectedWidget = ref<any>(null);
    const binds = reactive<IFormDesignerBinds>({
      schema: {
        name: null,
        description: null
      },
      widgets: [],
      settings: FormDesignerConfig.settings
    });

    watch(
      () => props.data,
      (val) => {
        analyzeFormDesignerJsonData(val, binds);
      },
      {
        immediate: true
      }
    );

    // 选中的字段
    const onFieldActivatedChange = (e) => {
      selectedWidget.value = e;
    };

    const getData = async () => {
      return await getFormDesignerJsonData(binds);
    };

    return {
      binds,
      selectedWidget,
      getData,
      onFieldActivatedChange
    };
  }
});
</script>

<style lang="scss" module>
.center {
  border-right: 1px solid #e0e0e0;
  border-left: 1px solid #e0e0e0;
}

.header {
  border-bottom: 2px solid #e4e7ed;
}
</style>
