/**
 * table
 */

import to from 'await-to-js';
import { merge } from 'lodash-es';
import { bindLazyFunc, debounce } from '@fatesigner/utils';
import { TableProps } from 'ant-design-vue/es/table/interface';
import { Pagination, Table, notification } from 'ant-design-vue';
import { isArray, isFunction, isNullOrUndefined, isString } from '@fatesigner/utils/type-check';
import { PropType, defineComponent, h, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue';

import { AntdHttpAdapter } from '../../config';
import { i18nMessages } from '../../i18n/messages';
import { HttpContentType, IDataSourceRequestOptions } from '../../types/data-source';

import { IconAddBoxLine, IconAngleDoubleDown, IconCheckboxIndeterminateLine } from '../iconfont';

import { IXTableChangeType, IXTableFilters, IXTableHandlers, IXTablePropsType, IXTableRefType, IXTableSorter } from './types';

export const getDefaultXTableProps = function (): IXTablePropsType<any, any> {
  return {
    loading: false,
    // scroll: { x: true },
    dataSource: {
      data: [],
      pageNo: 1,
      pageSize: 10,
      schema: {
        data: 'data',
        total: 'total'
      }
    },

    // 展开行
    expandRowByClick: false,
    expandedRowKeys: [],
    defaultExpandAllRows: false,
    defaultExpandedRowKeys: [],

    pagination: {
      size: 'small',
      position: 'both',
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions: ['5', '10', '20', '30', '50', '100']
    }
  };
};

/**
 *  创建 XTable 实例
 * @param props
 * @param params
 * @param methods
 */
export function createXTable<TModel extends Record<string, any>, TParams extends Record<string, any>, TMethods extends Record<string, (...args: any[]) => any>>(
  props: IXTablePropsType<TModel, TParams>,
  params?: TParams,
  methods?: TMethods
): IXTableRefType<TModel, TParams, TMethods> {
  const handler: IXTableHandlers<TModel> = {
    getAntTableRef: null,
    getElement: null,
    addData: null,
    updateData: null,
    removeData: null,
    getSelectedData: null,
    getAllData: null,
    selectAll: null,
    selectInvert: null,
    refresh: null,
    reload: null,
    validate: null,
    validateRow: null
  };

  // 代理异步函数
  const bindProperties: Array<keyof IXTableHandlers<TModel>> = ['refresh', 'reload', 'validate', 'validateRow'];

  bindLazyFunc(handler, bindProperties);

  return {
    options: reactive(merge({}, getDefaultXTableProps(), props) as any),
    handler,
    params: reactive(Object.assign({}, params) as any),
    methods
  };
}

/**
 * XTable 表格组件
 */
export const XTable = defineComponent({
  name: 'x-table',
  props: {
    options: {
      type: Object as PropType<IXTablePropsType<any, any>>
    },
    // params
    params: {
      type: Object
    },
    // methods
    methods: {
      type: Object
    },
    // handler
    handler: {
      type: Object as PropType<IXTableHandlers<any>>
    }
  },
  setup(props: any) {
    const wrapRef = ref<HTMLElement>();
    const topRef = ref<HTMLElement>();
    const bottomRef = ref<HTMLElement>();

    const antTableRef = ref();

    if (props.options.autoScroll) {
      props.options.scroll = Object.assign(
        {
          y: 0
        },
        props.options.scroll
      );
    }

    // 列
    const columns_ = reactive([]);

    // 所有数据项
    let overallData = [];

    // 当前选中的数据项
    let selectedRows = [];

    // 当前选中的过滤、筛选条件
    let filters: IXTableFilters<any> = {} as any;
    let sorter: IXTableSorter<any> = {} as any;

    // 重绘 fixed 行高度，以解决 fixed 错位的渲染问题
    const resizeFixedRows = debounce(() => {
      if (!antTableRef.value?.$el) {
        return;
      }
      // const rf = this.$el.offsetHeight;
      // this.$refs.tableRef.saveRowRef();
      const main = Array.from(antTableRef.value.$el.querySelectorAll('.ant-table-body .ant-table-row')).map((el: HTMLElement) => el.offsetHeight);

      const fixedL = Array.from(antTableRef.value.$el.querySelectorAll('.ant-table-fixed-left .ant-table-row'));
      const fixedR = Array.from(antTableRef.value.$el.querySelectorAll('.ant-table-fixed-right .ant-table-row'));

      // 将 styles 一次性重绘
      window.requestAnimationFrame(() => {
        fixedL.forEach((el: HTMLElement, index) => {
          el.style.height = main[index] + 'px';
        });
        fixedR.forEach((el: HTMLElement, index) => {
          el.style.height = main[index] + 'px';
        });
      });

      // 设置高度
      if (props.options.autoScroll) {
        props.options.scroll.y =
          wrapRef.value.offsetHeight -
          (topRef.value?.offsetHeight ?? 0) -
          (bottomRef.value?.offsetHeight ?? 0) -
          ((wrapRef.value.querySelector('.ant-table-thead') as HTMLElement)?.offsetHeight + 5);
      }
    }, 100);

    // Get record key
    const getRowKey = (record: Record<string, any>, index?: number) => {
      if (isString(props.options.rowKey)) {
        if (Object.prototype.hasOwnProperty.call(record, props.options.rowKey)) {
          if (record[props.options.rowKey as string]) {
            return record[props.options.rowKey as string];
          }
        }
      }

      if (isNullOrUndefined(index)) {
        index = props.options.dataSource.data.findIndex((x) => x === record);
      }

      if (isFunction(props.options.rowKey)) {
        return (props.options.rowKey as any)(record, index);
      }

      return index;
    };

    // 处理数据，过滤、分页、筛选
    const processData = () => {
      if (props?.options?.dataSource?.serverPaging) {
        // 服务端分页
        props.options.dataSource.data.splice(0, props.options.dataSource.data.length, ...overallData);

        // emit event
        props.options?.listeners?.dataChange?.(props.options.dataSource.data);
      } else {
        let data = overallData.slice(0, overallData.length);

        // 客户端过滤
        if (filters) {
          const filterKeys = Object.keys(filters);
          if (filterKeys?.length) {
            data = data.filter((x) =>
              filterKeys.every((y) => {
                const column = props.options.columns.find((x) => x.dataIndex === y);
                if (isFunction(column?.onFilter)) {
                  return filters[y].every((z) => column.onFilter(z, x));
                }
                return filters[y].every((z) => x[y]?.toLowerCase().indexOf(z.toLowerCase()) > -1);
              })
            );
          }
        }

        // 客户端排序
        if (sorter?.columnKey) {
          const column = props.options.columns.find((x) => x.dataIndex === sorter.columnKey);
          if (isFunction(column?.sorter)) {
            if (sorter.order === 'ascend') {
              data = data.sort((a, b) => {
                return column.sorter(a, b);
              });
            } else if (sorter.order === 'descend') {
              data = data.sort((a, b) => {
                return column.sorter(b, a);
              });
            }
          } else {
            if (sorter.order === 'ascend') {
              data = data.sort((a, b) => {
                return a[sorter.columnKey] - b[sorter.columnKey];
              });
            } else if (sorter.order === 'descend') {
              data = data.sort((a, b) => {
                return b[sorter.columnKey] - a[sorter.columnKey];
              });
            }
          }
        }

        // 客户端分页
        props.options.dataSource.total = data.length;
        if (props?.options?.pagination && props.options.dataSource?.pageSize) {
          props.options.dataSource.data.splice(
            0,
            props.options.dataSource.data.length,
            ...data.slice(
              (props.options.dataSource.pageNo - 1) * props.options.dataSource.pageSize,
              props.options.dataSource.pageNo * props.options.dataSource.pageSize
            )
          );
        } else {
          props.options.dataSource.data.splice(0, props.options.dataSource.data.length, ...data);
        }

        // emit event
        props.options?.listeners?.dataChange?.(props.options.dataSource.data);
      }

      // 重置 rowSlections
      if (props?.options?.rowSelection) {
        props.options.rowSelection.selectedRowKeys = [];
      }

      // 重置 rowSlections
      if (props?.options?.rowSelection) {
        props.options.rowSelection.selectedRowKeys = [];
      }
      // 重置 expandedRowKeys
      props.options.expandedRowKeys = [];
    };

    // 请求数据
    const loadData = async () => {
      overallData = [];

      if (props?.options?.dataSource.transport?.read) {
        props.options.loading = true;

        let _res: any;
        let _err: any;

        if (isFunction(props?.options?.dataSource.transport?.read)) {
          const [err, res] = await to<any>(
            props.options.dataSource.transport.read(
              {
                pageNo: props.options.dataSource.pageNo,
                pageSize: props.options.dataSource.pageSize
              },
              props.params,
              filters,
              sorter
            )
          );
          if (err) {
            _err = err;
          } else {
            _res = res;
          }
        } else {
          const requestOptions: IDataSourceRequestOptions = {
            url: '',
            method: 'GET',
            contentType: HttpContentType.JSON,
            dataType: 'json',
            params: {
              ...props?.params,
              pageNo: props.options.dataSource.pageNo,
              pageSize: props.options.dataSource.pageSize
            }
          };

          if (isString(props.options.dataSource.transport.read)) {
            requestOptions.url = props.options.dataSource.transport.read;
          } else {
            Object.assign(requestOptions, props.options.dataSource.transport.read);
          }

          const [err, res] = await to<any>(AntdHttpAdapter(requestOptions));
          if (err) {
            _err = err;
          } else {
            _res = res;
          }
        }

        if (_err) {
          let errMsg;
          if (isString(props?.options?.dataSource?.schema?.errors)) {
            errMsg = _res[props.options.dataSource.schema.errors];
          } else if (isFunction(props?.options?.dataSource?.schema?.errors)) {
            errMsg = props.options.dataSource.schema.errors(_res);
          } else {
            errMsg = _err.message;
          }
          notification.error({ message: '', description: errMsg });
        } else {
          // 服务端分页
          if (props?.options?.dataSource?.serverPaging) {
            if (isFunction(props?.options?.dataSource?.transport?.read)) {
              overallData = _res.data;
              props.options.dataSource.total = _res?.total ?? overallData.length;
            } else {
              // parse
              if (props?.options?.dataSource?.schema?.parse) {
                _res = props?.options?.dataSource?.schema?.parse(_res);
              }

              // total
              if (isString(props?.options?.dataSource?.schema?.total)) {
                props.options.dataSource.total = _res[props.options.dataSource.schema.total];
              } else if (isFunction(props?.options?.dataSource?.schema?.total)) {
                props.options.dataSource.total = props.options.dataSource.schema.total(_res);
              }

              // data
              if (isString(props?.options?.dataSource?.schema?.data)) {
                overallData = _res[props.options.dataSource.schema.data];
              } else if (isFunction(props?.options?.dataSource?.schema?.data)) {
                overallData = props.options.dataSource.schema.data(_res);
              } else {
                overallData = _res;
              }
            }
          } else {
            // 客户端分页
            overallData = _res.data;
            props.options.dataSource.total = _res?.total ?? overallData.length;
          }
        }

        props.options.loading = false;
        props.options?.listeners?.dataLoaded?.(overallData);
      } else {
        // 静态数据
        if (props?.options?.dataSource?.data) {
          overallData = props.options.dataSource.data.slice(0, props.options.dataSource.data.length);
          props.options.dataSource.total = overallData.length;

          // emit events
          props.options?.listeners?.dataLoaded?.(overallData);
          props.options?.listeners?.dataChange?.(props.options.dataSource.data);
        }
      }
    };

    // 刷新数据
    const refresh = async () => {
      props.options.loading = true;

      await loadData();

      processData();

      if (!props.options.dataSource.data.length && props.options.dataSource.pageNo > 1) {
        // 当数据为空，且当前页码不处于第一页，则重置分页
        props.options.dataSource.pageNo = 1;
        return refresh();
      }

      props.options.loading = false;
    };

    // 刷新数据，将会重置分页
    const reload = async () => {
      props.options.dataSource.pageNo = 1;
      return refresh();
    };

    // 全选
    const selectAll = async () => {
      if (props?.options?.rowSelection?.selectedRowKeys) {
        props.options.rowSelection.selectedRowKeys.splice(
          0,
          props.options.rowSelection.selectedRowKeys.length,
          ...props.options.dataSource.data.map((record, index) => getRowKey(record, index))
        );
        props?.options?.listeners?.rowSelectAll?.(true, [], []);
      }
    };

    // 反选
    const selectInvert = async () => {
      if (props?.options?.rowSelection?.selectedRowKeys) {
        props.options.rowSelection.selectedRowKeys.splice(
          0,
          props.options.rowSelection.selectedRowKeys.length,
          ...props.options.dataSource.data
            .map((record, index) => getRowKey(record, index))
            .filter((key) => props.options.rowSelection.selectedRowKeys.indexOf(key) < 0)
        );
        props?.options?.listeners?.rowSelectInvert?.(props.options.rowSelection.selectedRowKeys);
      }
    };

    // 数据项更新后，触发事件
    const handleRecordChange = (e) => {
      // Emit record-change
      // emit('recordChange', e);
      props?.options?.listeners?.recordChange?.(e);
    };

    // 获取 Ant table ref
    const getAntTableRef: IXTableHandlers<any>['getAntTableRef'] = () => {
      return antTableRef.value;
    };

    // 获取 html 节点
    const getElement: IXTableHandlers<any>['getElement'] = () => {
      return wrapRef.value;
    };

    const setData: IXTableHandlers<any>['setData'] = (data: Record<string, any>[]) => {
      overallData = data;
      processData();
    };

    const addData: IXTableHandlers<any>['addData'] = (start: number, data: Record<string, any> | Record<string, any>[]) => {
      if (isArray(data)) {
        props.options.dataSource.data.splice(start, 0, ...(data as any[]));
      } else {
        props.options.dataSource.data.splice(start, 0, ...[data]);
      }
    };

    const updateData: IXTableHandlers<any>['updateData'] = (index: number, data: Record<string, any>) => {
      props.options.dataSource.data.splice(index, 1, data);
    };

    const removeData: IXTableHandlers<any>['removeData'] = (index: number) => {
      props.options.dataSource.data.splice(index, 1);
      // TODO：update分页
      //props.options.dataSource.total -= 1;
    };

    const getSelectedData: IXTableHandlers<any>['getSelectedData'] = () => {
      return selectedRows;
    };

    const getAllData: IXTableHandlers<any>['getAllData'] = () => {
      return overallData?.length ? overallData : props.options.dataSource.data;
    };

    // update handlers
    if (props.handler) {
      Object.assign(props.handler, {
        getAntTableRef,
        getElement,
        setData,
        addData,
        updateData,
        removeData,
        getSelectedData,
        getAllData,
        selectAll,
        selectInvert,
        refresh,
        reload
        //validate: null,
        //validateRow: null
      } as IXTableHandlers<any>);
    }

    // 监控 columns 变化
    watch(
      () => props.options.columns,
      (val) => {
        columns_.splice(
          0,
          columns_.length,
          ...val
            .filter((x) => !x.hidden)
            .map((x) => {
              const x_ = Object.assign({}, x);
              if (x.sorter) {
                x_.sorter = true;
                // 默认排序
                if (x.defaultSortOrder) {
                  sorter.column = x_;
                  sorter.columnKey = x_.dataIndex;
                  sorter.field = x_.dataIndex;
                  sorter.order = x.defaultSortOrder;
                }
              }
              if (x.onFilter) {
                x_.onFilter = null;
              }
              return x_;
            })
        );
      },
      {
        immediate: true,
        deep: true
      }
    );

    // 切换 pageIndex
    const onPageChange = async () => {
      props?.options?.listeners?.change?.({
        type: 'pagination',
        pagination: {
          pageNo: props.options.dataSource.pageNo,
          pageSize: props.options.dataSource.pageSize
        },
        filters,
        sorter,
        currentData: props.options.dataSource.data,
        overallData
      });

      props.options.loading = true;

      if (props?.options?.dataSource?.serverPaging) {
        // 服务端分页
        await refresh();
      } else {
        processData();
      }

      props.options.loading = false;
    };

    // 切换 pageSize
    const onPageSizeChange = () => {
      nextTick(function () {
        props?.options?.listeners?.change?.({
          type: 'pagination',
          pagination: {
            pageNo: props.options.dataSource.pageNo,
            pageSize: props.options.dataSource.pageSize
          },
          filters,
          sorter,
          currentData: props.options.dataSource.data,
          overallData
        });

        props.options.loading = true;
        setTimeout(async function () {
          props.options.dataSource.pageNo = 1;
          if (props?.options?.dataSource?.serverPaging) {
            // 服务端分页，重新加载数据
            await refresh();
          } else {
            processData();
          }
          props.options.loading = false;
        }, 500);
      });
    };

    const onChange = (pagination, filters_: any, sorter_: any, { currentDataSource }) => {
      let type: IXTableChangeType;

      // 设置 change 类型
      if (JSON.stringify(filters) !== JSON.stringify(filters_)) {
        type = 'filter';
      } else if (JSON.stringify(sorter) !== JSON.stringify(sorter_)) {
        type = 'sorter';
      } else {
        type = 'pagination';
      }

      // 筛选
      filters = filters_;
      // 过滤
      sorter = sorter_;

      reload();

      props?.options?.listeners?.change?.({
        type,
        pagination: {
          pageNo: props.options.dataSource.pageNo,
          pageSize: props.options.dataSource.pageSize
        },
        filters,
        sorter,
        currentData: props.options.dataSource.data,
        overallData
      });
    };
    const onExpandedRowsChange = (expandedRows) => {
      props?.options?.listeners?.expandedRowsChange?.(expandedRows);
    };
    const onExpand = (expanded, record) => {
      const key = getRowKey(record);
      if (expanded) {
        props.options.expandedRowKeys.push(key);
      } else {
        props.options.expandedRowKeys = props.options.expandedRowKeys.filter((x) => x !== key);
      }
      props?.options?.listeners?.expand?.(expanded, record);
    };

    // RowSelection 事件
    const onRowSelect = (record: any, selected: boolean, _selectedRows, nativeEvent) => {
      props?.options?.listeners?.rowSelect?.(record, selected, _selectedRows, nativeEvent);
    };
    const onRowSelectChange = (selectedRowKeys, _selectedRows) => {
      if (props?.options?.rowSelection) {
        selectedRows = _selectedRows;
        if (props.options.rowSelection?.selectedRowKeys) {
          props.options.rowSelection.selectedRowKeys = selectedRowKeys;
        }
      }
      props?.options?.listeners?.rowSelectChange?.(selectedRowKeys, _selectedRows);
    };
    const onRowSelectAll = (selected: boolean, _selectedRows: any[], changeRows: any[]) => {
      props?.options?.listeners?.rowSelectAll?.(selected, _selectedRows, changeRows);
    };
    const onRowSelectInvert = (_selectedRows: any[]) => {
      props?.options?.listeners?.rowSelectInvert?.(_selectedRows);
    };

    let resizeObs: ResizeObserver;

    onMounted(() => {
      loadData().then(() => {
        processData();
      });

      // 监听窗口尺寸变化
      if (antTableRef.value?.$el) {
        if (!resizeObs) {
          resizeObs = new ResizeObserver(resizeFixedRows);
        }
        resizeObs.observe(antTableRef.value.$el);
      }
    });

    onUnmounted(() => {
      // 移除窗口尺寸的监听
      if (antTableRef.value?.$el) {
        if (resizeObs) {
          resizeObs.unobserve(antTableRef.value.value);
        }
      }
    });

    return {
      i18nMessages,
      wrapRef,
      topRef,
      bottomRef,
      antTableRef,
      columns_,
      onPageChange,
      onPageSizeChange,
      onRowSelect,
      onRowSelectChange,
      onRowSelectAll,
      onRowSelectInvert,
      handleRecordChange,
      getRowKey,

      // events
      onChange,
      onExpandedRowsChange,
      onExpand,

      // handler
      addData,
      updateData,
      removeData,
      refresh,
      reload
    };
  },
  render(ctx) {
    const solts = {
      title(slotData) {
        return (
          <div
            ref='topRef'
            class={['tw-flex', 'tw-flex-wrap', 'tw-items-center', 'tw-justify-between', ctx.options.bordered ? 'tw-p-2' : 'tw--ml-2 tw--mr-2 tw--mt-2 tw-pb-1']}
          >
            <div class={['tw-flex-1 tw-overflow-hidden', ctx.options.bordered ? undefined : 'tw-p-2']}>
              {ctx.$slots?.title?.({
                ...slotData,
                options: ctx.options,
                params: ctx.params,
                methods: ctx.methods,
                handler: ctx.handler,
                handleRecordChange: ctx.handleRecordChange
              })}
            </div>
            {ctx.options.dataSource.total &&
            ctx.options.pagination &&
            ctx.options.dataSource.pageSize &&
            (ctx.options.pagination.position === 'both' || ctx.options.pagination.position === 'top') ? (
              <div class='tw-flex-initial tw-p-2'>
                <Pagination
                  size={ctx.options.pagination.size}
                  pageSizeOptions={ctx.options.pagination.pageSizeOptions}
                  showQuickJumper={ctx.options.pagination.showQuickJumper}
                  showSizeChanger={ctx.options.pagination.showSizeChanger}
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} ` + ctx.$t(i18nMessages.antd.pagination.of) + ` ${total} ` + ctx.$t(i18nMessages.antd.pagination.items)
                  }
                  total={ctx.options.dataSource.total}
                  v-models={[
                    [ctx.options.dataSource.pageNo, 'current'],
                    [ctx.options.dataSource.pageSize, 'pageSize']
                  ]}
                  onChange={ctx.onPageChange}
                  onShowSizeChange={ctx.onPageSizeChange}
                />
              </div>
            ) : (
              ''
            )}
          </div>
        );
      }
    };

    for (const [name] of Object.entries(ctx.$slots)) {
      if (name !== 'title') {
        solts[name] = function (slotData) {
          return ctx.$slots?.[name]?.({
            ...slotData,
            options: ctx.options,
            params: ctx.params,
            methods: ctx.methods,
            handler: ctx.handler,
            handleRecordChange: ctx.handleRecordChange
          });
        };
      }
    }

    const props: TableProps = {
      bordered: ctx.options.bordered,
      childrenColumnName: ctx.options.childrenColumnName,
      columns: ctx.columns_,
      components: ctx.options.components,
      dataSource: ctx.options.dataSource.data,
      defaultExpandAllRows: ctx.options.defaultExpandAllRows,
      defaultExpandedRowKeys: ctx.options.defaultExpandedRowKeys,
      expandedRowKeys: ctx.options.expandedRowKeys,
      expandedRowRender: ctx.options.expandedRowRender,
      expandIcon:
        ctx.options.expandIcon ?? ctx.$slots?.expandedRowRender
          ? function ({ expandable, expanded, needIndentSpaced, onExpand, prefixCls, record }) {
              return (
                <div
                  class={['antdvx-table-expand-icon', expanded ? 'antdvx-table-expand-unfold' : undefined]}
                  title={expanded ? ctx.$t(i18nMessages.antd.action.fold) : ctx.$t(i18nMessages.antd.action.expand)}
                  onClick={(e) => {
                    onExpand(record, e);
                  }}
                >
                  {expanded ? <IconCheckboxIndeterminateLine /> : <IconAddBoxLine />}
                </div>
              );
            }
          : undefined,
      expandRowByClick: ctx.options.expandRowByClick,
      expandIconColumnIndex: ctx.options.expandIconColumnIndex,
      footer: ctx.options.footer,
      indentSize: ctx.options.indentSize,
      loading: ctx.options.loading,
      locale: ctx.options.locale,
      pagination: false,
      rowClassName: ctx.options.rowClassName,
      rowKey: ctx.getRowKey,
      rowSelection: ctx.options.rowSelection
        ? {
            fixed: ctx.options.rowSelection.fixed,
            columnWidth: ctx.options.rowSelection.columnWidth,
            columnTitle: ctx.options.rowSelection.columnTitle,
            getCheckboxProps: ctx.options.rowSelection.getCheckboxProps,
            hideDefaultSelections: ctx.options.rowSelection.hideDefaultSelections,
            selectedRowKeys: ctx.options.rowSelection.selectedRowKeys,
            selections: ctx.options.rowSelection.selections,
            type: ctx.options.rowSelection.type,
            onSelect: ctx.onRowSelect,
            onChange: ctx.onRowSelectChange,
            onSelectAll: ctx.onRowSelectAll,
            onSelectInvert: ctx.onRowSelectInvert
          }
        : null,
      showHeader: ctx.options.showHeader,
      size: ctx.options.size,
      customHeaderRow: ctx.options.customHeaderRow,
      customRow: ctx.options.customRow,
      getPopupContainer: ctx.options.getPopupContainer,
      transformCellText: ctx.options.getPopupContainer,
      onChange: ctx.onChange,
      onExpandedRowsChange: ctx.onExpandedRowsChange,
      onExpand: ctx.onExpand
    };

    if (ctx.options.scroll) {
      props.scroll = ctx.options.scroll;
    }

    return (
      <div class={['ant-table-x', ctx.options.autoScroll ? 'tw-h-full' : undefined]} ref='wrapRef'>
        {[
          h(
            Table,
            {
              ref: 'antTableRef',
              ...props
            },
            solts
          ),
          ctx.options.dataSource.total &&
          ctx.options.pagination &&
          ctx.options.dataSource.pageSize &&
          (ctx.options.pagination.position === 'both' || ctx.options.pagination.position === 'bottom') ? (
            <div
              ref='bottomRef'
              class={['tw-flex tw-justify-end tw-mt-4 tw-transition-opacity', ctx.options.loading ? 'tw-pointer-events-none tw-opacity-50' : undefined]}
            >
              <Pagination
                size={ctx.options.pagination.size}
                pageSizeOptions={ctx.options.pagination.pageSizeOptions}
                showQuickJumper={ctx.options.pagination.showQuickJumper}
                showSizeChanger={ctx.options.pagination.showSizeChanger}
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} ` + ctx.$t(i18nMessages.antd.pagination.of) + ` ${total} ` + ctx.$t(i18nMessages.antd.pagination.items)
                }
                total={ctx.options.dataSource.total}
                v-models={[
                  [ctx.options.dataSource.pageNo, 'current'],
                  [ctx.options.dataSource.pageSize, 'pageSize']
                ]}
                onChange={ctx.onPageChange}
                onShowSizeChange={ctx.onPageSizeChange}
              />
            </div>
          ) : (
            ''
          )
        ]}
      </div>
    );
  }
});
