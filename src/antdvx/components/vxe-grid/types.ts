/**
 * types
 */

import { VxeGridProps } from 'vxe-table';
import { VxeTableDefines } from 'vxe-table/types/table';
import { ColumnProps } from 'ant-design-vue/es/table/interface';
import { VxeGridListeners, VxeGridMethods } from 'vxe-table/types/grid';

import { IDataSource } from './data-source';

export type IVxeGridRowKeyFunc<TModel extends Record<string, any>> = (record: TModel, index: number) => string;

export type IVxeGridColumnProps<TModel extends Record<string, any>> = Omit<VxeTableDefines.ColumnOptions, 'field'> & {
  field?: keyof TModel;
};

export type IVxeGridTmodelExtend<T extends Record<string, any>> = Partial<T> & Record<string, any>;

export interface IVxeGridPropsType<TModel extends Record<string, any> = any, TParams extends Record<string, any> = any>
  extends Omit<VxeGridProps<TModel>, 'columns' | 'dataSource' | 'rowKey' | 'scroll' | 'pagination'> {
  // Override
  columns?: IVxeGridColumnProps<TModel>[];
  rowKey?: keyof TModel | IVxeGridRowKeyFunc<TModel>;

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
   * @param start 指定插入的开始位置（从0计数）。如果超出了数组的长度，则从数组末尾开始添加内容；如果是负值，则表示从数组末位开始的第几位（从-1计数，这意味着-n是倒数第n个元素并且等价于array.length-n）；如果负数的绝对值大于数组的长度，则表示开始位置为第0位。
   * @param data 插入的数据或者数组
   */
  addData?: (start: number, data: IVxeGridTmodelExtend<TModel> | IVxeGridTmodelExtend<TModel>[]) => void;

  /**
   * 更新数据
   * @param index 数据所在数组中的序号
   * @param data 待更新的数据
   */
  updateData?: (index: number, data: IVxeGridTmodelExtend<TModel>) => void;

  /**
   * 删除指定数据
   * @param index 数据所在数组中的序号
   */
  removeData?: (index: number) => void;

  /**
   * 获取选中的数据
   */
  getSelectedData?: () => IVxeGridTmodelExtend<TModel>[];

  /**
   * 获取所有数据，非分页后
   */
  getAllData?: () => IVxeGridTmodelExtend<TModel>[];

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
  options: IVxeGridPropsType<TModel, TParams>;
  listeners: IVxeGridListenersType<TModel>;
  handler: IVxeGridHandlers<TModel>;
}
