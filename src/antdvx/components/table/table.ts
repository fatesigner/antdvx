/**
 * table
 */

import { reactive } from 'vue';
import { merge } from 'lodash-es';
import { bindLazyFunc } from '@fatesigner/utils';

import { IXTableHandlers, IXTablePropsType, IXTableRefType } from './types';

export const defaultXTableProps: IXTablePropsType<any, any> = {
  loading: false,
  // scroll: { x: true },
  dataSource: {
    data: [],
    pageNo: 1,
    pageSize: 10,
    schema: {
      data: 'data',
      total: 'total'
    }
  },

  // 展开行
  expandRowByClick: false,
  expandedRowKeys: [],
  defaultExpandAllRows: false,
  defaultExpandedRowKeys: [],

  pagination: {
    size: 'small',
    position: 'both',
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '20', '30', '50', '100']
  }
};

export function createXTable<TModel extends Record<string, any>, TParams extends Record<string, any>, TMethods extends Record<string, (...args: any[]) => any>>(
  props: IXTablePropsType<TModel, TParams>,
  params?: TParams,
  methods?: TMethods
): IXTableRefType<TModel, TParams, TMethods> {
  const handler: IXTableHandlers<TModel> = {
    getAntTableRef: null,
    addData: null,
    updateData: null,
    removeData: null,
    getSelectedData: null,
    getAllData: null,
    selectAll: null,
    selectInvert: null,
    refresh: null,
    reload: null,
    validate: null,
    validateRow: null
  };

  // 代理异步函数
  const bindProperties: Array<keyof IXTableHandlers<TModel>> = ['refresh', 'reload', 'validate', 'validateRow'];

  bindLazyFunc(handler, bindProperties);

  return {
    options: reactive(merge({}, defaultXTableProps, props) as any),
    handler,
    params: reactive(Object.assign({}, params) as any),
    methods
  };
}
