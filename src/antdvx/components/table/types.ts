import { UnknownType } from '@fatesigner/utils/types';
import { ColumnProps, TableProps, tableProps } from 'ant-design-vue/lib/table';

/**
 * Antdvx Table Props 类型
 */
export interface AntdvxTableProps<RecordType extends UnknownType<any> = UnknownType<any>> {}

/**
 * Antdvx Table Handler 类型
 */
export interface AntdvxTableHandlers<
  RecordType extends UnknownType<any> = UnknownType<any>,
  MethodsType extends UnknownType<(...args: unknown[]) => unknown> = UnknownType<(...args: unknown[]) => unknown>
> {
  /**
   * 获取 Antdv Table 实例
   */
  getAntTableRef?: () => any;

  /**
   * 刷新数据
   */
  refresh?: () => Promise<void>;

  /**
   * 刷新数据，重置分页、将会重新请求远端数据
   */
  reload?: () => Promise<void>;

  /**
   * 自定义函数
   */
  methods: MethodsType;
}

/**
 * Antdvx Table 引用类型
 */
export interface AntdvxTable<RecordType extends UnknownType<any> = UnknownType<any>> extends AntdvxTableHandlers {}
