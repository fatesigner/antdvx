import { timer } from 'rxjs';
import { defineComponent } from 'vue';
import { Checkbox, Input, Modal } from 'ant-design-vue';
import {
  IXButtonExportOptions,
  IconUserSharedLine,
  XButton,
  XButtonAdd,
  XButtonDelete,
  XButtonEdit,
  XButtonExport,
  XButtonRefresh,
  XButtonSearch,
  XModal,
  XTable,
  createXModal,
  createXTable
} from 'antdvx';

import { Api } from '@/mocks';
import { PageWrapper } from '@/app/shared/page-wrapper';

export default defineComponent({
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
        return import('./auth.form').then(({ AuthForm }) => ({ default: AuthForm }));
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
        scroll: {
          x: true
        },
        ignoreTitlePrefix: true,
        ignoreTitleSuffix: true,
        size: 'small',
        rowKey: 'userid',
        rowSelection: {
          fixed: 'left',
          type: 'checkbox',
          columnWidth: 40,
          selectedRowKeys: []
        },
        columns: [
          {
            dataIndex: 'userid',
            width: 140,
            fixed: 'left',
            sorter: true,
            sortDirections: ['descend'],
            excel: {
              // format: 'scientific'
            }
          },
          {
            title: '用户名 & 账号',
            dataIndex: 'username',
            width: 120,
            filterMode: 'keywords',
            onFilter(value, record) {
              return record.username.toLowerCase().includes(value.toLowerCase());
            }
            /* excel: {
              header: 'aaaaaaaaaaaaaaa',
              style: {
                font: {
                  bold: true,
                  color: {
                    argb: 'red'
                  },
                  size: 32
                }
              }
            } */
          },
          {
            title: '手机号',
            dataIndex: 'phone',
            width: 120,
            sorter: true
            /* excel: {
              format: 'currency',
              customRender() {
                return 13362585465;
              }
            } */
          },
          {
            title: '邮箱',
            dataIndex: 'email',
            width: 200,
            sorter: true,
            excel: {
              // format: 'scientific'
            }
          },
          {
            title: '地址',
            dataIndex: 'address',
            width: 320,
            sorter: true
            /* excel: {
              format: 'text',
              style: {
                font: {
                  color: {
                    argb: 'red'
                  },
                  size: 12
                }
              }
            } */
          },
          {
            title: '创建时间',
            dataIndex: 'createTime',
            width: 140,
            sorter(a, b) {
              return new Date(a.createTime).getTime() - new Date(b.createTime).getTime();
            },
            defaultSortOrder: 'descend'
            /* excel: {
              format: 'datetime'
            } */
          },
          {
            title: '操作',
            width: 120,
            fixed: 'right',
            slots: { customRender: 'actions' },
            customRender({ record, index }) {
              return (
                <div class='tw-flex tw-items-center tw-gap-2'>
                  <XButton
                    size='small'
                    onClick={() => {
                      tbRef.methods.showAuthModal(record);
                    }}>
                    <IconUserSharedLine />
                    授权
                  </XButton>
                  <XButtonEdit
                    notify
                    size='mini'
                    color='primary'
                    only-icon
                    type='link'
                    handler={() => {
                      return tbRef.methods.edit(record);
                    }}
                  />
                  <XButtonDelete
                    confirmed
                    size='mini'
                    color='danger'
                    only-icon
                    type='link'
                    handler={() => {
                      return tbRef.methods.del(record, index);
                    }}
                  />
                </div>
              );
            }
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
            tbRef.options.columns.unshift({
              title: 'CCC',
              width: 80,
              customRender({ text }) {
                return 'ccc';
              }
            });
          },
          dataChange(data) {
            console.log(data);
          },
          dataLoaded(data) {
            console.log(data);
          },
          expand(expanded, parent: any) {
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
                      data(res: any) {
                        return res.data;
                      },
                      total(res: any) {
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
                    return (parent._expandedRef as any).handler.addData(0, {
                      userid: '',
                      username: ''
                    });
                  },
                  edit(record: any) {
                    return async () => {
                      record._inlineEditing = true;
                    };
                  },
                  del(record: any) {
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
        keywords: undefined,
        exportOptions: {
          image: {
            filename: 'dasdas',
            target: document.body
          },
          excel() {
            return tbRef.handler.downloadExcel();
          }
        } as IXButtonExportOptions
      },
      {
        // 显示授权框
        showAuthModal(row: any) {
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
        edit(record: any) {
          return async () => {
            record._inlineEditing = true;
          };
        },
        del(record: any) {
          return async () => {
            return Api.deleteUser(record.userid, tbRef.handler.getSelectedData()).then(() => {
              if (!tbRef.options.dataSource.data.length) {
                tbRef.handler.refresh();
              }
            });
          };
        },
        async delAll() {
          console.log(tbRef.handler.getAllData());
          console.log(tbRef.handler.getCurrentData());
          console.log(tbRef.handler.getSelectedData());
          Modal.success({
            title: '已选中以下数据',
            content: JSON.stringify(tbRef.options.rowSelection.selectedRowKeys, null, 2)
          });
        }
      }
    );

    return {
      tbRef,
      authPopupRef
    };
  },
  render(ctx) {
    return (
      <PageWrapper title='Table' overflow='scroll'>
        <div class='tw-h-full tw-p-2'>
          <div class='tw-h-full tw-p-4 tw-bg-white'>
            <XTable
              {...ctx.tbRef}
              v-slots={{
                title({ options, params, handler, methods }) {
                  return (
                    <div class='tw-flex tw-flex-wrap tw-items-center tw-gap-2'>
                      <Input
                        class='tw-w-40 sm:tw-w-52'
                        allowClear
                        v-model={[params.keywords, 'value']}
                        onChange={(e) => {
                          if (!e.target.value) {
                            // 点击 clear，重新加载数据
                            ctx.tbRef.handler.reload();
                          }
                        }}
                        onKeydown={(e) => {
                          if (e.key === 'Enter') {
                            ctx.tbRef.handler.reload();
                          }
                        }}
                        placeholder='搜索用户名...'
                        v-slots={{
                          suffix() {
                            return (
                              <XButtonSearch
                                onlyIcon
                                size='mini'
                                type='link'
                                onClick={() => {
                                  handler.reload();
                                }}
                              />
                            );
                          }
                        }}
                      />
                      <XButtonSearch color='secondary' type='3d' handler={handler.reload}>
                        搜索
                      </XButtonSearch>
                      <XButtonAdd onClick={methods.add} />
                      <XButtonDelete disabled={!options.rowSelection.selectedRowKeys.length} color='danger' type='outline' handler={methods.delAll} />
                      <Checkbox v-model={[options.dataSource.serverPaging, 'checked']}>服务端分页</Checkbox>
                      <Checkbox v-model={[options.autoScroll, 'checked']}>自适应高度</Checkbox>
                      <XButtonExport type='3d' options={params.exportOptions} />
                      <XButtonRefresh only-icon color='primary' size='mini' type='link' handler={handler.reload} />
                    </div>
                  );
                }
              }}
            />
          </div>
        </div>
        <XModal {...ctx.authPopupRef} />
      </PageWrapper>
    );
  }
});
