import { DefineComponent } from 'vue';
import { bindLazyFunc } from '@fatesigner/utils';
import { UnknownType } from '@fatesigner/utils/types';

import { XTable } from './table';
import { AntdvxTable, AntdvxTableProps } from './types';

/**
 * 创建 Antdvx Table 组件
 * @param props
 * @param params
 * @param methods
 */
export function createXTable<
  RecordType extends UnknownType<any> = UnknownType<any>,
  MethodsType extends UnknownType<(...args: unknown[]) => unknown> = UnknownType<(...args: unknown[]) => unknown>
>(props: AntdvxTableProps<RecordType>, methods?: MethodsType): AntdvxTable<RecordType, MethodsType> {
  const res: AntdvxTable<RecordType, MethodsType> = {
    getAntTableRef: null,
    refresh: null,
    methods
  } as any;

  // 代理异步函数
  const bindProperties: Array<keyof AntdvxTable<RecordType>> = ['refresh'];

  bindLazyFunc(res, bindProperties);

  const Table = function (_p, ctx) {
    return <XTable columns={props.columns} v-slots={ctx.$slots} />;
  } as any;

  res.Table = Table;

  return res;
}
