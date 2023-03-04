import { defineComponent, onMounted } from 'vue';
import { Checkbox, Input, Modal, TableSummaryCell, TableSummaryRow, TypographyText } from 'ant-design-vue';
import {
  createXModal,
  IconUserSharedLine,
  useXTable,
  XButton,
  XButtonAdd,
  XButtonDelete,
  XButtonEdit,
  XButtonExport,
  XButtonRefresh,
  XButtonSearch,
  XModal,
  XTable
} from 'antdvx';
import { timer } from 'rxjs';

import { PageWrapper } from '@/app/shared/page-wrapper';
import { Api } from '@/mocks';

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
    const tbRef = useXTable(
      {
        scroll: {
          x: true
        },
        columns: [
          {
            dataIndex: 'userid',
            width: 140,
            fixed: 'left',
            sorter: true,
            sortDirections: ['descend'],
            excel: {
              format: 'scientific'
            }
          },
          {
            title: '用户名 & 账号',
            dataIndex: 'username',
            width: 120,
            onFilter(value: any, record: any) {
              return record.username.toLowerCase().includes(value.toLowerCase());
            },
            excel: {
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
            }
          },
          {
            title: '手机号',
            dataIndex: 'phone',
            width: 120,
            sorter: true,
            excel: {
              format: 'currency',
              customRender() {
                return 13362585465;
              }
            }
          },
          {
            title: '邮箱',
            dataIndex: 'email',
            width: 200,
            sorter: true,
            excel: {
              format: 'scientific'
            }
          },
          {
            title: '地址',
            dataIndex: 'address',
            width: 320,
            sorter: true,
            excel: {
              format: 'text',
              style: {
                font: {
                  color: {
                    argb: 'red'
                  },
                  size: 12
                }
              }
            }
          },
          {
            title: '创建时间',
            dataIndex: 'createTime',
            width: 140,
            sorter(a: any, b: any) {
              return new Date(a.createTime).getTime() - new Date(b.createTime).getTime();
            },
            defaultSortOrder: 'descend',
            excel: {
              format: 'datetime'
            }
          }
        ],
        dataSchema: {
          serverPaging: false,
          transport: {
            read() {
              /* if (tbRef.options.dataSource.serverPaging) {
                return Api.getUsers({ keywords, pageNo, pageSize, filters, sorter }).then((res) => {
                  return res;
                });
              } */
              return Api.getUsers({ keywords: '' }).then((res) => {
                return res;
              });
            }
          }
        }
      },
      {
        // 显示授权框
        showAuthModal(row: any) {
          authPopupRef.options.title = `${row?.userid} - ${row?.username}`;
          authPopupRef.compProps.model = row;
          authPopupRef.handler.present();
        },
        add() {
          /* return tbRef.addData(0, {
            userid: '',
            username: ''
          }); */
        },
        edit(record: any) {
          return async () => {
            record._inlineEditing = true;
          };
        },
        del(record: any) {
          /* return async () => {
            return Api.deleteUser(record.userid, tbRef.getSelectedData()).then(() => {
              if (!tbRef.options.dataSource.data.length) {
                tbRef.refresh();
              }
            });
          }; */
        },
        async delAll() {
          /* console.log(tbRef.getAllData());
          console.log(tbRef.getCurrentData());
          console.log(tbRef.getSelectedData());
          Modal.success({
            title: '已选中以下数据',
            content: JSON.stringify(tbRef.options.rowSelection.selectedRowKeys, null, 2)
          }); */
        }
      }
    );

    tbRef.updateColumns();

    onMounted(() => {
      // tbRef.refresh();
      tbRef.updateColumns();
    });

    return () => {
      return (
        <PageWrapper
          title='Table'
          overflow='scroll'
          v-slots={{
            title() {
              return <div>dd</div>;
            }
          }}>
          <div class='tw-h-full tw-p-2'>
            <div class='tw-h-full tw-bg-white tw-p-4'>
              <button
                onClick={() => {
                  tbRef.updateColumns();
                }}>
                Refresh
              </button>
              <tbRef.Table
                class='tw-p-4'
                name='ffff'
                v-slots={{
                  summary() {
                    return [
                      <TableSummaryRow>
                        <TableSummaryCell>Total</TableSummaryCell>
                        <TableSummaryCell>
                          <TypographyText type='danger'>111</TypographyText>
                        </TableSummaryCell>
                        <TableSummaryCell>
                          <TypographyText>111</TypographyText>
                        </TableSummaryCell>
                        <TableSummaryCell>
                          <TypographyText>111</TypographyText>
                        </TableSummaryCell>
                        <TableSummaryCell>
                          <TypographyText>111</TypographyText>
                        </TableSummaryCell>
                        <TableSummaryCell>
                          <TypographyText>111</TypographyText>
                        </TableSummaryCell>
                      </TableSummaryRow>,
                      <TableSummaryRow>
                        <TableSummaryCell>Balance</TableSummaryCell>
                        <TableSummaryCell>
                          <TypographyText type='danger'>222</TypographyText>
                        </TableSummaryCell>
                        <TableSummaryCell>
                          <TypographyText>222</TypographyText>
                        </TableSummaryCell>
                        <TableSummaryCell>
                          <TypographyText>222</TypographyText>
                        </TableSummaryCell>
                        <TableSummaryCell>
                          <TypographyText>222</TypographyText>
                        </TableSummaryCell>
                      </TableSummaryRow>
                    ];
                  },
                  title(ddd) {
                    return (
                      <div class='tw-flex tw-flex-wrap tw-items-center tw-gap-2'>
                        <Input
                          class='tw-w-40 sm:tw-w-52'
                          allowClear
                          onChange={(e) => {
                            if (!e.target.value) {
                              // 点击 clear，重新加载数据
                              tbRef.reload();
                            }
                          }}
                          onKeydown={(e) => {
                            if (e.key === 'Enter') {
                              tbRef.reload();
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
                                    tbRef.reload();
                                  }}
                                />
                              );
                            }
                          }}
                        />
                        <XButtonSearch color='secondary' type='3d' handler={tbRef.reload}>
                          搜索
                        </XButtonSearch>
                        <XButtonAdd />
                      </div>
                    );
                  }
                }}
              />
            </div>
          </div>
          <XModal {...authPopupRef} />
        </PageWrapper>
      );
    };
  }
});
