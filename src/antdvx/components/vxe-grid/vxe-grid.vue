<template>
  <div class="antd-vxe-grid">
    <div
      class="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw--ml-2 tw--mr-2 tw--mt-2 tw-transition-opacity"
      :class="{ 'ant-vxe-table-blur': options.loading }"
    >
      <div class="tw-flex-1 tw-p-2">
        <slot name="title" v-bind="{ loading: options.loading, addData, updateData, refresh, handleRecordChange }" />
      </div>
      <div
        class="tw-flex-initial tw-p-2"
        v-if="
          options.dataSource &&
          options.dataSource.total &&
          options.dataSource.pageSize &&
          (options.pager.placement === 'all' || options.pager.placement === 'top')
        "
      >
        <APagination
          size="small"
          :show-total="
            (total, range) => `${range[0]}-${range[1]} ` + $t(i18nMessages.antd.pagination.of) + ` ${total} ` + $t(i18nMessages.antd.pagination.items)
          "
          :total="options.dataSource.total"
          v-model:current="options.dataSource.pageNo"
          v-model:page-size="options.dataSource.pageSize"
          @change="onPageChange"
          @showSizeChange="onPageChange"
        />
      </div>
    </div>
    <VxeGrid ref="vxeGridRef" class="tw-transition-opacity" :class="{ 'ant-vxe-table-blur': options.loading }" v-bind="options" v-on="listeners">
      <template v-for="(_, name) in $slots" v-slot:[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
      <template #empty>
        <div class="antd-vxe-grid-transition-wrap">
          <!--          <div class="antd-vxe-grid-transition-item" key="loading" v-if="options.loading">
            <slot name="loading" v-bind="{ refresh }">
              <ASpin />
            </slot>
          </div>-->
          <div class="antd-vxe-grid-transition-item" v-if="error">
            <slot name="error" v-bind="{ error, refresh }" />
          </div>
          <div class="antd-vxe-grid-transition-item" v-else-if="empty">
            <slot name="empty" v-bind="{ loading: options.loading, refresh, handleRecordChange }">
              <div class="tw-mt-4">
                <AEmpty :image="emptyImage" />
              </div>
            </slot>
          </div>
          <!--      <slot key="error" v-else-if="error" name="error" v-bind="{ error, refresh }" />
          <slot key="empty" v-else-if="empty || !options_" name="empty" v-bind="{ refresh }" />-->
        </div>
      </template>
    </VxeGrid>
    <div
      v-if="
        options.dataSource &&
        options.dataSource.total &&
        options.dataSource.pageSize &&
        (options.pager.placement === 'all' || options.pager.placement === 'bottom')
      "
      class="tw-flex tw-justify-end tw-transition-opacity"
      :class="{ 'ant-vxe-table-blur': options.loading }"
    >
      <APagination
        size="small"
        :show-total="(total, range) => `${range[0]}-${range[1]} ` + $t(i18nMessages.antd.pagination.of) + ` ${total} ` + $t(i18nMessages.antd.pagination.items)"
        :total="options.dataSource.total"
        v-model:current="options.dataSource.pageNo"
        v-model:page-size="options.dataSource.pageSize"
        @change="onPageChange"
        @showSizeChange="onPageChange"
      />
    </div>
    <div class="antd-vxe-grid-loading" v-show="options.loading">
      <ASpin />
    </div>
  </div>
</template>

<script lang="ts">
import to from 'await-to-js';
import { VxeGridInstance } from 'vxe-table';
import { VxeGridListeners } from 'vxe-table/types/grid';
import { Empty, Pagination, Spin, Table, notification } from 'ant-design-vue';
import { isArray, isFunction, isString } from '@fatesigner/utils/type-check';
import { PropType, computed, defineComponent, onMounted, ref, watch } from 'vue';

import { AntdHttpAdapter } from '../../config';
import { i18nMessages } from '../../i18n/messages';
import { HttpContentType, IDataSourceRequestOptions } from '../../types/data-source';

import { defaultVxeGridProps } from './vxe-grid';
import { IVxeGridHandlers, IVxeGridListenersType, IVxeGridPropsType } from './types';

//const elementResizeDetectorMaker = require('element-resize-detector');
//const erd = elementResizeDetectorMaker();

export default defineComponent({
  name: 'vxe-t',
  components: {
    [Table.name]: Table,
    [Spin.name]: Spin,
    [Empty.displayName]: Empty,
    [Pagination.name]: Pagination
  },
  emits: [],
  props: {
    options: {
      type: Object as PropType<IVxeGridPropsType>,
      default() {
        return defaultVxeGridProps;
      }
    },
    // listeners
    listeners: {
      type: Object as PropType<IVxeGridListenersType>,
      default: null
    },
    // handler
    handler: {
      type: Object as PropType<IVxeGridHandlers>,
      default: null
    }
  },
  setup(props: any) {
    const $vxeGrid = ref<VxeGridInstance>(null);

    const error = ref<Error>(null);
    const empty = computed<boolean>(() => {
      return !props.options.data.length;
    });

    // All data
    let dataOverall = [];
    let selectedRows = [];

    watch(
      () => props.options.data,
      (val, newval) => {
        console.log(val.length);
      },
      {
        deep: true
      }
    );

    // 对当前数据执行分页
    const paging = () => {
      if (props?.options?.pager?.enable) {
        if (props?.options?.dataSource?.serverPaging) {
          // 服务端分页
          props.options.data.splice(0, props.options.data.length, ...dataOverall);
        } else {
          // 客户端分页
          props.options.dataSource.total = dataOverall.length;
          if (props.options.dataSource?.pageSize) {
            props?.options?.data.splice(
              0,
              props.options.data.length,
              ...dataOverall.slice(
                (props.options.dataSource.pageNo - 1) * props.options.dataSource.pageSize,
                props.options.dataSource.pageNo * props.options.dataSource.pageSize
              )
            );
          } else {
            props.options.data.splice(0, props.options.data.length, ...dataOverall);
          }
        }
      }
    };

    // 刷新数据
    const refresh = async () => {
      if (props?.options?.dataSource.transport?.read) {
        props.options.loading = true;

        dataOverall = [];
        let data = [];

        if (isFunction(props?.options?.dataSource.transport?.read)) {
          let [err, res] = await to<any>(
            props.options.dataSource.transport.read(
              {
                pageNo: props.options.dataSource.pageNo,
                pageSize: props.options.dataSource.pageSize
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

        dataOverall = data;

        paging();

        props.options.loading = false;

        await $vxeGrid.value.loadData(props.options.data);
      }
    };

    // 切换 pageIndex 和 pageSize
    const onPageChange = () => {
      if (props?.options?.transport?.serverPaging) {
        // 服务端分页
        refresh();
      } else {
        paging();
      }
      $vxeGrid.value.loadData(props.options.data);
    };

    // 展开行
    const toggleExpandChangeEvent: VxeGridListeners['toggleRowExpand'] = (params) => {
      if (props?.listeners?.toggleRowExpand) {
        props?.listeners?.toggleRowExpand(params);
      }
    };

    // RowSelection
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

    // Handle record change
    const handleRecordChange = (e) => {
      // Emit record-change
      // emit('recordChange', e);
      if (props?.listeners?.recordChange) {
        props.listeners.recordChange(e);
      }
    };

    const getVxeGridRef: IVxeGridHandlers['getVxeGridRef'] = () => {
      return $vxeGrid.value;
    };

    const addData: IVxeGridHandlers['addData'] = (start: number, data: Record<string, any> | Record<string, any>[]) => {
      debugger;
      if (isArray(data)) {
        props.options.data.splice(start, 0, ...(data as any[]));
      } else {
        props.options.data.splice(start, 0, ...[data]);
      }
      $vxeGrid.value.loadData(props.options.data);
    };

    const updateData: IVxeGridHandlers['updateData'] = (key: string | number, data: Record<string, any>) => {
      debugger;
      return null;
    };

    const removeData: IVxeGridHandlers['removeData'] = (key: string | number) => {
      debugger;
    };

    const getSelectedData: IVxeGridHandlers['getSelectedData'] = () => {
      return [];
    };

    const getAllData: IVxeGridHandlers['getAllData'] = () => {
      return dataOverall;
    };

    // 全选
    const selectAll: IVxeGridHandlers['selectAll'] = async () => {
      if (props?.options?.rowSelection?.selectedRowKeys) {
        props.options.rowSelection.selectedRowKeys.splice(
          0,
          props.options.rowSelection.selectedRowKeys.length,
          ...props.options.data.map((record, index) => getRowKey(record, index))
        );
        if (props?.listeners?.onRowSelectAll) {
          props?.listeners?.onRowSelectAll(true, [], []);
        }
      }
    };

    // 反选
    const selectInvert: IVxeGridHandlers['selectInvert'] = async () => {
      if (props?.options?.rowSelection?.selectedRowKeys) {
        props.options.rowSelection.selectedRowKeys.splice(
          0,
          props.options.rowSelection.selectedRowKeys.length,
          ...props.options.data.map((record, index) => getRowKey(record, index)).filter((key) => props.options.rowSelection.selectedRowKeys.indexOf(key) < 0)
        );
        if (props?.listeners?.onRowSelectInvert) {
          props?.listeners?.onRowSelectInvert(props.options.rowSelection.selectedRowKeys);
        }
      }
    };

    // update handlers
    if (props.handler) {
      Object.assign(props.handler, {
        getVxeGridRef,
        addData,
        updateData,
        removeData,
        getSelectedData,
        getAllData,
        selectAll,
        selectInvert,
        refresh
        //reload: null,
        //validate: null,
        //validateRow: null,
      } as IVxeGridHandlers);
    }

    onMounted(() => {
      refresh();
    });

    return {
      i18nMessages,
      vxeGridRef: $vxeGrid,
      emptyImage: Empty.PRESENTED_IMAGE_SIMPLE,
      error,
      empty,
      toggleExpandChangeEvent,
      onPageChange,
      onRowSelect,
      onRowSelectChange,
      onRowSelectAll,
      onRowSelectInvert,
      handleRecordChange,
      getRowKey,

      // handler
      addData,
      updateData,
      refresh
    };
  }
});
</script>

<style lang="scss">
.antd-vxe-grid-transition-wrap {
  min-height: 100px;
}

.antd-vxe-grid-transition-item {
}

.antd-vxe-grid {
  position: relative;
  transition: opacity 0.3s;

  .vxe-grid.is--loading::before {
    background: transparent;
  }

  .vxe-table {
    &,
    &.size--small,
    &.size--medium,
    &.size--mini {
      font-size: 0.75rem;
    }

    .vxe-header--column {
      font-weight: 300;
      user-select: auto;

      .vxe-cell--title {
        color: #333;
      }
    }

    .vxe-table--header-wrapper {
      color: rgba(0, 0, 0, 0.85);
      background-color: #fafafa;
    }

    &.vxe-table--render-default {
      .vxe-table--border-line {
        border-color: #f0f0f0;
      }

      .vxe-header--column,
      .vxe-body--column,
      .vxe-footer--column {
        background-image: none;
      }

      .vxe-header--column {
        padding: 8px 0;
      }

      .vxe-body--column,
      .vxe-footer--column {
        padding: 16px 0;
      }

      &.border--default,
      &.border--full,
      &.border--inner,
      &.border--outer {
        .vxe-table--header-border-line {
          border-bottom: 1px solid #f0f0f0;
        }
      }

      &.border--full {
        .vxe-header--column {
          border-right: 1px solid #f0f0f0;
        }

        .vxe-table--border-line {
          border-right: 0;
        }

        .vxe-body--column,
        .vxe-footer--column {
          border-right: 1px solid #f0f0f0;
        }
      }

      &.border--default,
      &.border--full,
      &.border--inner {
        .vxe-body--column,
        .vxe-footer--column {
          border-bottom: 1px solid #f0f0f0;
        }
      }
    }

    .vxe-table--empty-placeholder {
      display: flex !important;
      height: inherit !important;
    }

    .vxe-loading {
      background-color: transparent;
    }

    .vxe-loading--spinner {
      display: none;
    }

    &.is--empty {
      .antd-vxe-grid-transition-wrap {
        max-height: 100px;
      }
    }
  }
}

.ant-vxe-table-blur {
  overflow: hidden;
  clear: both;
  pointer-events: none;
  user-select: none;
  opacity: 0.4;
}

.antd-vxe-grid-loading {
  position: absolute;
  top: 100px;
  right: 0;
  left: 0;
  z-index: 1;
  display: flex;
  align-self: center;
  justify-content: center;
}
</style>
