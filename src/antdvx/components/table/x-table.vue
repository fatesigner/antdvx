<template>
  <ATable
    class="ant-table-x"
    ref="tableEl"
    v-bind="$attrs"
    :bordered="options.bordered"
    :children-column-name="options.childrenColumnName"
    :columns="options.columns"
    :components="options.components"
    :data-source="options.dataSource"
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
  >
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <template v-if="name === 'title'">
        <div class="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw--ml-2 tw--mr-2 tw--mt-2 tw-pb-1">
          <div class="tw-flex-1 tw-p-2">
            <slot :name="name" v-bind="{ ...slotData, loading: options.loading, addItem, updateItem, refresh, handleRecordChange }" />
          </div>
          <div
            class="tw-flex-initial tw-p-2"
            v-if="
              options.pagination &&
              options.pagination.pageSize &&
              (options.pagination.placement === 'all' || options.pagination.placement === 'top') &&
              options.pagination.total
            "
          >
            <APagination
              size="small"
              :show-total="
                (total, range) => `${range[0]}-${range[1]} ` + $t(i18nMessages.antd.pagination.of) + ` ${total} ` + $t(i18nMessages.antd.pagination.items)
              "
              :total="options.pagination.total"
              v-model:current="options.pagination.current"
              v-model:page-size="options.pagination.pageSize"
              @change="onPageChange"
              @showSizeChange="onPageChange"
            />
          </div>
        </div>
      </template>
      <template v-else-if="name === 'expandedRowRender'">
        <div class="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw--ml-2 tw--mr-2 tw--mt-2 tw-pb-2">
          <div class="tw-flex-initial tw-p-2"></div>
          <div class="tw-flex-1 tw-p-2">
            <slot :name="name" v-bind="{ ...slotData, loading: options.loading, addItem, updateItem, refresh, handleRecordChange }" />
          </div>
        </div>
      </template>
      <template v-else>
        <slot :name="name" v-bind="{ ...slotData, loading: options.loading, refresh, handleRecordChange }" />
      </template>
    </template>
  </ATable>
  <div
    v-if="
      options.pagination &&
      options.pagination.pageSize &&
      (options.pagination.placement === 'all' || options.pagination.placement === 'bottom') &&
      options.pagination.total
    "
    class="tw-flex tw-justify-end"
  >
    <APagination
      size="small"
      :show-total="(total, range) => `${range[0]}-${range[1]} ` + $t(i18nMessages.antd.pagination.of) + ` ${total} ` + $t(i18nMessages.antd.pagination.items)"
      :total="options.pagination.total"
      v-model:current="options.pagination.current"
      v-model:page-size="options.pagination.pageSize"
      @change="onPageChange"
      @showSizeChange="onPageChange"
    />
  </div>
</template>

