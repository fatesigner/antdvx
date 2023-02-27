/**
 * types
 */

import { VNode } from 'vue';
import { IWorksheetColumn } from '@fatesigner/utils/exceljs';
import { UnknownType } from '@fatesigner/utils/types';
import { PaginationProps } from 'ant-design-vue/es/pagination/Pagination';
import { ColumnProps, TableProps, tableProps } from 'ant-design-vue/lib/table';
import { Workbook, Worksheet } from 'exceljs';

import { IDataSource, IPaginationParams } from '../../types';

export type IXTableChangeType = 'excel' | 'filter' | 'sorter' | 'pagination';

export type IXTableRowKeyFunc<TModel extends UnknownType<any> = UnknownType<any>> = (
  record: TModel,
  index: number
) => string;

export type IXTableModelExtend<T extends UnknownType> = Partial<T> & {
  /**
   * 是否处于行内编辑状态
   */
  _inlineEditing?: boolean;
  /**
   * 展开行的引用，用于表格嵌套场景
   */
  _expandedRef?: unknown;
} & Record<string, any>;

export type IXTableFilters<TModel extends UnknownType<any> = UnknownType<any>> = Record<keyof TModel, string[]>;

export type IXTableColumnProps<
  TModel extends UnknownType<any> = UnknownType<any>,
  TMeta extends UnknownType = never
> = Omit<ColumnProps, 'customRender' | 'dataIndex' | 'filters'> & {
  dataIndex?: keyof TModel;
  customRender?: (data: {
    text: any;
    record: IXTableModelExtend<TModel>;
    index: number;
  }) => number | string | VNode | VNode[];

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
   * 用于 Excel 导出的选项
   */
  excel?: IWorksheetColumn<TModel>;

  /**
   * 附加的数据
   */
  meta?: TMeta;
};

export interface IXTableSorter<TModel extends UnknownType<any> = UnknownType<any>, TMeta extends UnknownType = never> {
  column: IXTableColumnProps<TModel, TMeta>;
  columnKey: keyof TModel;
  field: keyof TModel;
  order: 'asc' | 'desc' | false;
}

export interface IXTableHandlers<TModel extends UnknownType<any> = UnknownType<any>> {
  /**
   * 获取 Ant Table 实例
   */
  getAntTableRef?: () => any;

  /**
   * 获取 html 节点
   */
  getElement?: () => HTMLElement;

  /**
   * 手动设置数据
   * @param index 数据所在数组中的序号
   * @param data 待更新的数据
   */
  setData?: (data: IXTableModelExtend<TModel>[]) => void;

  /**
   * 添加数据
   * @param start 指定插入的开始位置（从0计数）。如果超出了数组的长度，则从数组末尾开始添加内容；如果是负值，则表示从数组末位开始的第几位（从-1计数，这意味着-n是倒数第n个元素并且等价于array.length-n）；如果负数的绝对值大于数组的长度，则表示开始位置为第0位。
   * @param data 插入的数据或者数组
   */
  addData?: (start: number, data: IXTableModelExtend<TModel> | IXTableModelExtend<TModel>[]) => void;

  /**
   * 更新数据
   * @param index 数据所在数组中的序号
   * @param data 待更新的数据
   */
  updateData?: (index: number, data: IXTableModelExtend<TModel>) => void;

  /**
   * 重新渲染 columns，当修改 column 选项后，需手动执行该函数
   */
  updateColumns?: () => void;

  /**
   * 删除指定数据
   * @param index 数据所在数组中的序号
   */
  removeData?: (index: number) => void;

  /**
   * 获取选中的数据
   */
  getSelectedData?: () => IXTableModelExtend<TModel>[];

  /**
   * 获取所有（非过滤、排序、分页后）数据
   */
  getAllData?: () => IXTableModelExtend<TModel>[];

  /**
   * 获取所有过滤、排序后（非分页后）的数据，
   */
  getCurrentData?: () => IXTableModelExtend<TModel>[];

  /**
   * 全选
   */
  selectAll?: () => Promise<void>;

  /**
   * 反选
   */
  selectInvert?: () => Promise<void>;

  /**
   * 刷新数据
   */
  refresh?: () => Promise<void>;

  /**
   * 刷新数据，重置分页、将会重新请求远端数据
   */
  reload?: () => Promise<void>;

  /**
   * 校验表格数据
   */
  validate?: () => Promise<boolean>;

  /**
   * 校验表格指定的行数据
   * @param row
   */
  validateRow?: (row: IXTableModelExtend<TModel>) => Promise<boolean>;

  /**
   * 手动触发 record change 事件
   * @param record
   */
  handleRecordChange?: (record: IXTableModelExtend<TModel>) => void;

  /**
   * 导出到 Excel
   * @param data
   */
  downloadExcel?: (
    data?: IXTableModelExtend<TModel>,
    filename?: string,
    contentType?: string,
    action?: string,
    showHiddenColumn?: boolean,
    columns?: IWorksheetColumn<Record<string, any>>[],
    dataParse?: (data: any[]) => { data: any[]; columns?: IWorksheetColumn<Record<string, any>>[] }
  ) => Promise<void>;

  /**
   * 进入全屏浏览模式
   */
  fullscreen?: () => void;

  /**
   * 退出全屏浏览
   */
  fullscreenExit?: () => void;

