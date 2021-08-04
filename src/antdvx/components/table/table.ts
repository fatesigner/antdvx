/**
 * table
 */

import { reactive } from 'vue';
import { merge } from 'lodash-es';
import { bindLazyFunc } from '@fatesigner/utils';

import { IXTableHandlers, IXTableListenersType, IXTablePropsType, IXTableRefType } from './types';

export const defaultXTableProps: IXTablePropsType = {
  loading: false,
  dataSource: [],
  rowDirtyClass: 'x-table-row-dirty',
  scroll: { x: true },

  // 展开行
  expandRowByClick: false,
  defaultExpandAllRows: false,
  defaultExpandedRowKeys: [],

  pagination: {
    total: 0,
    current: 1,
    pageSize: 10,
    placement: 'top'
  }
};

export function createXTable<
  TModel extends Record<string, any> = Record<string, any>,
  TParams extends Record<string, any> = Record<string, any>,
  TMethods extends Record<string, (...args: any[]) => any> = Record<string, (...args: any[]) => any>
>(props: IXTablePropsType<TModel, TParams>, listeners?: IXTableListenersType, methods?: TMethods): IXTableRefType<TModel, TParams, TMethods> {
  const handler: IXTableHandlers<TModel> = {
    refresh: null,
    reload: null,
    validate: null,
    validateRow: null,
    addItem: null,
    selectAll: null,
    selectInvert: null
  };

  bindLazyFunc(handler, Object.keys(handler));

  return {
    options: reactive(merge({}, defaultXTableProps, props) as any),
    listeners,
    handler,
    methods
  };
}
