import { DefineComponent } from 'vue';
import { IWorksheetColumn } from '@fatesigner/utils/exceljs';
import { UnknownType } from '@fatesigner/utils/types';
import { ColumnProps, TableProps, tableProps } from 'ant-design-vue/lib/table';
import { Workbook, Worksheet } from 'exceljs';

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

export interface AntdvxTableListeners<RecordType extends UnknownType<any> = UnknownType<any>> {
  /**
   * 分页、排序、筛选变化时触发
   */
  readonly change?: (changer: {
    /**
     * 类型
     */
    type: AntdvxTableChangeType;
    pagination: IPaginationParams;
    filters: AntdvxTableFilters<RecordType>;
    sorter: AntdvxTableSorter<RecordType>;
    /**
     * 当前数据
     */
    currentData: RecordType[];
    /**
     * 所有数据
     */
    overallData: RecordType[];
  }) => void;

  /**
   * 展开的行变化时触发
   */
  readonly expandedRowsChange?: (expandedRows: string[]) => void;

  /**
   * 点击展开图标时触发
   */
  readonly expand?: (expanded: boolean, record: RecordType) => void;

  // Custom events

  /**
   * 请求错误后触发
   */
  readonly failed?: (err: Error) => void;

  /**
   * 数据项更新后触发，用于行数据编辑
   */
  readonly recordChange?: (record: RecordType) => void;

  /**
   * 当前页数据更新后触发, 切换分页、过滤、筛选等
   */
  readonly dataChange?: (data: RecordType[]) => void;

  /**
   * 数据加载成功后触发, 当 dataSource 配置为远端数据时, 将会在每次请求后触发
   */
  readonly dataLoaded?: (data: RecordType[]) => void;

  /**
   * 用户手动选择/取消选择某行的回调
   */
  readonly rowSelect?: (record: RecordType, selected: boolean, selectedRows, nativeEvent) => void;

  /**
   * 选中项发生变化时的回调
   */
  readonly rowSelectChange?: (selectedRowKeys: ColumnProps['key'][], selectedRows: RecordType[]) => void;

  /**
   * 用户全选所有行的回调
   */
  readonly rowSelectAll?: (selected: boolean, selectedRows: RecordType[], changeRows: RecordType[]) => void;

  /**
   * 用户手动选择反选的回调
   */
  readonly rowSelectInvert?: (selectedRows: RecordType[]) => void;

  /**
   * 在下载 Excel 之前执行，可在此更新 Excel worksheet 和 workbook 对象
   */
  readonly beforeDownloadExcel?: (worksheet: Worksheet, workbook: Workbook) => Promise<void>;
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
  extends Omit<TableProps<RecordType>, 'columns'> {
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
  dataSchema?: Omit<IDataSource<RecordType>, 'pageNo' | 'pageSize' | 'total'>;

  /**
   * 列的属性拓展
   * @param column
   * @constructor
   */
  columnMap?: (column: AntdvxTableColumnProps<RecordType>) => AntdvxTableColumnProps<RecordType>;

  /**
   * 事件
   */
  listeners?: AntdvxTableListeners<RecordType>;
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
  getAntTableRef: () => Promise<void>;

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
  updateColumns: () => Promise<void>;

  /**
   * 自定义函数
   */
  methods: MethodsType;
}
