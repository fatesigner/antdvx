<template>
  <PageWrapper title="Table" :overflow-hidden="tbRef.options.autoScroll">
    <div class="tw-h-full tw-p-2">
      <div class="tw-h-full tw-p-4 tw-bg-white">
        <XTable v-bind="tbRef">
          <template #title="{ options, params, handler, methods }">
            <div class="tw-flex tw-flex-wrap tw-items-center tw-gap-2">
              <AInput class="tw-w-44" allowClear v-model:value="params.keywords" placeholder="搜索用户名..." />
              <XButtonSearch type="primary" :handler="handler.refresh" />
              <XButtonAdd @click="methods.add" />
              <XButtonDelete v-if="options.rowSelection.selectedRowKeys.length" color="danger" type="outline" :handler="methods.delAll" />
              <ACheckbox v-model:checked="options.dataSource.serverPaging">服务端分页</ACheckbox>
              <ACheckbox v-model:checked="options.autoScroll">自适应高度</ACheckbox>
              <!--<XButtonRefresh only-icon color="primary" size="mini" type="link" :handler="handler.refresh" />-->
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
    </div>
    <XModal v-bind="authPopupRef" />
  </PageWrapper>
</template>

<script lang="tsx">
import { timer } from 'rxjs';
import { defineComponent } from 'vue';
import { Checkbox, Input, Modal, Tag } from 'ant-design-vue';
import {
  IXButtonExportOptions,
  IconUserSharedLine,
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
import { IUser } from '@/app/types/user';
import { PageWrapper } from '@/app/shared/page-wrapper';
import { MASTER_DATA_SEX, MASTER_DATA_STATUS } from '@/app/core/constants';

export default defineComponent({
  components: {
    XTable,
    XModal,
    XButton,
    PageWrapper,
    XButtonAdd,
    XButtonEdit,
    XButtonDelete,
    XButtonSearch,
    XButtonRefresh,
    IconUserSharedLine,
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
    const tbRef = createXTable(
      {
        // autoScroll: true,
        // bordered: true,
        scroll: {
          x: true
        },
        size: 'small',
        rowKey: 'userid',
        rowSelection: {
          type: 'checkbox',
          columnWidth: 40,
          selectedRowKeys: []
        },
        columns: [
          {
            title: <strong>编号</strong>,
            dataIndex: 'userid',
            width: 140,
            sorter: true,
            sortDirections: ['descend']
          },
          {
            title: '用户名 & 账号',
            dataIndex: 'username',
            width: 120,
            filterMode: 'keywords',
            onFilter(value, record) {
              return record.username.toLowerCase().includes(value.toLowerCase());
            }
          },
          {
            title: '手机号',
            dataIndex: 'phone',
            width: 120,
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
            width: 320,
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
            customRender({ text, record, index }) {
              return MASTER_DATA_SEX.desc[text];
            }
          },
          {
            title: '状态',
            dataIndex: 'status',
            width: 80,
            filters: [
              { text: '启用', value: 'enabled' },
              { text: '禁用', value: 'disabled' }
            ],
            slots: { customRender: 'status' }
          },
          {
            title: '创建时间',
            dataIndex: 'createTime',
            width: 140,
            sorter(a, b) {
              return new Date(a.createTime).getTime() - new Date(b.createTime).getTime();
            },
            defaultSortOrder: 'descend'
          },
          {
            title: '操作',
            width: 120,
            slots: { customRender: 'actions' }
          }
        ],
        dataSource: {
          serverPaging: false,
          pageSize: 20,
          transport: {
            read({ pageNo, pageSize }, { keywords }, filters, sorter) {
              if (tbRef.options.dataSource.serverPaging) {
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
          change({ type, pagination, filters, sorter, currentData, overallData }) {
            console.log(type);
            // 动态添加列
            /* tbRef.options.columns.unshift({
              title: 'CCC',
              width: 80,
              customRender({ text }) {
                return 'ccc';
              }
            }); */
          },
          dataChange(data) {
            console.log(data);
          },
          dataLoaded(data) {
            console.log(data);
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
                        if (tbRef.options.dataSource.serverPaging) {
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
              columns: tbRef.options.columns.map((x) => ({
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
          return tbRef.handler.addData(0, {
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
            return Api.deleteUser(record.userid, tbRef.handler.getSelectedData()).then(() => {
              if (!tbRef.options.dataSource.data.length) {
                tbRef.handler.refresh();
              }
            });
          };
        },
        async delAll() {
          console.log(tbRef.handler.getSelectedData());
          Modal.success({
            title: '已选中以下数据',
            content: JSON.stringify(tbRef.options.rowSelection.selectedRowKeys, null, 2)
          });
        }
      }
    );

    return { MASTER_DATA_STATUS, tbRef, authPopupRef };
  }
});
</script>
