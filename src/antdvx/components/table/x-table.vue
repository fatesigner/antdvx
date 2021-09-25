<template>
  <div class="ant-table-x" v-bind="$attrs">
    <ATable
      ref="antTableRef"
      :bordered="options.bordered"
      :children-column-name="options.childrenColumnName"
      :columns="columns_"
      :components="options.components"
      :data-source="options.dataSource.data"
      :default-expand-all-rows="options.defaultExpandAllRows"
      :default-expanded-row-keys="options.defaultExpandedRowKeys"
      :expanded-row-keys="options.expandedRowKeys"
      :expand-row-by-click="options.expandRowByClick"
      :expand-icon-column-index="options.expandIconColumnIndex"
      :indent-size="options.indentSize"
      :loading="options.loading"
      :locale="options.locale"
      :pagination="false"
      :row-class-name="options.rowClassName"
      :row-key="getRowKey"
      :row-selection="
        options.rowSelection
          ? {
              columnWidth: options.rowSelection.columnWidth,
              columnTitle: options.rowSelection.columnTitle,
              //fixed: options.rowSelection.fixed,
              getCheckboxProps: options.rowSelection.getCheckboxProps,
              hideDefaultSelections: options.rowSelection.hideDefaultSelections,
              selectedRowKeys: options.rowSelection.selectedRowKeys,
              selections: options.rowSelection.selections,
              type: options.rowSelection.type,
              onSelect: onRowSelect,
              onChange: onRowSelectChange,
              onSelectAll: onRowSelectAll,
              onSelectInvert: onRowSelectInvert
            }
          : null
      "
      :scroll="options.scroll"
      :show-header="options.showHeader"
      :size="options.size"
      :custom-header-row="options.customHeaderRow"
      :custom-row="options.customRow"
      @change="onChange"
      @expandedRowsChange="onExpandedRowsChange"
      @expand="onExpand"
    >
      <template v-for="(_, name) in $slots" #[name]="slotData">
        <template v-if="name === 'title'">
          <div class="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw--ml-2 tw--mr-2 tw--mt-2 tw-pb-1">
            <div class="tw-flex-1 tw-p-2">
              <slot :name="name" v-bind="{ ...slotData, options, params, methods, handler, handleRecordChange }" />
            </div>
            <div
              class="tw-flex-initial tw-p-2"
              v-if="
                options.dataSource.data.length &&
                options.pagination &&
                options.dataSource.pageSize &&
                (options.pagination.position === 'both' || options.pagination.position === 'top')
              "
            >
              <APagination
                :size="options.pagination.size"
                :page-size-options="options.pagination.pageSizeOptions"
                :show-quick-jumper="options.pagination.showQuickJumper"
                :show-size-changer="options.pagination.showSizeChanger"
                :show-total="
                  (total, range) => `${range[0]}-${range[1]} ` + $t(i18nMessages.antd.pagination.of) + ` ${total} ` + $t(i18nMessages.antd.pagination.items)
                "
                :total="options.dataSource.total"
                v-model:current="options.dataSource.pageNo"
                v-model:page-size="options.dataSource.pageSize"
                @change="onPageChange"
                @showSizeChange="onPageSizeChange"
              />
            </div>
          </div>
        </template>
        <template v-else>
          <slot :name="name" v-bind="{ ...slotData, options, params, methods, handler, handleRecordChange }" />
        </template>
      </template>
    </ATable>
    <div
      v-if="
        options.dataSource.data.length &&
        options.pagination &&
        options.dataSource.pageSize &&
        (options.pagination.position === 'both' || options.pagination.position === 'bottom')
      "
      class="tw-flex tw-justify-end tw-mt-4 tw-transition-opacity"
      :class="{ ' tw-pointer-events-none tw-opacity-50': options.loading }"
    >
      <APagination
        :size="options.pagination.size"
        :page-size-options="options.pagination.pageSizeOptions"
        :show-quick-jumper="options.pagination.showQuickJumper"
        :show-size-changer="options.pagination.showSizeChanger"
        :show-total="(total, range) => `${range[0]}-${range[1]} ` + $t(i18nMessages.antd.pagination.of) + ` ${total} ` + $t(i18nMessages.antd.pagination.items)"
        :total="options.dataSource.total"
        v-model:current="options.dataSource.pageNo"
        v-model:page-size="options.dataSource.pageSize"
        @change="onPageChange"
        @showSizeChange="onPageSizeChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
import to from 'await-to-js';
import { debounce } from '@fatesigner/utils';
import { isArray, isFunction, isNullOrUndefined, isString } from '@fatesigner/utils/type-check';
import { PropType, defineComponent, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { Pagination, Table, notification } from 'ant-design-vue';

import { AntdHttpAdapter } from '../../config';
import { i18nMessages } from '../../i18n/messages';
import { HttpContentType, IDataSourceRequestOptions } from '../../types/data-source';

import { IXTableChangeType, IXTableFilters, IXTableHandlers, IXTablePropsType, IXTableSorter } from './types';
import { defaultXTableProps } from './table';

const elementResizeDetectorMaker = require('element-resize-detector');
const erd = elementResizeDetectorMaker();

export default defineComponent({
  name: 'x-table',
  components: { [Table.name]: Table, [Pagination.name]: Pagination },
  emits: [],
  props: {
    options: {
      type: Object as PropType<IXTablePropsType<any, any>>,
      default() {
        return defaultXTableProps;
      }
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
    const antTableRef = ref();

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
        return (props.options.rowKey as Function)(record, index);
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
            data = data.filter((x) => filterKeys.every((y) => filters[y].includes(x[y])));
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
          let [err, res] = await to<any>(
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
          let requestOptions: IDataSourceRequestOptions = {
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

          let [err, res] = await to<any>(AntdHttpAdapter(requestOptions));
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
      return overallData;
    };

    // update handlers
    if (props.handler) {
      Object.assign(props.handler, {
        getAntTableRef,
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
              let x_ = Object.assign({}, x);
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
      let key = getRowKey(record);
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

    onMounted(() => {
      loadData().then(() => {
        processData();
      });

      // 监听窗口尺寸变化
      if (antTableRef.value?.$el) {
        erd.listenTo(antTableRef.value.$el, resizeFixedRows);
      }
    });

    onUnmounted(() => {
      // 移除窗口尺寸的监听
      if (antTableRef.value?.$el) {
        erd.removeListener(antTableRef.value.value, resizeFixedRows);
      }
    });

    return {
      i18nMessages,
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
  }
});
</script>

<style lang="less">
.ant-table-x {
  background-color: #fff;

  .ant-table-title {
    padding: 0 !important;
  }

  .ant-table.ant-table-bordered .ant-table-title {
    border: none;
  }
}
</style>
