/**
 * types
 */

import { VxeGridProps } from 'vxe-table';
import { VxeGridListeners, VxeGridMethods, VxeGridPropTypes } from 'vxe-table/types/grid';
import { ColumnProps } from 'ant-design-vue/es/table/interface';

import { IDataSource } from './data-source';

export type IVxeGridLoadData<TModel extends Record<string, any>, TQuery extends Record<string, any>> = (query: TQuery) => Promise<TModel[]>;

export type IVxeGridRowKeyFunc<TModel extends Record<string, any>> = (record: TModel, index: number) => string;

export type IVxeGridColumnProps<TModel extends Record<string, any> = Record<string, any>> = VxeGridPropTypes.Columns & {
  field?: keyof TModel | string;
};

export interface IVxeGridPropsType<TModel extends Record<string, any> = Record<string, any>, TParams extends Record<string, any> = Record<string, any>>
  extends Omit<VxeGridProps<TModel>, 'dataSource' | 'rowKey' | 'scroll' | 'pagination'> {
  // Override
  //columns?: IVxeGridColumnProps<TModel>[];
  rowKey?: keyof TModel | IVxeGridRowKeyFunc<TModel>;
  scroll?: { x?: boolean | number; y?: boolean | number };
  // Add custom
  params?: TParams;
  rowDirtyClass?: string;

  /**
   * 分页器配置
   */
  pager?: {
    /**
     * 是否开启分页功能
     */
    enable?: boolean;
    /**
     * 指定分页器相对于表格位置
     */
    placement?: 'top' | 'bottom' | 'all';
  };

  /**
   * 数据源配置
   */
  dataSource?: IDataSource<TModel, TParams>;
}

export interface IVxeGridHandlers<TModel extends Record<string, any> = Record<string, any>> {
  /**
   * 获取 VXE Grid 实例
   */
  getVxeGridRef?: () => VxeGridMethods;

  /**
   * 添加数据
   * @param index 数组中开始插入元素的从零开始的位置
   * @param data 数据或数据集
   */
  addData?: (start: number, data: TModel | TModel[]) => void;

  /**
   * 更新数据
   * @param key 数据的 key 或者 所在数组中的序号
   * @param data 待更新的数据
   */
  updateData?: (key: string | number, data: TModel) => TModel;

  /**
   * 删除指定数据
   * @param key 数据的 key 或者 所在数据集的序号
   */
  removeData?: (key: string | number) => void;

  /**
   * 获取选中的数据
   */
  getSelectedData?: () => TModel[];

  /**
   * 获取所有数据，非分页后
   */
  getAllData?: () => TModel[];

  /**
   * 全选
   */
  selectAll?: () => void;

  /**
   * 反选
   */
  selectInvert?: () => void;

  /**
   * 刷新数据
   */
  refresh?: () => Promise<void>;

  /**
   * 刷新数据，重置分页、将会重新请求远端数据
   */
  reload?: () => Promise<void>;

  /**
   * 校验表格数据
   */
  validate?: () => Promise<boolean>;

  /**
   * 校验表格指定的行数据
   * @param row
   */
  validateRow?: (row: TModel) => Promise<boolean>;
}

export interface IVxeGridListenersType<TModel extends Record<string, any> = Record<string, any>> extends VxeGridListeners {
  readonly failed?: (err: Error) => void;
  readonly recordChange?: (record: TModel) => void;
  readonly onRowSelect?: (record: TModel, selected: boolean, selectedRows, nativeEvent) => void;
  readonly onRowSelectChange?: (selectedRowKeys: ColumnProps['key'][], selectedRows: TModel[]) => void;
  readonly onRowSelectAll?: (selected: boolean, selectedRows: TModel[], changeRows: TModel[]) => void;
  readonly onRowSelectInvert?: (selectedRows: TModel[]) => void;
}

export interface IVxeGridRefType<TModel extends Record<string, any> = Record<string, any>, TParams extends Record<string, any> = Record<string, any>> {
  options: VxeGridProps<TModel>;
  listeners: IVxeGridListenersType<TModel>;
  handler: IVxeGridHandlers<TModel>;
}
