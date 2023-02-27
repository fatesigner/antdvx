import { defineComponent, onMounted } from 'vue';
import { Checkbox, Input, Modal } from 'ant-design-vue';
import {
  createXModal,
  createXTable,
  IconUserSharedLine,
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
    const tbRef = createXTable(
      {
        columns: [
          {
            title: 'dddd',
            dataIndex: 'userid',
            width: 140,
            fixed: 'left',
            sorter: true,
            sortDirections: ['descend'],
            excel: {
              // format: 'scientific'
            }
          }
        ]
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

    onMounted(() => {
      // tbRef.refresh();
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
          }}
        >
          <div class='tw-h-full tw-p-2'>
            <div class='tw-h-full tw-bg-white tw-p-4'>
              <button
                onClick={() => {
                  tbRef.refresh();
                }}
              >
                Refresh
              </button>
              <tbRef.Table
                class='tw-twe'
                name='ffff'
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
                        <XButtonDelete
                          disabled={!options.rowSelection.selectedRowKeys.length}
                          color='danger'
                          type='outline'
                          handler={methods.delAll}
                        />
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
          <XModal {...authPopupRef} />
        </PageWrapper>
      );
    };
  }
});
