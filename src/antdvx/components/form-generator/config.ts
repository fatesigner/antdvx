/**
 * types
 */

import { AsyncComponentLoader, AsyncComponentOptions } from '@vue/runtime-core';

// 控件尺寸
export type IWidgetSize = 'large' | 'default' | 'small';

// 属性类别（设计）
export type IFormDesignerAttributeGroup = 'basics' | 'appearance' | 'layout' | 'behavior' | 'data' | 'validateRules';

// 属性类别描述（设计）
export const attributeClassifyDesc: Record<IFormDesignerAttributeGroup, string> = {
  basics: '基础',
  appearance: '外观',
  layout: '布局',
  behavior: '行为',
  data: '数据',
  validateRules: '校验规则'
};

// 属性（设计）
export interface IFormDesignerAttribute {
  name: string;
  label: string;
  group: IFormDesignerAttributeGroup;
  component: Record<string, AsyncComponentLoader | AsyncComponentOptions>;
  // 属性拓展
  fieldExtend: () => Record<string, any>;
}

// 校验规则
export type IRuleType = 'required' | 'regular' | 'lengthLimit' | 'number' | 'date' | 'email' | 'url' | 'cellPhoneNo';

// 校验规则描述
export const ruleTypeDesc: Record<IRuleType, string> = {
  required: '必填',
  regular: '正则',
  lengthLimit: '字符长度',
  number: '数字',
  date: '日期',
  email: '邮箱',
  url: '链接地址',
  cellPhoneNo: '手机号码'
};

export interface IFormDesignerAttributes {
  name: string;
  label: string;
  placeholder?: string;
  value?: any;
  defaultValue?: any;

  // able
  clearable?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  lengthTip?: boolean;

  // styles
  width?: string;
  size?: IWidgetSize;
}

// 控件类别（设计）
export type IFormDesignerWidgetGroup = 'customized' | 'basics' | 'layout';

// 控件类别描述（设计）
export const widgetClassifyDesc: Record<IFormDesignerWidgetGroup, string> = {
  customized: '自定义',
  basics: '基础',
  layout: '布局'
};

// 控件（设计）
export interface IFormDesignerWidget {
  name: string;
  label: string;
  group: IFormDesignerWidgetGroup;
  component: Record<string, AsyncComponentLoader | AsyncComponentOptions>;
  // 拥有的属性集合
  attributes: IFormDesignerAttribute[];
}

export interface IFormGeneratorSettings {
  hideRequiredMark: boolean;
  labelAlign: 'left' | 'right';
  layout: 'horizontal' | 'vertical' | 'inline';
  size: IWidgetSize;
  labelCol: { span: number; offset: number };
}

// 配置接口（设计）
export interface IFormDesignerConfig {
  attributes: IFormDesignerAttribute[];
  widgets: IFormDesignerWidget[];
  settings: IFormGeneratorSettings;
  /**
   * 控件命名规则
   * @param index
   */
  name: () => string;
}

// 用于数据绑定（设计）
export interface IFormDesignerBinds {
  schema: {
    name: string;
    description: string;
  };
  widgets: (IFormDesignerWidget & {
    // 唯一的 id
    key: string;
    // 字段属性
    field: Record<string, any>;
  })[];
  settings: IFormGeneratorSettings;
}

export interface IFormGeneratorData {
  name: string;
  description: string;
  widgets: ({
    key: string;
    type: string;
  } & Record<string, any>)[];
  settings: IFormGeneratorSettings;
}
