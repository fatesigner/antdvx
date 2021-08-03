/**
 * Widgets
 */

import { defineAsyncComponent } from 'vue';

import { IFormDesignerWidget } from '../../config';
import {
  baseAttributes,
  clearableAttribute,
  dateAttribute,
  defaultValueAttribute,
  lengthTipAttribute,
  optionsAttribute,
  rulesAttribute,
  scoreOptionsAttribute,
  widthAttribute
} from '../attributes';

// 基础
export const inputWidget: IFormDesignerWidget = {
  name: 'input',
  label: '单行文本',
  group: 'basics',
  component: defineAsyncComponent(() => import('./input.vue')),
  attributes: [...baseAttributes, defaultValueAttribute, clearableAttribute, widthAttribute, rulesAttribute]
};

export const textareaWidget: IFormDesignerWidget = {
  name: 'textarea',
  label: '多行文本',
  group: 'basics',
  component: defineAsyncComponent(() => import('./textarea.vue')),
  attributes: [...baseAttributes, defaultValueAttribute, clearableAttribute, lengthTipAttribute, rulesAttribute]
};

export const numberWidget: IFormDesignerWidget = {
  name: 'number',
  label: '数字框',
  group: 'basics',
  component: defineAsyncComponent(() => import('./number.vue')),
  attributes: [...baseAttributes, defaultValueAttribute, clearableAttribute, rulesAttribute]
};

export const passwordWidget: IFormDesignerWidget = {
  name: 'password',
  label: '密码框',
  group: 'basics',
  component: defineAsyncComponent(() => import('./password.vue')),
  attributes: [...baseAttributes, defaultValueAttribute, clearableAttribute, rulesAttribute]
};

export const radioWidget: IFormDesignerWidget = {
  name: 'radio',
  label: '单选框组',
  group: 'basics',
  component: defineAsyncComponent(() => import('./radio.vue')),
  attributes: [...baseAttributes, defaultValueAttribute, optionsAttribute, rulesAttribute]
};

export const scoreRadioWidget: IFormDesignerWidget = {
  name: 'scoreRadio',
  label: '单选框组（分值）',
  group: 'basics',
  component: defineAsyncComponent(() => import('./radio-score.vue')),
  attributes: [...baseAttributes, defaultValueAttribute, scoreOptionsAttribute, rulesAttribute]
};

export const checkboxWidget: IFormDesignerWidget = {
  name: 'checkbox',
  label: '复选框组',
  group: 'basics',
  component: defineAsyncComponent(() => import('./checkbox.vue')),
  attributes: [...baseAttributes, defaultValueAttribute, optionsAttribute, rulesAttribute]
};

export const scoreCheckboxWidget: IFormDesignerWidget = {
  name: 'scoreCheckbox',
  label: '复选框组（分值）',
  group: 'basics',
  component: defineAsyncComponent(() => import('./checkbox-score.vue')),
  attributes: [...baseAttributes, defaultValueAttribute, scoreOptionsAttribute, rulesAttribute]
};

export const dateWidget: IFormDesignerWidget = {
  name: 'date',
  label: '日期选择框',
  group: 'basics',
  component: defineAsyncComponent(() => import('./date.vue')),
  attributes: [...baseAttributes, dateAttribute, rulesAttribute]
};

/**
 * 基础控件集合
 */
export const baseWidgets = [
  inputWidget,
  textareaWidget,
  numberWidget,
  passwordWidget,
  radioWidget,
  checkboxWidget,
  scoreRadioWidget,
  scoreCheckboxWidget,
  dateWidget
];
