<template>
  <div class="tw-h-full">
    <ScrollView ref="scrollViewRef">
      <AForm
        :layout="binds.settings.layout"
        :labelAlign="binds.settings.labelAlign"
        :labelCol="binds.settings.labelCol"
        :hideRequiredMark="binds.settings.hideRequiredMark"
      >
        <Draggable
          class="tw-p-2 tw-space-y-2"
          ref="draggableRef"
          item-key="key"
          :ghostClass="$style.ghost"
          :animation="200"
          :group="{ name: group }"
          :list="binds.widgets"
          @change="onDragChange"
        >
          <template #item="{ element, index }">
            <TransitionGroup name="fade" tag="div">
              <div
                :class="[
                  $style.widget,
                  activatedKey === element.key ? $style.activated : null,
                  isRequired(element.field) ? $style.required : null,
                  element.field.hidden ? $style.hidden : null
                ]"
                :key="element.key || index"
                @click="itemClick(element)"
              >
                <AFormItem>
                  <template #label>
                    <div :class="$style.label">{{ element.field.label }}</div>
                  </template>
                  <Component :is="getComp(element.component)" :field="element.field" />
                </AFormItem>
                <div :class="$style.actions">
                  <XButton class="tw-mr-1" size="small" type="default" title="复制" @click="copy(element, index)"><IconFileCopyLine /></XButton>
                  <XButton size="small" type="default" title="删除" @click="remove(element, index)"><IconDeleteBinLine /></XButton>
                </div>
              </div>
            </TransitionGroup>
          </template>
        </Draggable>
      </AForm>
    </ScrollView>
  </div>
</template>

<script lang="ts">
import Draggable from 'vuedraggable';
import { Form } from 'ant-design-vue';
import { cloneDeep } from 'lodash-es';
import { PropType, defineComponent, onMounted, ref, toRaw, watch } from 'vue';

import { IconDeleteBinLine, IconFileCopyLine } from '../../iconfont';
import { ScrollView } from '../../scroll-view';
import { XButton } from '../../button';

import { IFormDesignerBinds, IFormDesignerWidget } from '../config';
import { FORM_DESIGNER_SYMBOLS } from '../symbols';

import { FormDesignerConfig } from './designer';

export default defineComponent({
  components: {
    IconDeleteBinLine,
    IconFileCopyLine,
    XButton,
    ScrollView,
    Draggable,
    // Antd
    [Form.name]: Form,
    [Form.Item.name]: Form.Item
  },
  props: {
    binds: {
      type: Object as PropType<IFormDesignerBinds>,
      default: null
    }
  },
  methods: {
    getComp(comp) {
      return toRaw(comp);
    },
    // 判断控件是否必填
    isRequired(field: IFormDesignerBinds['widgets'][number]['field']) {
      return !!field?.rules?.props?.required;
    }
  },
  setup(props: any, { emit }) {
    const group = FORM_DESIGNER_SYMBOLS.DRAGGABLE_GROUP;

    const draggableRef = ref<any>(null);
    const scrollViewRef = ref<any>(null);
    const activatedKey = ref<string>(null);

    const onDragChange = (e) => {
      // Add key
      if (e.added) {
        // 新增后，默认设置选中
        activatedKey.value = e?.added?.element?.key;
      }
    };

    const copy = (item: IFormDesignerWidget, index) => {
      let itemClone = cloneDeep(item) as IFormDesignerBinds['widgets'][number];
      itemClone.key = FormDesignerConfig.name();
      itemClone.field.name = itemClone.key;
      props.binds.widgets.splice(index + 1, 0, itemClone);
    };

    const remove = (item, index) => {
      props.binds.widgets.splice(index, 1);
      if (activatedKey.value === item.key) {
        activatedKey.value = null;
      }
    };

    const itemClick = (item) => {
      activatedKey.value = item.key;
    };

    watch(activatedKey, (val) => {
      if (val) {
        let item = props.binds.widgets.find((x) => x.key === val);
        emit('activatedChange', item);
      } else {
        emit('activatedChange', null);
      }
    });

    watch(
      () => props.binds.widgets.length,
      (val) => {
        if (val === 0) {
          activatedKey.value = null;
        }
      }
    );

    onMounted(() => {
      // 设置最低高度
      draggableRef.value.$el.style['min-height'] = scrollViewRef.value.$el.offsetHeight + 'px';
    });

    return {
      group,
      draggableRef,
      scrollViewRef,
      activatedKey,
      onDragChange,
      itemClick,
      copy,
      remove
    };
  }
});
</script>

<style lang="less" module>
.title {
  font-size: 14px;
  color: #333;
}

.ghost {
  color: transparent !important;
}

.actions {
  position: absolute;
  right: 0;
  bottom: 0;
  transition-timing-function: ease-in-out;
  transition-duration: 0.2s;
  transition-property: transform;
  transform: translate3d(0, 100%, 0);
}

.widget {
  position: relative;
  padding: 2px 5px;
  overflow: hidden;
  color: #333;
  cursor: move;
  background-color: rgba(236, 245, 255, 0.3);
  border: 1px solid hsla(0, 0%, 66.7%, 0.3);

  &:hover {
    background: #ecf5ff;

    .actions {
      transform: translate3d(0, 0, 0);
    }
  }

  &.activated {
    background: #ecf5ff;
    border: 1px dashed #409eff;
    outline: 1px solid #409eff;
    outline-offset: 0;
  }

  &.required {
    .label::before {
      display: inline-block;
      margin-right: 4px;
      font-family: SimSun, sans-serif;
      font-size: 14px;
      line-height: 1;
      color: #ff4d4f;
      content: '*';
    }
  }

  &.hidden {
    opacity: 0.5;
  }
}
</style>
