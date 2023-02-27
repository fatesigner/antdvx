import { bindLazyFunc } from '@fatesigner/utils';
import { UnknownType } from '@fatesigner/utils/types';

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
>(props: AntdvxTableProps<RecordType>, methods?: MethodsType): AntdvxTable<RecordType> {
  const res: AntdvxTable<RecordType> = {
    getAntTableRef: null,
    refresh: null,
    methods
  };

  // 代理异步函数
  const bindProperties: Array<keyof AntdvxTable<RecordType>> = ['refresh'];

  bindLazyFunc(res, bindProperties);

  return res;
}
