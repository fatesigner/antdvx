import { onMounted, ref } from 'vue';
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
export function useXTable<
  RecordType extends UnknownType<any> = UnknownType<any>,
  MethodsType extends UnknownType<(...args: unknown[]) => unknown> = UnknownType<(...args: unknown[]) => unknown>
>(props: AntdvxTableProps<RecordType>, methods?: MethodsType): AntdvxTable<RecordType, MethodsType> {
  const res: AntdvxTable<RecordType, MethodsType> = {
    getAntTableRef: null,
    refresh: null,
    updateColumns: null,
    methods
  } as any;

  // 代理异步函数
  const bindProperties: Array<keyof AntdvxTable<RecordType>> = ['refresh', 'updateColumns'];

  bindLazyFunc(res, bindProperties);

  const compRef = ref<AntdvxTable<RecordType, MethodsType>>();

  const Table = function (_, ctx) {
    return (
      <XTable
        ref={(e: any) => {
          if (e) {
            compRef.value = e;
          }
        }}
        {...(props as any)}
        v-slots={ctx.slots}
      />
    );
  } as any;

  res.Table = Table;

  onMounted(() => {
    /* res.getAntTableRef = compRef.value.getAntTableRef;
    res.updateColumns = compRef.value.updateColumns; */
    Object.assign(res, compRef.value);
  });

  return res;
}
