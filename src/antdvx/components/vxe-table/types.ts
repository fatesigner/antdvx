/**
 * types
 */

import { ColumnProps } from 'ant-design-vue/es/table/interface';

import { IDataSourceTransport } from '../../types/data-source';
import { VxeTableProps } from 'vxe-table';
import { VxeTableListeners } from 'vxe-table/types/table';
import { VxeColumnProps } from 'vxe-table/types/column';

export type IXTableLoadData<TModel extends Record<string, any>, TQuery extends Record<string, any>> = (query: TQuery) => Promise<TModel[]>;

export type IXTableRowKeyFunc<TModel extends Record<string, any>> = (record: TModel, index: number) => string;

export type IVxeTableColumnProps<TModel extends Record<string, any> = Record<string, any>> = VxeColumnProps & {
  field: keyof TModel | string;
};

export interface IXTableHandlers<TModel extends Record<string, any> = Record<string, any>> {
  refresh?: () => Promise<void>;
  reload?: () => Promise<void>;
  validate?: () => Promise<boolean>;
  validateRow?: (index: number) => Promise<boolean>;
  getSelectedRows?: () => TModel[];
  getAllData?: () => TModel[];
  addItem?: (record: TModel, options?: { index?: number; editing?: boolean }) => Promise<void>;
  updateItem?: (key: string | number, record: TModel, options?: { editing?: boolean }) => Promise<void>;
  selectAll?: () => Promise<void>;
  selectInvert?: () => Promise<void>;
}

export interface IVxeTablePropsType<TModel extends Record<string, any> = Record<string, any>, TParams extends Record<string, any> = Record<string, any>>
  extends Omit<VxeTableProps<TModel>, 'dataSource' | 'columns' | 'rowKey' | 'scroll' | 'pagination'> {
  // Override Antd
  columns?: IVxeTableColumnProps<TModel>[];
  rowKey?: keyof TModel | IXTableRowKeyFunc<TModel>;

  scroll?: { x?: boolean | number; y?: boolean | number };
  pagination?: false | { current?: number; pageSize?: number; total?: number; placement?: 'top' | 'bottom' | 'all' };
  // Add custom
  params?: TParams;
  rowDirtyClass?: string;
  readonly transport?: IDataSourceTransport<TModel, TParams>;
}

export interface IVxeTableListenersType<TModel extends Record<string, any> = Record<string, any>> extends VxeTableListeners {
  readonly failed?: (err: Error) => void;
  readonly recordChange?: (record: TModel) => void;
  readonly onRowSelect?: (record: TModel, selected: boolean, selectedRows, nativeEvent) => void;
  readonly onRowSelectChange?: (selectedRowKeys: ColumnProps['key'][], selectedRows: TModel[]) => void;
  readonly onRowSelectAll?: (selected: boolean, selectedRows: TModel[], changeRows: TModel[]) => void;
  readonly onRowSelectInvert?: (selectedRows: TModel[]) => void;
}

export interface IVxeTableRefType<TModel extends Record<string, any> = Record<string, any>, TParams extends Record<string, any> = Record<string, any>> {
  options: VxeTableProps<TModel>;
  listeners: IVxeTableListenersType<TModel>;
  handler: IXTableHandlers<TModel>;
}
