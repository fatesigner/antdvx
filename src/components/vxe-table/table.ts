/**
 * vxe-table
 */

import { reactive } from 'vue';
import { merge } from 'lodash-es';
import { bindLazyFunc } from '@fatesigner/utils';

import { VXE_TABLE_SYMBOLS } from './symbols';
import { IVxeTableListenersType, IVxeTablePropsType, IVxeTableRefType, IXTableHandlers } from './types';
import './renderer';

export const defaultXTableProps: IVxeTablePropsType = {
  loading: false,
  data: [],
  rowDirtyClass: 'x-table-row-dirty',
  scroll: { x: true },
  expandConfig: {
    iconClose: VXE_TABLE_SYMBOLS.EXPAND_CLOSE_CLASS,
    iconOpen: VXE_TABLE_SYMBOLS.EXPAND_OPEN_CLASS
  },

  // Custom
  pagination: {
    total: 0,
    current: 1,
    pageSize: 10,
    placement: 'top'
  }
};

export function createVxeTable<TModel extends Record<string, any> = Record<string, any>, TParams extends Record<string, any> = Record<string, any>>(
  props: IVxeTablePropsType<TModel, TParams>,
  listeners?: IVxeTableListenersType
): IVxeTableRefType<TModel, TParams> {
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
    handler
  };
}
