<template>
  <div class="antd-vxe-table">
    <div
      class="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw--ml-2 tw--mr-2 tw--mt-2 tw-transition-opacity"
      :class="{ 'ant-vxe-table-blur': options.loading }"
    >
      <div class="tw-flex-1 tw-p-2">
        <slot name="title" v-bind="{ loading: options.loading, addItem, updateItem, refresh, handleRecordChange }" />
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
    <VxeTable
      ref="vxeTbRef"
      class="tw-transition-opacity"
      :class="{ 'ant-vxe-table-blur': options.loading }"
      :border="options.border"
      :data="options.data"
      :height="options.height"
      :size="options.size"
      :max-height="options.maxHeight"
      :show-overflow="options.showOverflow"
      :show-footer="options.showFooter"
      :footer-method="options.footerMethod"
      :loading="options.loading"
      :expand-config="options.expandConfig"
      :export-config="options.exportConfig"
      @toggle-row-expand="toggleExpandChangeEvent"
    >
      <template #empty>
        <transition-group tag="div" class="antd-vxe-table-transition-wrap" name="antd-vxe-table-transition">
          <!--          <div class="antd-vxe-table-transition-item" key="loading" v-if="options.loading">
            <slot name="loading" v-bind="{ refresh }">
              <ASpin />
            </slot>
          </div>-->
          <div class="antd-vxe-table-transition-item" key="error" v-if="error">
            <slot name="error" v-bind="{ error, refresh }" />
          </div>
          <div class="antd-vxe-table-transition-item" key="empty" v-else-if="empty">
            <slot name="empty" v-bind="{ loading: options.loading, refresh, handleRecordChange }">
              <div class="tw-mt-4">
                <AEmpty :image="emptyImage" />
              </div>
            </slot>
          </div>
          <!--      <slot key="error" v-else-if="error" name="error" v-bind="{ error, refresh }" />
          <slot key="empty" v-else-if="empty || !options_" name="empty" v-bind="{ refresh }" />-->
        </transition-group>
      </template>
      <!--<template v-for="(_, name) in $slots" #[name]="slotData">
        <slot :name="name" v-bind="{ ...slotData, loading: options.loading, refresh, handleRecordChange }" />
      </template>-->
      <template v-for="column in options.columns">
        <VxeColumn
          :type="column.type"
          :title="column.title"
          :field="column.field"
          :width="column.width"
          :min-width="column.minWidth"
          :resizable="column.resizable"
          :align="column.align"
          :cell-type="column.cellType"
          :cell-render="column.cellRender"
          :header-align="column.headerAlign"
          :header-class-name="column.headerClassName"
          :show-overflow="column.showOverflow"
          :show-header-overflow="column.showHeaderOverflow"
          :fixed="column.fixed"
        >
          <template #header>
            <slot :name="column.field + '.header'" v-bind="{ loading: options.loading, column, refresh, handleRecordChange }">
              {{ column.title }}
            </slot>
          </template>
          <template #default="{ row, rowIndex }" v-if="!column.editRender && !column.cellRender">
            <slot :name="column.field" v-bind="{ loading: options.loading, column, row, rowIndex, refresh, handleRecordChange }">
              {{ row[column.field] }}
            </slot>
          </template>
          <template #footer="{ items, _columnIndex }">
            <slot :name="column.field + '.footer'" v-bind="{ loading: options.loading, column, items, _columnIndex, refresh, handleRecordChange }" />
          </template>
          <template #content="{ row, rowIndex }">
            <slot :name="column.field + '.content'" v-bind="{ loading: options.loading, column, row, rowIndex, refresh, handleRecordChange }" />
          </template>
        </VxeColumn>
      </template>
    </VxeTable>
    <div
      v-if="
        options.pagination &&
        options.pagination.pageSize &&
        (options.pagination.placement === 'all' || options.pagination.placement === 'bottom') &&
        options.pagination.total
      "
      class="tw-flex tw-justify-end tw-transition-opacity"
      :class="{ 'ant-vxe-table-blur': options.loading }"
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
    <div class="antd-vxe-table-loading" v-show="options.loading">
      <ASpin />
    </div>
  </div>
</template>

