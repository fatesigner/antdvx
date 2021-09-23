<template>
  <ScrollView fill-y scroll-y>
    <div class="tw-p-4">
      <XTable v-bind="tableRef">
        <template #title="{ options, params, handler, methods }">
          <div class="tw-flex tw-items-center tw-space-x-2">
            <AInput class="tw-w-44" allowClear v-model:value="params.keywords" placeholder="搜索用户名..." />
            <XButtonSearch type="primary" :handler="handler.refresh" />
            <XButtonAdd @click="methods.add" />
            <XButtonDelete v-if="options.rowSelection.selectedRowKeys.length" color="danger" type="outline" :handler="methods.delAll" />
            <ACheckbox v-model:checked="options.dataSource.serverPaging">服务端分页</ACheckbox>
            <XButtonRefresh only-icon color="primary" size="mini" type="link" :handler="handler.refresh" />
          </div>
        </template>
        <template #status="{ record }">
          <ATag :color="record.status === MASTER_DATA_STATUS.enum.enabled ? 'green' : 'red'">{{ MASTER_DATA_STATUS.desc[record.status] }}</ATag>
        </template>
        <template #actions="{ record, index, methods }">
          <div class="tw-space-x-2">
            <XButton size="small" @click="methods.showAuthModal(record)"><IconUserSharedLine />授权</XButton>
            <XButtonEdit notify size="mini" color="primary" only-icon type="link" :handler="methods.edit(record)" />
            <XButtonDelete confirmed size="mini" color="danger" only-icon type="link" :handler="methods.del(record, index)" />
          </div>
        </template>
        <template #expandedRowRender="{ record: parent }">
          <div class="tw-p-4 tw-bg-white shadow-card">
            <XTable v-if="parent._expandedRef" v-bind="parent._expandedRef">
              <template #title="{ params, handler, methods }">
                <div class="tw-flex tw-items-center tw-space-x-2">
                  <AInput class="tw-w-72" size="small" allowClear v-model:value="params.keywords" placeholder="搜索用户名..." />
                  <XButtonSearch only-icon size="small" color="secondary" type="primary" :handler="handler.refresh" />
                  <XButtonAdd only-icon size="small" color="default" type="primary" @click="methods.add" />
                  <XButtonRefresh only-icon color="primary" size="mini" type="link" :handler="handler.refresh" />
                </div>
              </template>
              <template #actions="{ record, index, methods }">
                <div class="tw-space-x-2">
                  <XButtonEdit notify color="primary" only-icon type="link" size="mini" :handler="methods.edit(record, index)" />
                  <XButtonDelete confirmed size="mini" color="danger" only-icon type="link" :handler="methods.del(record, index)" />
                </div>
              </template>
            </XTable>
          </div>
        </template>
      </XTable>
    </div>
    <XModal v-bind="authPopupRef" />
  </ScrollView>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Checkbox, Input, Modal, Tag } from 'ant-design-vue';
import {
  IXButtonExportOptions,
  IconUserSharedLine,
  ScrollView,
  XButton,
  XButtonAdd,
  XButtonDelete,
  XButtonEdit,
  XButtonRefresh,
  XButtonSearch,
  XModal,
  XTable,
  createXModal,
  createXTable
} from '@/antdvx';

import { Api } from '@/mocks';
import { IUser } from '@/types/user';
import { MASTER_DATA_SEX, MASTER_DATA_STATUS } from '@/app/constants';
import { timer } from 'rxjs';

