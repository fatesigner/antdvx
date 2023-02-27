import { VNode } from 'vue';
import { UnknownType } from '@fatesigner/utils/types';
import { isArray, mergeWith } from 'lodash-es';

import { AntdvxTable, AntdvxTableProps } from './types';

export const defaultXTableProps: Partial<AntdvxTableProps> = {
  autoload: true,
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
    position: [],
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '20', '30', '50', '100']
  }
};

/**
 * 配置 Antdvx Table 默认 Props，应用于所有 Antdvx Table 组件实例
 */
export function configureXTable<RecordType extends UnknownType<any> = UnknownType<any>>(
  props: AntdvxTableProps<RecordType> & {
    /**
     * 往标题栏（前部）添加指定节点，用于所有表格实例
     */
    titlePrefix?: (tbRef: AntdvxTable<RecordType>) => VNode | VNode[];
    /**
     * 往标题栏（尾部）添加指定节点，用于所有表格实例
     */
    titleSuffix?: (tbRef: AntdvxTable<RecordType>) => VNode | VNode[];
  }
) {
  mergeWith(defaultXTableProps, props, (objVal, srcVal) => (isArray(objVal) ? srcVal : undefined));
}