<script lang="ts">
import to from 'await-to-js';
import { debounce } from '@fatesigner/utils';
import { VxeTableInstance } from 'vxe-table';
import { Empty, Pagination, Spin, Table, notification } from 'ant-design-vue';
import { isFunction, isString } from '@fatesigner/utils/type-check';
import { PropType, computed, defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';

import { AntdHttpAdapter } from '../../antdv';
import { i18nMessages } from '../../i18n/messages';
import { HttpContentType, IDataSourceRequestOptions } from '../../types/data-source';

import { IVxeTableListenersType, IVxeTablePropsType, IXTableHandlers } from './types';
import { defaultXTableProps } from './table';
import { VxeTableListeners } from 'vxe-table/types/table';

const elementResizeDetectorMaker = require('element-resize-detector');
const erd = elementResizeDetectorMaker();

export default defineComponent({
  name: 'vxe-t',
  components: {
    // Antd
    [Table.name]: Table,
    [Spin.name]: Spin,
    [Empty.displayName]: Empty,
    [Pagination.name]: Pagination
  },
  emits: [],
  props: {
    options: {
      type: Object as PropType<IVxeTablePropsType>,
      default() {
        return defaultXTableProps;
      }
    },
    // listeners
    listeners: {
      type: Object as PropType<IVxeTableListenersType>,
      default: null
    },
    // handler
    handler: {
      type: Object as PropType<IXTableHandlers>,
      default: null
    }
  },
  setup(props: any) {
    const $vxeTb = ref<VxeTableInstance>(null);

    const error = ref<Error>(null);
    const empty = computed<boolean>(() => {
      return !props.options.data.length;
    });

    let selectedRows = [];
    let dataSource = [];

    watch(
      () => props.options.data,
      (val, newval) => {
        debugger;
      }
    );

    // 展开行
    const toggleExpandChangeEvent: VxeTableListeners['toggleRowExpand'] = (params) => {
      if (props?.listeners?.toggleRowExpand) {
        props?.listeners?.toggleRowExpand(params);
      }
    };

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
      if (!$vxeTb.value?.$el) {
        return;
      }
      // const rf = this.$el.offsetHeight;
      // this.$refs.tableRef.saveRowRef();
      const main = Array.from($vxeTb.value.$el.querySelectorAll('.ant-table-body .ant-table-row')).map((el: HTMLElement) => el.offsetHeight);

      const fixedL = Array.from($vxeTb.value.$el.querySelectorAll('.ant-table-fixed-left .ant-table-row'));
      const fixedR = Array.from($vxeTb.value.$el.querySelectorAll('.ant-table-fixed-right .ant-table-row'));

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
        props?.options?.data.splice(
          0,
          props.options.data.length,
          ...data.slice(
            (props.options.pagination.current - 1) * props.options.pagination.pageSize,
            props.options.pagination.current * props.options.pagination.pageSize
          )
        );
      } else {
        props.options.data.splice(0, props.options.data.length, ...data);
      }
    };

    const refresh = async () => {
      if (props?.options?.transport?.get) {
        props.options.loading = true;

        dataSource = [];
        let data = [];

        if (isFunction(props?.options?.transport?.get)) {
          let [err, res] = await to<any>(
            props.options.transport.get(
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
            requestOptions.url = props.options.transport.get;
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
            props.options.data.splice(0, props.options.data.length, ...data);
          } else {
            dataSource = data;
            paging(data);
          }
        }

        props.options.loading = false;

        await $vxeTb.value.loadData(props.options.data);
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
        props.options.loading = false;
        $vxeTb.value.loadData(props.options.data);
      }
    };

    // 全选
    const selectAll = async () => {
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
    const selectInvert = async () => {
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

    // Handle record change
    const handleRecordChange = (e) => {
      // Emit record-change
      // emit('recordChange', e);
      if (props?.listeners?.recordChange) {
        props.listeners.recordChange(e);
      }
    };

    const addItem: IXTableHandlers['addItem'] = async (record, options) => {
      props.options.data.splice(options?.index ?? 0, 0, record);
    };

    const updateItem: IXTableHandlers['updateItem'] = async (key, record, options) => {
      let index = props.options.data.findIndex((x, i) => getRowKey(x, i) === key);
      if (index > -1) {
        props.options.data.splice(index, 1, record);
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
      if ($vxeTb.value?.$el) {
        //erd.listenTo($vxeTb.value.$el, resizeFixedRows);
      }
    });

    onUnmounted(() => {
      // 移除窗口尺寸的监听
      if ($vxeTb.value?.$el) {
        //erd.removeListener($vxeTb.value, resizeFixedRows);
      }
    });

    return {
      i18nMessages,
      vxeTbRef: $vxeTb,
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
      addItem,
      updateItem,
      refresh
    };
  }
});
</script>

<style lang="scss">
.antd-vxe-table-transition-wrap {
  height: 100px;
  max-height: 0;
  transition-property: max-height;
}

.antd-vxe-table-transition-wrap,
.antd-vxe-table-transition-enter-active,
.antd-vxe-table-transition-leave-active {
  transition-timing-function: ease-in-out;
  transition-duration: 0.2s;
}

.antd-vxe-table-transition-item {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;
  transform: translate3d(-50%, -50%, 0);
}

.antd-vxe-table-transition-enter-from {
  opacity: 0;
  transform: translate3d(-50%, -50%, 0) scale(0.7);
}

.antd-vxe-table-transition-enter-to {
  opacity: 1;
  transform: translate3d(-50%, -50%, 0) scale(1);
}

.antd-vxe-table-transition-leave-to {
  opacity: 0;
  transform: translate3d(-50%, -50%, 0) scale(0.6);
}

.antd-vxe-table {
  position: relative;
  transition: opacity 0.3s;

  .vxe-table {
    &,
    &.size--small,
    &.size--medium,
    &.size--mini {
      font-size: 0.75rem;
    }

    .vxe-header--column {
      font-weight: 300;

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
      .antd-vxe-table-transition-wrap {
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

.antd-vxe-table-loading {
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
