/**
 * types
 */

import { TableProps } from 'ant-design-vue/es/table/interface';
import { ColumnProps } from 'ant-design-vue/es/table/interface';

import { IDataSourceTransport } from '../../types/data-source';

export type IXTableLoadData<TModel extends Record<string, any>, TQuery extends Record<string, any>> = (query: TQuery) => Promise<TModel[]>;

export type IXTableRowKeyFunc<TModel extends Record<string, any>> = (record: TModel, index: number) => string;

export type IXTableColumnProps<TModel extends Record<string, any> = Record<string, any>> = ColumnProps & {
  dataIndex?: keyof TModel;
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

export interface IXTablePropsType<TModel extends Record<string, any> = Record<string, any>, TParams extends Record<string, any> = Record<string, any>>
  extends Omit<TableProps, 'dataSource' | 'columns' | 'rowKey' | 'scroll' | 'pagination'> {
  // Override Antd
  columns?: IXTableColumnProps<TModel>[];
  dataSource?: TModel[];
  rowKey?: keyof TModel | IXTableRowKeyFunc<TModel>;

  // 展开行
  expandRowByClick?: boolean;
  defaultExpandAllRows?: boolean;
  defaultExpandedRowKeys?: string[];

  scroll?: { x?: boolean | number; y?: boolean | number };
  pagination?: { current?: number; pageSize?: number; total?: number; placement?: 'top' | 'bottom' | 'all' };
  // Add custom
  params?: TParams;
  rowDirtyClass?: string;
  readonly transport?: IDataSourceTransport<TModel, TParams>;
}

export interface IXTableListenersType<TModel extends Record<string, any> = Record<string, any>> {
  readonly failed?: (err: Error) => void;
  readonly recordChange?: (record: TModel) => void;
  readonly onRowSelect?: (record: TModel, selected: boolean, selectedRows, nativeEvent) => void;
  readonly onRowSelectChange?: (selectedRowKeys: ColumnProps['key'][], selectedRows: TModel[]) => void;
  readonly onRowSelectAll?: (selected: boolean, selectedRows: TModel[], changeRows: TModel[]) => void;
  readonly onRowSelectInvert?: (selectedRows: TModel[]) => void;
}

export interface IXTableRefType<TModel extends Record<string, any> = Record<string, any>, TParams extends Record<string, any> = Record<string, any>> {
  options: IXTablePropsType<TModel, TParams>;
  listeners: IXTableListenersType<TModel>;
  handler: IXTableHandlers<TModel>;
}
