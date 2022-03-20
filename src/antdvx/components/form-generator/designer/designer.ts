/**
 * form-designer
 */

import { getGUID } from '@fatesigner/utils/random';

import { IFormDesignerBinds, IFormDesignerConfig, IFormDesignerWidget, IFormGeneratorData } from '../config';

import { baseAttributes } from './attributes';
import { baseWidgets } from './widgets';

export interface IFormDesignerRef {
  getData: () => Promise<IFormGeneratorData>;
}

export const FormDesignerConfig: IFormDesignerConfig = {
  attributes: baseAttributes,
  widgets: baseWidgets,
  settings: {
    hideRequiredMark: false,
    labelAlign: 'right',
    layout: 'horizontal',
    size: 'default',
    labelCol: { span: 3, offset: 0 }
  },
  name() {
    return 'field_' + getGUID(7).toLowerCase();
  }
};

/**
 * 获取默认 generator data
 */
export function getDefaultFormGeneratorData(): IFormGeneratorData {
  return {
    name: null,
    description: null,
    widgets: [],
    settings: FormDesignerConfig.settings
  };
}

/**
 * 解析外部 json Data，并将其转换为用于 UI 绑定的对象
 * @param data
 * @param binds
 */
export async function analyzeFormDesignerJsonData(data: IFormGeneratorData, binds?: IFormDesignerBinds): Promise<IFormDesignerBinds> {
  if (!binds) {
    binds = {
      schema: {
        name: null,
        description: null
      },
      widgets: [],
      settings: FormDesignerConfig.settings
    };
  }
  if (data) {
    // 解析 fields 转换为 widgets
    binds.widgets.splice(
      0,
      binds.widgets.length,
      ...(data?.widgets?.map((x) => {
        const widget = FormDesignerConfig.widgets.find((y) => y.name === x.type);
        if (widget) {
          const key = x.key;
          delete x.key;
          delete x.type;
          return {
            ...widget,
            key: key ?? FormDesignerConfig.name(),
            field: x
          };
        }
        return null;
      }) ?? [])
    );

    // settings
    if (data?.settings) {
      Object.assign(binds.settings, data.settings);
    }

    binds.schema.name = data.name;
    binds.schema.description = data.description;
  }

  return binds;
}

/**
 * 生成 json data
 * @param binds
 */
export async function getFormDesignerJsonData(binds: IFormDesignerBinds): Promise<IFormGeneratorData> {
  return {
    name: binds.schema.name,
    description: binds.schema.description,
    widgets: binds.widgets.map((x) => ({
      key: x.key,
      type: x.name,
      ...x.field
    })),
    settings: binds.settings
  };
}

/**
 * 获取指定控件的属性对象，用于界面数据绑定
 */
export function getFiledObject(widget: IFormDesignerWidget): Record<string, any> {
  return widget.attributes.reduce((prev, cur) => {
    return {
      ...prev,
      ...cur.fieldExtend()
    };
  }, {});
}

// 动态导入内置组件
/* let requirePages = require.context('./widgets/base', true, /\*\.vue$/);
requirePages.keys().forEach((filename) => {
  const comp: any = requirePages(filename).default;
  FormDesignerConfig.widgets.base.push({
    name: filename,
    comp
  });
}); */
