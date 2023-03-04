import { defineComponent, nextTick, onMounted, PropType, ref, watch } from 'vue';
import { isFunction, isString } from '@fatesigner/utils/type-check';
import { notification, Table } from 'ant-design-vue';
import to from 'await-to-js';

import { defaultXTableProps } from './configure';
import {
  AntdvxTable,
  AntdvxTableChangeType,
  AntdvxTableColumnProps,
  AntdvxTableFilters,
  AntdvxTableListeners,
  AntdvxTableProps,
  AntdvxTableSorter
} from './types';

/**
 * Antdvx Table（对原 Antdv Table 组件的二次封装）
 */
export const XTable = defineComponent({
  props: {
    autoload: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    dataSchema: {
      type: Object
    },
    columns: {
      type: Array as PropType<AntdvxTableProps['columns']>,
      default: null
    },
    columnMap: Function as PropType<AntdvxTableProps['columnMap']>,
    listeners: Object as PropType<AntdvxTableListeners>
  },
  setup(props: any, { emit, expose }) {
    // 保存当前选中的过滤、筛选条件
    const filters: AntdvxTableFilters<any> = {} as any;
    const sorter: AntdvxTableSorter<any> = {} as any;
    let changeType: AntdvxTableChangeType;

    // 所有（非过滤、排序、分页后）数据
    let overallData = [];

    // 所有过滤、排序后（非分页后）的数据，
    const currentData = [];

    // Ant Table 组件 Ref
    const antRef = ref();

    // dataSchema
    const dataSchema = Object.assign({}, defaultXTableProps.dataSchema, props.dataSchema);

    // 列
    const columns_ = ref([]);
    // 数据
    const dataSource_ = ref([]);
    // Loading 状态
    const loading_ = ref(false);

    const getAntTableRef: AntdvxTable<any>['getAntTableRef'] = async () => {
      return antRef.value;
    };

    // 更新列
    const updateColumns: AntdvxTable<any>['updateColumns'] = async () => {
      console.log('updateColumns');
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

    // 处理数据，过滤、分页、筛选
    const processData = () => {
      let data = overallData.slice(0, overallData.length);

      // 是否执行客户端过滤
      if (!props.dataSchema?.serverFiltering) {
        if (filters) {
          const filterKeys = Object.keys(filters);
          if (filterKeys?.length) {
            data = data.filter((x) =>
              filterKeys.every((y) => {
                const filter = filters?.[y];
                if (filter?.length) {
                  const column = columns_.value.find((z) => z?.dataIndex === y);
                  if (isFunction(column?.onFilter)) {
                    return filter.some((z) => column.onFilter(z, x));
                  }
                  return filter.some((z) => x[y] === z);
                }
                return true;
              })
            );
          }
        }
      }

      // 是否执行客户端排序
      if (!props.dataSchema?.serverSorting) {
        if (sorter?.columnKey) {
          const column = columns_.value.find((x) => x?.dataIndex === sorter.columnKey);
          if (isFunction(column?.sorter)) {
            if (sorter.order === 'asc' || (sorter.order as any) === 'ascend') {
              data = data.sort((a, b) => {
                return column.sorter(a, b);
              });
            } else if (sorter.order === 'desc' || (sorter.order as any) === 'descend') {
              data = data.sort((a, b) => {
                return column.sorter(b, a);
              });
            }
          } else {
            if (sorter.order === 'asc' || (sorter.order as any) === 'ascend') {
              data = data.sort((a, b) => {
                return a[sorter.columnKey] > b[sorter.columnKey]
                  ? 1
                  : a[sorter.columnKey] < b[sorter.columnKey]
                  ? -1
                  : 0;
              });
            } else if (sorter.order === 'desc' || (sorter.order as any) === 'descend') {
              data = data.sort((a, b) => {
                return b[sorter.columnKey] > a[sorter.columnKey]
                  ? 1
                  : b[sorter.columnKey] < a[sorter.columnKey]
                  ? -1
                  : 0;
              });
            }
          }
        }
      }

      // 分页
      if (props.dataSchema?.serverPaging) {
        // 服务端分页
        dataSource_.value.splice(0, dataSource_.value.length, ...data);
      } else {
        // 客户端分页
        // dataSource_.value.total = data.length;
        if (props.pagination?.pageSize) {
          dataSource_.value.splice(
            0,
            dataSource_.value.length,
            ...data.slice(
              (props.pagination.pageNo - 1) * props.pagination.pageSize,
              props.pagination.pageNo * props.pagination.pageSize
            )
          );
        } else {
          dataSource_.value.splice(0, dataSource_.value.length, ...data);
        }
      }

      // emit event
      nextTick(() => {
        props.listeners?.dataChange?.(dataSource_.value);
      });
    };

    // 请求数据
    const loadData = async (firstLoad?: boolean) => {
      overallData = [];

      if (!firstLoad && dataSchema?.transport?.read) {
        loading_.value = true;

        let _res: any;
        let _err: any;

        if (isFunction(dataSchema.transport.read)) {
          const [err, res] = await to<any>(
            dataSchema.transport.read({
              pageNo: dataSchema.pageNo,
              pageSize: dataSchema.pageSize
            })
          );
          if (err) {
            _err = err;
          } else {
            _res = res;
          }
        } else {
          // TODO: 构造指定 url 的 http 请求
          /* const requestOptions: IDataSourceRequestOptions<any> = {
            url: '',
            method: 'GET',
            contentType: HttpContentType.JSON,
            dataType: 'json',
            params: {
              ...props?.params,
              pageNo: dataSchema.pageNo,
              pageSize: dataSchema.pageSize
            }
          };

          if (isString(dataSchema.transport.read)) {
            requestOptions.url = dataSchema.transport.read;
          } else {
            Object.assign(requestOptions, dataSchema.transport.read);
          }

          const [err, res] = await to<any>(AntdHttpAdapter(requestOptions));
          if (err) {
            _err = err;
          } else {
            _res = res;
          } */
        }

        if (_err) {
          let errMsg;
          if (isString(dataSchema.schema?.errors)) {
            errMsg = _res[dataSchema.schema.errors as string];
          } else if (isFunction(dataSchema.schema?.errors)) {
            errMsg = (dataSchema.schema.errors as Function)(_res);
          } else {
            errMsg = _err.message;
          }
          notification.error({ message: '', description: errMsg });
        } else {
          // 服务端分页
          if (dataSchema.serverPaging) {
            if (isFunction(dataSchema.transport?.read)) {
              overallData = _res.data;
              dataSchema.total = _res?.total ?? overallData.length;
            } else {
              // parse
              if (dataSchema.schema?.parse) {
                _res = dataSchema.schema?.parse(_res);
              }

              // total
              if (isString(dataSchema.schema?.total)) {
                dataSchema.total = _res[dataSchema.schema.total as string];
              } else if (isFunction(dataSchema.schema?.total)) {
                dataSchema.total = (dataSchema.schema.total as Function)(_res);
              }

              // data
              if (isString(dataSchema.schema?.data)) {
                overallData = _res[dataSchema.schema.data as string];
              } else if (isFunction(dataSchema.schema?.data)) {
                overallData = (dataSchema.schema.data as Function)(_res);
              } else {
                overallData = _res;
              }
            }
          } else {
            // 客户端分页
            overallData = _res.data;
            dataSchema.total = _res?.total ?? overallData.length;
          }
        }

        loading_.value = false;

        // emit event
        nextTick(() => {
          props.listeners?.dataLoaded?.(overallData);
        });
      } else {
        // 静态数据
        if (dataSchema.data) {
          overallData = dataSchema.data.slice(0, dataSchema.data.length);
          dataSchema.total = overallData.length;

          // emit event
          nextTick(() => {
            props.listeners?.dataLoaded?.(overallData);
            props.listeners?.dataChange?.(dataSchema.data);
          });
        }
      }
    };

    watch(
      () => props.loading,
      (val) => {
        if (loading_.value !== val) {
          loading_.value = val;
        }
      },
      {
        immediate: true
      }
    );

    // 指定暴露到外部的变量和函数
    expose({
      columns: columns_,
      dataSchema,
      getAntTableRef,
      updateColumns
    });

    // 初始化列
    updateColumns();

    onMounted(() => {
      loadData(!props.autoload).then(() => {
        processData();
      });
    });

    return {
      columns_,
      dataSource_,
      loading_
    };
  },
  render(ctx) {
    return (
      <Table
        ref='antRef'
        columns={ctx.columns_}
        dataSource={ctx.dataSource_}
        loading={ctx.loading_}
        v-slots={ctx.$slots}></Table>
    );
  }
});