export default defineComponent({
  components: {
    XTable,
    XModal,
    XButton,
    ScrollView,
    IconUserSharedLine,
    XButtonAdd,
    XButtonEdit,
    XButtonDelete,
    XButtonSearch,
    XButtonRefresh,
    [Tag.name]: Tag,
    [Input.name]: Input,
    [Checkbox.name]: Checkbox
  },
  setup() {
    // 授权 弹出层
    const authPopupRef = createXModal(
      {
        width: '700px',
        fullscreen: true,
        footer: null,
        destroyOnClose: true
      },
      async () => {
        await timer(1000).toPromise();
        return import('./auth-form.vue');
      },
      {
        model: null,
        onDone() {
          // 保存成功后，关闭弹出层
          authPopupRef.handler.dismiss();
        }
      }
    );

    // 主表
    const tableRef = createXTable(
      {
        size: 'small',
        rowKey: 'userid',
        rowSelection: {
          type: 'checkbox',
          columnWidth: 40,
          selectedRowKeys: []
        },
        columns: [
          {
            title: '编号',
            dataIndex: 'userid',
            width: 100,
            sorter: true,
            sortDirections: ['descend']
          },
          {
            title: '用户名',
            dataIndex: 'username'
          },
          {
            title: '手机号',
            dataIndex: 'phone',
            width: 180,
            sorter: true
          },
          {
            title: '邮箱',
            dataIndex: 'email',
            width: 200,
            sorter: true
          },
          {
            title: '地址',
            dataIndex: 'address',
            width: 220,
            sorter: true
          },
          {
            title: '性别',
            dataIndex: 'sex',
            width: 80,
            filters: MASTER_DATA_SEX.arr.map((x) => ({
              value: x.value,
              text: x.text
            })),
            customRender({ text }) {
              return MASTER_DATA_SEX.desc[text];
            }
          },
          {
            title: '状态',
            dataIndex: 'status',
            width: 100,
            filters: [
              { text: '启用', value: 'enabled' },
              { text: '禁用', value: 'disabled' }
            ],
            slots: { customRender: 'status' }
          },
          {
            title: '创建时间',
            dataIndex: 'createTime',
            width: 100,
            sorter(a, b) {
              return new Date(a['createTime']).getTime() - new Date(b['createTime']).getTime();
            },
            defaultSortOrder: 'descend'
          },
          {
            title: '操作',
            width: 80,
            slots: { customRender: 'actions' }
          }
        ],
        dataSource: {
          serverPaging: false,
          transport: {
            read({ pageNo, pageSize }, { keywords }, filters, sorter) {
              if (tableRef.options.dataSource.serverPaging) {
                return Api.getUsers({ keywords, pageNo, pageSize, filters, sorter }).then((res) => {
                  return res;
                });
              }
              return Api.getUsers({ keywords }).then((res) => {
                return res;
              });
            }
          }
        },
        listeners: {
          dataLoaded(list) {
            console.log(list);
          },
          expand(expanded, parent) {
            if (expanded) {
              // 拓展行，创建子表
              parent._expandedRef = createXTable(
                {
                  rowKey: 'id',
                  bordered: true,
                  rowSelection: {
                    type: 'checkbox',
                    columnWidth: 40,
                    selectedRowKeys: []
                  },
                  pagination: {
                    size: 'small'
                  },
                  columns: [
                    {
                      title: '编号',
                      dataIndex: 'id',
                      width: 100
                    },
                    {
                      title: '父级',
                      dataIndex: 'username',
                      width: 100
                    },
                    {
                      title: '名称',
                      dataIndex: 'name',
                      width: 100
                    },
                    {
                      title: '更新时间',
                      dataIndex: 'createTime',
                      width: 100
                    },
                    {
                      title: '操作',
                      width: 80,
                      slots: { customRender: 'actions' }
                    }
                  ],
                  dataSource: {
                    serverPaging: false,
                    schema: {
                      parse(res) {
                        return res;
                      },
                      data(res) {
                        return res.data;
                      },
                      total(res) {
                        return res.total;
                      }
                    },
                    transport: {
                      read({ pageNo, pageSize }) {
                        if (tableRef.options.dataSource.serverPaging) {
                          return Api.getChildren({ userid: parent.userid, pageNo, pageSize }).then((res) => {
                            return res;
                          });
                        }
                        return Api.getChildren({ userid: parent.userid }).then((res) => {
                          return res;
                        });
                      }
                    }
                  }
                },
                {
                  keywords: null
                },
                {
                  add() {
                    return parent._expandedRef.handler.addData(0, {
                      userid: '',
                      username: ''
                    });
                  },
                  edit(record: any, index) {
                    return async () => {
                      record._inlineEditing = true;
                    };
                  },
                  del(record, index) {
                    return async () => {
                      return Api.deleteUser(record.userid, parent._expandedRef.options.dataSource.data).then(() => {});
                    };
                  }
                }
              );
            } else {
              // 当折叠后，清理子表引用，防止内存溢出
              parent._expandedRef = null;
            }
          }
        }
      },
      {
        keywords: null,
        exportOptions: {
          image: {
            filename: 'dasdas',
            target: document.body
          },
          async excel() {
            return {
              filename: 'excel',
              columns: tableRef.options.columns.map((x) => ({
                header: x.title,
                key: x.dataIndex,
                template: x?.slots?.customRender
              })),
              data: [
                {
                  title: 'title 1',
                  desc: 'desc 1'
                },
                {
                  title: 'title 2',
                  desc: 'desc 2'
                }
              ]
            };
          }
        } as IXButtonExportOptions
      },
      {
        // 显示授权框
        showAuthModal(row: IUser<any>) {
          authPopupRef.options.title = `${row?.userid} - ${row?.username}`;
          authPopupRef.compProps.model = row;
          authPopupRef.handler.present();
        },
        add() {
          return tableRef.handler.addData(0, {
            userid: '',
            username: ''
          });
        },
        edit(record) {
          return async () => {
            record._inlineEditing = true;
          };
        },
        del(record) {
          return async () => {
            return Api.deleteUser(record.userid, tableRef.options.dataSource.data);
          };
        },
        async delAll() {
          Modal.success({
            title: '已选中以下数据',
            content: JSON.stringify(tableRef.options.rowSelection.selectedRowKeys, null, 2)
          });
        }
      }
    );

    return { MASTER_DATA_STATUS, tableRef, authPopupRef };
  }
});
</script>
