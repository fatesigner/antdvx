/**
 * Attributes
 */

import { defineAsyncComponent } from 'vue';

import { IFormDesignerAttribute } from '../../config';

// 基础
export const nameAttribute: IFormDesignerAttribute = {
  name: 'name',
  label: '标识（name）',
  group: 'basics',
  component: defineAsyncComponent(() => import('./name.vue')),
  fieldExtend() {
    return { name: null };
  }
};

export const labelAttribute: IFormDesignerAttribute = {
  name: 'label',
  label: '标签',
  group: 'basics',
  component: defineAsyncComponent(() => import('./label.vue')),
  fieldExtend() {
    return { label: null };
  }
};

// 行为
export const accessibilityAttribute: IFormDesignerAttribute = {
  name: 'accessibility',
  label: '可访问性',
  group: 'behavior',
  component: defineAsyncComponent(() => import('./accessibility.vue')),
  fieldExtend() {
    return { hidden: false, readonly: false, disabled: false };
  }
};

export const clearableAttribute: IFormDesignerAttribute = {
  name: 'clearable',
  label: '可清除的',
  group: 'behavior',
  component: defineAsyncComponent(() => import('./clearable.vue')),
  fieldExtend() {
    return { clearable: false };
  }
};

export const placeholderAttribute: IFormDesignerAttribute = {
  name: 'placeholder',
  label: '占位内容',
  group: 'basics',
  component: defineAsyncComponent(() => import('./placeholder.vue')),
  fieldExtend() {
    return { placeholder: null };
  }
};

export const lengthTipAttribute: IFormDesignerAttribute = {
  name: 'lengthTip',
  label: '输入长度提示',
  group: 'behavior',
  component: defineAsyncComponent(() => import('./length-tip.vue')),
  fieldExtend() {
    return { lengthTip: true };
  }
};

// 数据
export const defaultValueAttribute: IFormDesignerAttribute = {
  name: 'defaultValue',
  label: '默认值',
  group: 'data',
  component: defineAsyncComponent(() => import('./defaultValue.vue')),
  fieldExtend() {
    return { defaultValue: null };
  }
};

// 日期
export const dateAttribute: IFormDesignerAttribute = {
  name: 'date',
  label: '日期',
  group: 'data',
  component: defineAsyncComponent(() => import('./date.vue')),
  fieldExtend() {
    return {
      date: {
        dateFormat: null,
        min: null,
        max: null
      }
    };
  }
};

export const optionsAttribute: IFormDesignerAttribute = {
  name: 'options',
  label: '选项',
  group: 'data',
  component: defineAsyncComponent(() => import('./options.vue')),
  fieldExtend() {
    return {
      options: {
        mode: 'local',
        list: [
          { disabled: false, value: 'value1', label: 'text1' },
          { disabled: false, value: 'value2', label: 'text2' },
          { disabled: false, value: 'value3', label: 'text3' }
        ]
      }
    };
  }
};

export const scoreOptionsAttribute: IFormDesignerAttribute = {
  name: 'options-score',
  label: '选项（分值）',
  group: 'data',
  component: defineAsyncComponent(() => import('./options-score.vue')),
  fieldExtend() {
    return {
      options: {
        mode: 'local',
        list: [
          { disabled: false, value: 'value1', label: 'text1', score: 1 },
          { disabled: false, value: 'value2', label: 'text2', score: 2 },
          { disabled: false, value: 'value3', label: 'text3', score: 3 }
        ]
      }
    };
  }
};

// 外观
export const widthAttribute: IFormDesignerAttribute = {
  name: 'width',
  label: '宽度',
  group: 'appearance',
  component: defineAsyncComponent(() => import('./width.vue')),
  fieldExtend() {
    return { width: '100%' };
  }
};

export const sizeAttribute: IFormDesignerAttribute = {
  name: 'size',
  label: '尺寸',
  group: 'appearance',
  component: defineAsyncComponent(() => import('./size.vue')),
  fieldExtend() {
    return { size: 'default' };
  }
};

// 校验规则
export const rulesAttribute: IFormDesignerAttribute = {
  name: 'rules',
  label: '校验规则',
  group: 'validateRules',
  component: defineAsyncComponent(() => import('./rules.vue')),
  fieldExtend() {
    return {
      rules: {
        mode: 'onBlur',
        includes: [],
        props: {}
      }
    };
  }
};

/**
 * 基础属性集合
 */
export const baseAttributes = [nameAttribute, labelAttribute, accessibilityAttribute];
