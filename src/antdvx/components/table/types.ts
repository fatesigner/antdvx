/**
 * types
 */

import { TableProps } from 'ant-design-vue/es/table/interface';
import { ColumnProps } from 'ant-design-vue/es/table/interface';
import { PaginationProps } from 'ant-design-vue/es/pagination/Pagination';

import { IDataSource } from '../../types/data-source';

export type IXTableRowKeyFunc<TModel extends Record<string, any>> = (record: TModel, index: number) => string;

export type IXTableModelExtend<T extends Record<string, any>> = Partial<T> & {
  /**
   * 是否处于行内编辑状态
   */
  _inlineEditing?: boolean;
  /**
   * 展开行的引用，用于子表
   */
  _expandedRef?: any;
} & Record<string, any>;

export type IXTableFilters<TModel extends Record<string, any> = Record<string, any>> = Record<keyof TModel, string[]>;

export interface IXTableSorter {
  column: IXTableColumnProps;
  columnKey: string;
  field: string;
  order: 'ascend' | 'descend' | false;
}

export type IXTableColumnProps<TModel extends Record<string, any> = Record<string, any>> = Omit<ColumnProps, 'filters'> & {
  dataIndex?: keyof TModel;
  filters?: {
    text: string;
    value: string;
    children?: {
      text: string;
      value: string;
    }[];
  }[];
  /**
   * 隐藏该列，默认为 false
   */
  hidden?: boolean;
};

export interface IXTableHandlers<TModel extends Record<string, any> = Record<string, any>> {
  /**
   * 获取 Ant Table 实例
   */
  getAntTableRef?: () => any;

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
   * 删除指定数据
   * @param index 数据所在数组中的序号
   */
  removeData?: (index: number) => void;

  /**
   * 获取选中的数据
   */
  getSelectedData?: () => IXTableModelExtend<TModel>[];

  /**
   * 获取所有数据，非分页后
   */
  getAllData?: () => IXTableModelExtend<TModel>[];

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
  validateRow?: (row: TModel) => Promise<boolean>;
}

export interface IXTablePropsType<TModel extends Record<string, any> = Record<string, any>, TParams extends Record<string, any> = Record<string, any>>
  extends Omit<TableProps, 'columns' | 'dataSource' | 'rowKey' | 'scroll'> {
  // Override Antd
  columns?: IXTableColumnProps<TModel>[];
  rowKey?: keyof TModel | IXTableRowKeyFunc<TModel>;
  scroll?: { x?: boolean | number; y?: boolean | number };

  /**
   * 数据源配置
   */
  dataSource?: IDataSource<TModel, TParams, IXTableFilters, IXTableSorter>;

  /**
   * 分页器配置
   */
  pagination?: Omit<PaginationProps, 'current' | 'total' | 'pageSize'> & {
    position?: 'top' | 'bottom' | 'both';
  };

  // Custom props

  /**
   * 查询参数
   */
  params?: TParams;

  /**
   * 事件
   */
  listeners?: IXTableListenersType<TModel>;
}

export interface IXTableListenersType<TModel extends Record<string, any> = Record<string, any>> {
  // Ant table events
  /**
   * 分页、排序、筛选变化时触发
   */
  readonly change?: (pagination, filters, sorter, row: { currentDataSource }) => void;
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
   * 数据项更新后触发
   */
  readonly recordChange?: (record: TModel) => void;
  /**
   * 用户手动选择/取消选择某行的回调
   */
  readonly rowSelect?: (record: TModel, selected: boolean, selectedRows, nativeEvent) => void;
  /**
   * 选中项发生变化时的回调
   */
  readonly rowSelectChange?: (selectedRowKeys: ColumnProps['key'][], selectedRows: TModel[]) => void;
  /**
   * 用户全选所有行的回调
   */
  readonly rowSelectAll?: (selected: boolean, selectedRows: TModel[], changeRows: TModel[]) => void;
  /**
   * 用户手动选择反选的回调
   */
  readonly rowSelectInvert?: (selectedRows: TModel[]) => void;
}

export interface IXTableRefType<
  TModel extends Record<string, any> = Record<string, any>,
  TParams extends Record<string, any> = Record<string, any>,
  TMethods extends Record<string, (...args: any[]) => any> = Record<string, (...args: any[]) => any>
> {
  options: IXTablePropsType<TModel, TParams>;
  handler: IXTableHandlers<TModel>;
  params: TParams;
  methods: TMethods;
}