<script lang="ts">
import to from 'await-to-js';
import { debounce } from '@fatesigner/utils';
import { isFunction, isString } from '@fatesigner/utils/type-check';
import { PropType, defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { Pagination, Table, notification } from 'ant-design-vue';

import { i18nMessages } from '../../i18n/messages';
import { AntdHttpAdapter } from '../../antdvx';
import { HttpContentType, IDataSourceRequestOptions } from '../../types/data-source';

import { IXTableHandlers, IXTableListenersType, IXTablePropsType } from './types';
import { defaultXTableProps } from './table';
import { timer } from 'rxjs';

const elementResizeDetectorMaker = require('element-resize-detector');
const erd = elementResizeDetectorMaker();

export default defineComponent({
  name: 'x-table',
  components: { [Table.name]: Table, [Pagination.name]: Pagination },
  emits: [],
  props: {
    options: {
      type: Object as PropType<IXTablePropsType>,
      default() {
        return defaultXTableProps;
      }
    },
    // listeners
    listeners: {
      type: Object as PropType<IXTableListenersType>,
      default: null
    },
    // handler
    handler: {
      type: Object as PropType<IXTableHandlers>,
      default: null
    }
  },
  setup(props: any) {
    const $table = ref(null);

    let selectedRows = [];
    let dataSource = [];

    // RowSelection 事件
    const onRowSelect = (record: any, selected: boolean, _selectedRows, nativeEvent) => {
      if (props?.options?.rowSelection) {
        selectedRows = _selectedRows;
      }
      if (props?.listeners?.onRowSelect) {
        props?.listeners?.onRowSelect(record, selected, _selectedRows, nativeEvent);
      }
    };
    const onRowSelectChange = (selectedRowKeys, _selectedRows) => {
      if (props?.options?.rowSelection) {
        selectedRows = _selectedRows;
        if (props.options.rowSelection?.selectedRowKeys) {
          props.options.rowSelection.selectedRowKeys = selectedRowKeys;
        }
      }
      if (props?.listeners?.onRowSelectChange) {
        props?.listeners?.onRowSelectChange(selectedRowKeys, _selectedRows);
      }
    };
    const onRowSelectAll = (selected: boolean, _selectedRows: any[], changeRows: any[]) => {
      if (props?.options?.rowSelection) {
        selectedRows = _selectedRows;
        if (props.options.rowSelection?.selectedRowKeys) {
          props.options.rowSelection.selectedRowKeys = _selectedRows.map((record, index) => getRowKey(record, index));
        }
      }
      if (props?.listeners?.onRowSelectAll) {
        props?.listeners?.onRowSelectAll(selected, _selectedRows, changeRows);
      }
    };
    const onRowSelectInvert = (_selectedRows: any[]) => {
      if (props?.options?.rowSelection) {
        selectedRows = _selectedRows;
      }
      if (props?.listeners?.onRowSelectInvert) {
        props?.listeners?.onRowSelectInvert(_selectedRows);
      }
    };

    // 重绘 fixed 行高度，以解决 fixed 错位的渲染问题
    const resizeFixedRows = debounce(() => {
      if (!$table.value?.$el) {
        return;
      }
      // const rf = this.$el.offsetHeight;
      // this.$refs.tableRef.saveRowRef();
      const main = Array.from($table.value.$el.querySelectorAll('.ant-table-body .ant-table-row')).map((el: HTMLElement) => el.offsetHeight);

      const fixedL = Array.from($table.value.$el.querySelectorAll('.ant-table-fixed-left .ant-table-row'));
      const fixedR = Array.from($table.value.$el.querySelectorAll('.ant-table-fixed-right .ant-table-row'));

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
    const getRowKey = (record: Record<string, any>, index: number) => {
      if (isFunction(props.options.rowKey)) {
        return (props.options.rowKey as Function)(record, index);
      } else if (isString(props.options.rowKey)) {
        if (Object.prototype.hasOwnProperty.call(record, props.options.rowKey)) {
          if (record[props.options.rowKey as string]) {
            return record[props.options.rowKey as string];
          }
        }
      }
      return index;
    };

    // 客户端分页
    const paging = (data: any[]) => {
      // 客户端分页
      if (props.options.pagination?.pageSize) {
        props?.options?.dataSource.splice(
          0,
          props.options.dataSource.length,
          ...data.slice(
            (props.options.pagination.current - 1) * props.options.pagination.pageSize,
            props.options.pagination.current * props.options.pagination.pageSize
          )
        );
      } else {
        props.options.dataSource.splice(0, props.options.dataSource.length, ...data);
      }
    };

    const refresh = async () => {
      if (props?.options?.transport?.get) {
        props.options.loading = true;

        dataSource = [];
        let data = [];

        if (isFunction(props?.options?.transport?.get)) {
          let [err, res] = await to<any>(
            (props.options.transport.get as any)(
              {
                pageNo: props.options.pagination.current,
                pageSize: props.options.pagination.pageSize
              },
              props?.options?.params
            )
          );
          if (err) {
            notification.error({ message: '', description: err.message });
          } else {
            data = res;
          }
        } else {
          let requestOptions: IDataSourceRequestOptions = {
            url: '',
            method: 'GET',
            contentType: HttpContentType.JSON,
            dataType: 'json',
            params: {
              ...props?.options?.params,
              pageNo: props.options.pagination.current,
              pageSize: props.options.pagination.pageSize
            }
          };

          if (isString(props.options.transport.get)) {
            requestOptions.url = props.options.transport.get as string;
          } else {
            Object.assign(requestOptions, props.options.transport.get);
          }

          let [err, res] = await to<any>(AntdHttpAdapter(requestOptions));
          if (err) {
            notification.error({ message: '', description: err.message });
          } else {
            data = res;
          }
        }

        /*if (props.options.schema && props.options.schema.total) {
            props.options.total = props.options.schema.total.call(this.getContext(), res);
          } else {
            props.options.total = data.total;
          }*/

        if (props?.options?.pagination) {
          props.options.pagination.total = data.length;

          if (props?.options?.transport?.serverPaging) {
            // 服务端分页
            props.options.dataSource.splice(0, props.options.dataSource.length, ...data);
          } else {
            dataSource = data;
            paging(data);
          }
        }

        props.options.loading = false;
      }
    };

    // 切换 pageIndex 和 pageSize
    const onPageChange = () => {
      if (props?.options?.transport?.serverPaging) {
        // 服务端分页
        refresh();
      } else {
        props.options.loading = true;
        paging(dataSource);
        timer(500)
          .toPromise()
          .then(() => {
            props.options.loading = false;
          });
      }
    };

    // 全选
    const selectAll = async () => {
      if (props?.options?.rowSelection?.selectedRowKeys) {
        props.options.rowSelection.selectedRowKeys.splice(
          0,
          props.options.rowSelection.selectedRowKeys.length,
          ...props.options.dataSource.map((record, index) => getRowKey(record, index))
        );
        if (props?.listeners?.onRowSelectAll) {
          props?.listeners?.onRowSelectAll(true, [], []);
        }
      }
    };

    // 反选
    const selectInvert = async () => {
      if (props?.options?.rowSelection?.selectedRowKeys) {
        props.options.rowSelection.selectedRowKeys.splice(
          0,
          props.options.rowSelection.selectedRowKeys.length,
          ...props.options.dataSource
            .map((record, index) => getRowKey(record, index))
            .filter((key) => props.options.rowSelection.selectedRowKeys.indexOf(key) < 0)
        );
        if (props?.listeners?.onRowSelectInvert) {
          props?.listeners?.onRowSelectInvert(props.options.rowSelection.selectedRowKeys);
        }
      }
    };

    // Handle record change
    const handleRecordChange = (e) => {
      // Emit record-change
      // emit('recordChange', e);
      if (props?.listeners?.recordChange) {
        props.listeners.recordChange(e);
      }
    };

    const addItem: IXTableHandlers['addItem'] = async (record, options) => {
      props.options.dataSource.splice(options?.index ?? 0, 0, record);
    };

    const updateItem: IXTableHandlers['updateItem'] = async (key, record) => {
      let index = props.options.dataSource.findIndex((x, i) => getRowKey(x, i) === key);
      if (index > -1) {
        props.options.dataSource.splice(index, 1, record);
      } else {
        throw new Error(`Can not find the record with key is: "${key}"`);
      }
    };

    // update handlers
    if (props.handler) {
      Object.assign(props.handler, {
        refresh,
        //reload,
        //validate,
        //validateRow,
        addItem,
        updateItem,
        selectAll,
        selectInvert,
        getAllData() {
          return dataSource;
        },
        getSelectedRows() {
          return selectedRows;
        }
      } as IXTableHandlers);
    }

    onMounted(() => {
      refresh();

      // 监听窗口尺寸变化
      if ($table.value?.$el) {
        erd.listenTo($table.value.$el, resizeFixedRows);
      }
    });

    onUnmounted(() => {
      // 移除窗口尺寸的监听
      if ($table.value?.$el) {
        erd.removeListener($table.value.value, resizeFixedRows);
      }
    });

    return {
      i18nMessages,
      tableEl: $table,
      onPageChange,
      onRowSelect,
      onRowSelectChange,
      onRowSelectAll,
      onRowSelectInvert,
      handleRecordChange,
      getRowKey,
      addItem,
      updateItem,
      refresh
    };
  }
});
</script>

<style lang="scss">
.ant-table-x {
  .ant-table-title {
    padding: 0 !important;
  }

  .ant-table.ant-table-bordered .ant-table-title {
    border: none;
  }
}
</style>
