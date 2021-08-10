/**
 * vxe-grid
 */

import { reactive } from 'vue';
import { merge } from 'lodash-es';
import { bindLazyFunc } from '@fatesigner/utils';

import { VXE_GRID_SYMBOLS } from './symbols';
import { IVxeGridHandlers, IVxeGridListenersType, IVxeGridPropsType, IVxeGridRefType } from './types';

export const defaultVxeGridProps: IVxeGridPropsType = {
  loading: false,
  data: [],
  rowDirtyClass: 'x-table-row-dirty',
  expandConfig: {
    iconClose: VXE_GRID_SYMBOLS.EXPAND_CLOSE_CLASS,
    iconOpen: VXE_GRID_SYMBOLS.EXPAND_OPEN_CLASS
  },
  pager: {
    enable: true,
    placement: 'top'
  },
  dataSource: {
    pageNo: 1,
    pageSize: 10
  }
};

export function createVxeGrid<TModel extends Record<string, any> = Record<string, any>, TParams extends Record<string, any> = Record<string, any>>(
  props: IVxeGridPropsType<TModel, TParams>,
  listeners?: IVxeGridListenersType
): IVxeGridRefType<TModel, TParams> {
  const handler: IVxeGridHandlers<TModel> = {
    getVxeGridRef: null,
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
  const bindProperties: Array<keyof IVxeGridHandlers> = ['refresh', 'reload', 'validate', 'validateRow'];

  bindLazyFunc(handler, bindProperties);

  return {
    options: reactive(merge({}, defaultVxeGridProps, props) as any),
    listeners: listeners ?? {},
    handler
  };
}
