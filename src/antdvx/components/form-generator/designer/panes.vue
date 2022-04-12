<template>
  <ScrollView fill-y scroll-y>
    <ACollapse class="ant-collapse-pure" v-model:activeKey="collapseKey" :bordered="false">
      <ACollapsePanel v-for="item in widgetsGrouped" :key="item.label" :header="item.label">
        <Draggable
          class="tw-grid tw-grid-cols-2 tw-gap-2"
          item-key="type"
          :sort="false"
          :list="item.widgets"
          :group="{ name: group, pull: 'clone', put: false }"
          :clone="clone"
        >
          <template #item="{ element }">
            <div :class="$style.widget">
              {{ element.label }}
            </div>
          </template>
        </Draggable>
      </ACollapsePanel>
    </ACollapse>
  </ScrollView>
</template>

<script lang="ts">
import Draggable from 'vuedraggable';
import { cloneDeep } from 'lodash-es';
import { Collapse } from 'ant-design-vue';
import { defineComponent, ref } from 'vue';
import { groupBy } from '@fatesigner/utils';

import { ScrollView } from '../../scroll-view';

import { FORM_DESIGNER_SYMBOLS } from '../symbols';
import { IFormDesignerBinds, IFormDesignerWidget, widgetClassifyDesc } from '../config';

import { FormDesignerConfig, getFiledObject } from './designer';

export default defineComponent({
  components: {
    Draggable,
    ScrollView,
    [Collapse.name]: Collapse,
    [Collapse.Panel.name]: Collapse.Panel
  },
  setup() {
    const group = FORM_DESIGNER_SYMBOLS.DRAGGABLE_GROUP;

    const widgetsGrouped = groupBy(FormDesignerConfig.widgets, 'group').map((x) => {
      return {
        label: widgetClassifyDesc[x.key],
        widgets: x.children
      };
    });

    const collapseKey = ref(widgetsGrouped.map((x) => x.label));

    const clone = (widget: IFormDesignerWidget) => {
      const widgetClone = cloneDeep(widget) as IFormDesignerBinds['widgets'][number];
      widgetClone.key = FormDesignerConfig.name();
      widgetClone.field = getFiledObject(widget);
      widgetClone.field.name = widgetClone.key;
      widgetClone.field.label = widget.label;
      return widgetClone;
    };

    return {
      group,
      widgetsGrouped,
      collapseKey,
      clone
    };
  }
});
</script>

<style lang="less" module>
.title {
  font-size: 14px;
  color: #333;
}

.widget {
  padding: 2px 5px;
  color: #333;
  cursor: move;
  background: #f4f6fc;
  border: 1px solid #f4f6fc;

  &:hover {
    color: #409eff;
    border: 1px dashed #409eff;
  }
}
</style>