  /**
   * 打开当前表格的设置面板，用于自定义列的显隐、宽度、顺序、fixed
   * @param row
   */
  presentSettingsPanel?: (onDismissed?: (changed: boolean) => void) => Promise<void>;
}

export interface IXTableListenersType<
  TModel extends UnknownType<any> = UnknownType<any>,
  TMeta extends UnknownType = never
> {
  // Ant table events
  /**
   * 分页、排序、筛选变化时触发
   */
  readonly change?: (changer: {
    /**
     * 类型
     */
    type: IXTableChangeType;
    pagination: IPaginationParams;
    filters: IXTableFilters<TModel>;
    sorter: IXTableSorter<TModel, TMeta>;
    /**
     * 当前数据
     */
    currentData: IXTableModelExtend<TModel>[];
    /**
     * 所有数据
     */
    overallData: IXTableModelExtend<TModel>[];
  }) => void;

  /**
   * 展开的行变化时触发
   */
  readonly expandedRowsChange?: (expandedRows: string[]) => void;

  /**
   * 点击展开图标时触发
   */
  readonly expand?: (expanded: boolean, record: IXTableModelExtend<TModel>) => void;

  // Custom events

  /**
   * 请求错误后触发
   */
  readonly failed?: (err: Error) => void;

  /**
   * 数据项更新后触发，用于行数据编辑
   */
  readonly recordChange?: (record: IXTableModelExtend<TModel>) => void;

  /**
   * 当前页数据更新后触发, 切换分页、过滤、筛选等
   */
  readonly dataChange?: (data: IXTableModelExtend<TModel>[]) => void;

  /**
   * 数据加载成功后触发, 当 dataSource 配置为远端数据时, 将会在每次请求后触发
   */
  readonly dataLoaded?: (data: IXTableModelExtend<TModel>[]) => void;

  /**
   * 用户手动选择/取消选择某行的回调
   */
  readonly rowSelect?: (record: IXTableModelExtend<TModel>, selected: boolean, selectedRows, nativeEvent) => void;

  /**
   * 选中项发生变化时的回调
   */
  readonly rowSelectChange?: (
    selectedRowKeys: ColumnProps['key'][],
    selectedRows: IXTableModelExtend<TModel>[]
  ) => void;

  /**
   * 用户全选所有行的回调
   */
  readonly rowSelectAll?: (
    selected: boolean,
    selectedRows: IXTableModelExtend<TModel>[],
    changeRows: IXTableModelExtend<TModel>[]
  ) => void;

  /**
   * 用户手动选择反选的回调
   */
  readonly rowSelectInvert?: (selectedRows: IXTableModelExtend<TModel>[]) => void;

  /**
   * 在下载 Excel 之前执行，可在此更新 Excel worksheet 和 workbook 对象
   */
  readonly beforeDownloadExcel?: (worksheet: Worksheet, workbook: Workbook) => Promise<void>;
}

export interface IXTablePropsType<TModel extends UnknownType, TParams extends UnknownType, TMeta extends UnknownType>
  extends Omit<TableProps<TModel>, 'locale' | 'columns' | 'dataSource' | 'rowKey' | 'scroll'> {
  // Override Antd
  locale?: Partial<typeof tableProps>;
  columns?: IXTableColumnProps<TModel, TMeta>[];
  rowKey?: keyof IXTableModelExtend<TModel> | IXTableRowKeyFunc<IXTableModelExtend<TModel>>;
  scroll?: { x?: boolean | number; y?: boolean | number };

  /**
   * 忽略全局标题栏（前部）添加的节点
   */
  ignoreTitlePrefix?: boolean;
  /**
   * 忽略全局标题栏（尾部）添加的节点
   */
  ignoreTitleSuffix?: boolean;

  /**
   * 表格名称，唯一值
   */
  name?: string;

  /**
   * 是否自动加载数据，默认为 true
   */
  autoload?: boolean;

  /**
   * 列的属性拓展
   * @param column
   * @constructor
   */
  columnMap?: (column: IXTableColumnProps<TModel, TMeta>) => IXTableColumnProps<TModel, TMeta>;

  /**
   * 数据源配置
   */
  dataSource?: IDataSource<
    IXTableModelExtend<TModel>,
    TParams,
    IXTableFilters<TModel>,
    IXTableSorter<IXTableModelExtend<TModel>, TMeta>
  >;
  // dataSource?: IDataSource<IXTableSorter<IXTableModelExtend<TModel>, TMeta>>;

  /**
   * 分页器配置
   */
  pagination?: Omit<PaginationProps, 'current' | 'total' | 'pageSize'>;

  // Custom props

  /**
   * 自适应滚动，设置此值后，将会根据父容器自动调整表格尺寸
   */
  autoScroll?: boolean;

  /**
   * 查询参数
   */
  params?: TParams;

  /**
   * 事件
   */
  listeners?: IXTableListenersType<TModel, TMeta>;
}

export interface IXTableRefType<
  TModel extends UnknownType<any> = UnknownType<any>,
  TParams extends UnknownType = never,
  TMethods extends UnknownType<(...args: unknown[]) => unknown> = never,
  TMeta extends UnknownType = never
> {
  options: IXTablePropsType<TModel, TParams, TMeta> & {
    /**
     * 指示当前是否处于全屏浏览的状态
     */
    readonly isFullscreen?: boolean;
  };
  handler: IXTableHandlers<TModel>;
  params: TParams;
  methods: TMethods;
}
