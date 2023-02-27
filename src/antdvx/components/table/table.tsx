import { defineComponent, onMounted, PropType, ref } from 'vue';
import { Table } from 'ant-design-vue';

import {
  AntdvxTable,
  AntdvxTableChangeType,
  AntdvxTableColumnProps,
  AntdvxTableFilters,
  AntdvxTableProps,
  AntdvxTableSorter
} from './types';

/**
 * Antdvx Table（对原 Antdv Table 组件的二次封装）
 */
export const XTable = defineComponent({
  props: {
    columns: {
      type: Array as PropType<AntdvxTableProps['columns']>,
      default: null
    },
    columnMap: Function as PropType<AntdvxTableProps['columnMap']>
  },
  setup(props, { emit, expose }) {
    // 保存当前选中的过滤、筛选条件
    const filters: AntdvxTableFilters<any> = {} as any;
    const sorter: AntdvxTableSorter<any> = {} as any;
    let changeType: AntdvxTableChangeType;

    // 列
    const columns_ = ref([]);

    // 更新列
    const updateColumns: AntdvxTable<any>['updateColumns'] = () => {
      columns_.value = props.columns
        ?.filter((x) => x && !x.hidden)
        ?.map((x) => {
          if (props.columnMap) {
            x = props.columnMap(x);
          }

          // 默认排序
          if (x.defaultSortOrder) {
            sorter.column = x;
            sorter.columnKey = x.dataIndex;
            sorter.field = x.dataIndex;
            sorter.order = x.defaultSortOrder;
          }

          return x;
        });
    };

    // 指定暴露到外部的函数
    expose({
      updateColumns
    });

    // 初始化列
    updateColumns();

    onMounted(() => {});

    return {
      columns_
    };
  },
  render(ctx) {
    return <Table columns={ctx.columns_}></Table>;
  }
});
