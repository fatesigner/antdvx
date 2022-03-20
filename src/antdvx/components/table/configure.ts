import { VNode } from 'vue';
import { merge } from 'lodash-es';

import { IXTablePropsType, IXTableRefType } from './types';

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
    position: 'top',
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '20', '30', '50', '100']
  }
};

/**
 * 配置 XTable 默认选项，用于所有 XTable 实例
 */
export function configureXTable<
  TModel extends Record<string, any>,
  TParams extends Record<string, any>,
  TMethods extends Record<string, (...args: any[]) => any>
>(
  props: IXTablePropsType<TModel, TParams> & {
    /**
     * 往标题栏（前部）添加指定节点，用于所有表格实例
     */
    titlePrefix?: (tbRef: IXTableRefType<TModel, TParams, TMethods>) => VNode | VNode[];
    /**
     * 往标题栏（尾部）添加指定节点，用于所有表格实例
     */
    titleSuffix?: (tbRef: IXTableRefType<TModel, TParams, TMethods>) => VNode | VNode[];
  }
) {
  merge(defaultXTableProps, props);
}
