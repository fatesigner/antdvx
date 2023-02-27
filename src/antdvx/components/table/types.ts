import { DefineComponent } from 'vue';
import { IWorksheetColumn } from '@fatesigner/utils/exceljs';
import { UnknownType } from '@fatesigner/utils/types';
import { ColumnProps, TableProps, tableProps } from 'ant-design-vue/lib/table';

import { IDataSource, IPaginationParams } from '../../types';

export type AntdvxTableChangeType = 'excel' | 'filter' | 'sorter' | 'pagination';

export type AntdvxTableFilters<RecordType extends UnknownType<any> = UnknownType<any>> = Record<
  keyof RecordType,
  string[]
>;

export interface AntdvxTableSorter<RecordType extends UnknownType<any> = UnknownType<any>> {
  column: any;
  columnKey: any;
  field: any;
  order: any;
}

/**
 * Antdvx Column 类型
 */
export type AntdvxTableColumnProps<RecordType extends UnknownType<any> = UnknownType<any>> = Omit<
  ColumnProps,
  'customRender' | 'filters'
> & {
  /**
   * 过滤模式，默认为 filters
   * @description filters：选项列表
   * @description keywords：文本框
   */
  filterMode?: 'filters' | 'keywords';

  filters?: {
    text: string;
    value: number | string;
    children?: {
      text: string;
      value: string;
    }[];
  }[];

  /**
   * 是否隐藏该列，默认为 false
   */
  hidden?: boolean;

  /**
   * 用于 Excel 导出的配置
   */
  excel?: IWorksheetColumn<RecordType>;
};

/**
 * Antdvx Table Props 类型
 */
export interface AntdvxTableProps<RecordType extends UnknownType<any> = UnknownType<any>>
  extends Omit<TableProps<RecordType>, 'columns' | 'dataSource'> {
  /**
   * 表格名称，唯一值
   */
  name?: string;

  /**
   * 是否自动加载数据，默认为 true
   */
  autoload?: boolean;

  /**
   * 列配置
   */
  columns: AntdvxTableColumnProps[];

  /**
   * 数据源配置
   */
  dataSource?: IDataSource<RecordType>;

  /**
   * 列的属性拓展
   * @param column
   * @constructor
   */
  columnMap?: (column: AntdvxTableColumnProps<RecordType>) => AntdvxTableColumnProps<RecordType>;
}

/**
 * Antdvx Table 引用类型
 */
export interface AntdvxTable<
  RecordType extends UnknownType<any> = UnknownType<any>,
  MethodsType extends UnknownType<(...args: unknown[]) => unknown> = UnknownType<(...args: unknown[]) => unknown>
> {
  /**
   * Antdvx Table
   */
  Table: DefineComponent<{ name: string }>;

  /**
   * 获取 Antdv Table 实例
   */
  getAntTableRef: () => any;

  /**
   * 刷新数据
   */
  refresh: () => Promise<void>;

  /**
   * 刷新数据，重置分页、将会重新请求远端数据
   */
  reload: () => Promise<void>;

  /**
   * 更新 columns
   */
  updateColumns: () => void;

  /**
   * 自定义函数
   */
  methods: MethodsType;
}
