<template>
  <div class="tw-flex tw-h-full tw-flex-col">
    <div class="tw-flex-initial tw-w-full" :class="$style.header">
      <XTabs underline transitional :options="tabOptions" v-model:value="activeKey">
        <template #item="{ item }">
          <div :class="$style.tab">{{ item.label }}</div>
        </template>
      </XTabs>
    </div>
    <div class="tw-flex-1 tw-overflow-hidden">
      <ScrollView v-show="activeKey === 'field'">
        <ACollapse class="form-designer-collapse" v-model:activeKey="collapseKey" :bordered="false">
          <ACollapsePanel v-for="group in attributesGrouped" :key="group.label" :header="group.label">
            <AForm class="tw-space-y-4" layout="vertical">
              <section v-for="attr in group.attributes">
                <Component :key="widget_.key" :is="getAttrComp(attr.component)" :field="widget_.field" :binds="binds" />
              </section>
            </AForm>
          </ACollapsePanel>
        </ACollapse>
        <!--        <div class="tw-pt-2 tw-pr-4 tw-pb-2 tw-pl-2">
          <AForm layout="vertical" v-if="widget_">
            <template v-for="attr in widget_.attributes">
              <Component :is="getAttrComp(attr.comp)" :field="widget.field" :settings="binds.settings" />
            </template>
          </AForm>
        </div>-->
      </ScrollView>
      <ScrollView v-show="activeKey === 'form'">
        <div class="tw-pt-2 tw-pr-4 tw-pb-2 tw-pl-2">
          <AForm layout="vertical">
            <AFormItem label="标题">
              <AInput v-model:value="binds.schema.name" />
            </AFormItem>
            <AFormItem label="描述">
              <ATextarea v-model:value="binds.schema.description" />
            </AFormItem>
            <AFormItem label="布局">
              <ARadioGroup v-model:value="binds.settings.layout" :options="layoutOptions" />
            </AFormItem>
            <AFormItem label="标签对齐方式">
              <ARadioGroup v-model:value="binds.settings.labelAlign" :options="labelAlignOptions" />
            </AFormItem>
            <AFormItem label="控件尺寸">
              <ARadioGroup v-model:value="binds.settings.size" :options="sizeOptions" />
            </AFormItem>
            <AFormItem label="标签栅格布局">
              <div class="tw-flex tw-w-full tw-items-center">
                <div class="tw-flex-1"><span class="tw-mr-2">span</span><AInputNumber v-model:value="binds.settings.labelCol.span" /></div>
                <div class="tw-flex-1"><span class="tw-mr-2">offset</span><AInputNumber v-model:value="binds.settings.labelCol.offset" /></div>
              </div>
            </AFormItem>
          </AForm>
        </div>
      </ScrollView>
    </div>
  </div>
</template>

<script lang="ts">
import { groupBy } from '@fatesigner/utils';
import { Collapse, Form, Input, InputNumber, RadioGroup, Textarea } from 'ant-design-vue';
import { PropType, computed, defineComponent, ref, toRaw, watch } from 'vue';

import { XTabs } from '../../tabs';
import { ScrollView } from '../../scroll-view';

import { IFormDesignerBinds, IFormDesignerWidget, attributeClassifyDesc } from '../config';
import { LABEL_ALIGN_OPTIONS, LAYOUT_OPTIONS, WIDGET_SIZE_OPTIONS } from '../constants';

export default defineComponent({
  components: {
    XTabs,
    ScrollView,
    // Antd
    [Collapse.name]: Collapse,
    [Collapse.Panel.name]: Collapse.Panel,
    [Input.name]: Input,
    [InputNumber.name]: InputNumber,
    [Textarea.name]: Textarea,
    [Form.name]: Form,
    [Form.Item.name]: Form.Item,
    [RadioGroup.name]: RadioGroup
  },
  props: {
    binds: {
      type: Object as PropType<IFormDesignerBinds>,
      default: null
    },
    widget: {
      type: Object as PropType<IFormDesignerWidget>,
      default: null
    }
  },
  methods: {
    getAttrComp(comp) {
      return toRaw(comp);
    }
  },
  setup(props: any) {
    const activeKey = ref<string>('field');

    const widget_ = ref<IFormDesignerWidget>(null);

    // 分组后的属性集合
    const attributesGrouped = computed(() => {
      return groupBy(widget_?.value?.attributes ?? [], 'group').map((x) => {
        return {
          label: attributeClassifyDesc[x.key],
          attributes: x.children
        };
      });
    });

    const collapseKey = ref([]);

    watch(
      attributesGrouped,
      (val) => {
        collapseKey.value = val.map((x) => x.label);
      },
      {
        immediate: true
      }
    );

    watch(
      () => props.widget,
      (val) => {
        widget_.value = val;
      },
      {
        immediate: true
      }
    );

    const tabOptions = [
      {
        name: 'field',
        label: '控件属性'
      },
      {
        name: 'form',
        label: '表单属性'
      }
    ];

    return {
      activeKey,
      widget_,
      attributesGrouped,
      collapseKey,
      tabOptions,
      layoutOptions: LAYOUT_OPTIONS,
      labelAlignOptions: LABEL_ALIGN_OPTIONS,
      sizeOptions: WIDGET_SIZE_OPTIONS
    };
  }
});
</script>

<style lang="scss" module>
.title {
  font-size: 14px;
  color: #333;
}

.tab {
  line-height: 40px;
}

.header {
  border-bottom: 2px solid #e4e7ed;
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

<style lang="scss">
.form-designer-collapse {
  margin-bottom: 166px;
  background-color: transparent;

  > .ant-collapse-item {
    border-bottom: none;

    > .ant-collapse-header {
      padding-top: 8px;
      padding-bottom: 8px;
      background: #ecf5ff;
      border-bottom: 1px solid #ddd;
    }

    .ant-collapse-content-box {
      padding-top: 12px !important;
    }
  }

  .ant-form-item {
    margin-bottom: 0;
  }
}
</style>
