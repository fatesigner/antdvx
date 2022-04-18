import { clone } from 'lodash-es';
import { defineComponent, reactive } from 'vue';
import { Input, Modal, Tag } from 'ant-design-vue';
import { ODataHelper } from '@fatesigner/utils/odata';
import {
  IconMenLine,
  IconWomenLine,
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
} from '@/antdvx';

import { sysUserApi } from '@/api';
import { sessionService } from '@/app/core/services';
import { PageWrapper } from '@/app/shared/page-wrapper';
import { COMMON_STATUS, SEX_STATUS } from '@/app/core/constants';

/**
 * UsersView
 */
export const UsersView = defineComponent({
  name: 'UsersView',
  setup() {
    // 定义查询参数
    const query = reactive({
      keywords: undefined
    });

    // 表单 弹出层
    const formPopupRef = createXModal(
      {
        width: 620,
        footer: null,
        destroyOnClose: true
      },
      () => import('./users.form').then(({ UsersForm }) => ({ default: UsersForm })),
      {
        model: undefined,
        onClose(updated) {
          formPopupRef.handler.dismiss();
          if (updated) {
            tbRef.handler.reload();
          }
        }
      }
    );

    const tbRef = createXTable({
      scroll: {
        x: true
      },
      columns: [
        {
          title: 'User Code',
          dataIndex: 'Account',
          width: 90,
          excel: {}
        },
        {
          title: 'First Name',
          dataIndex: 'FirstName',
          width: 90,
          excel: {}
        },
        {
          title: 'Last Name',
          dataIndex: 'LastName',
          width: 90,
          excel: {}
        },
        {
          title: 'User Gender',
          dataIndex: 'Sex',
          width: 90,
          customRender({ record }) {
            return (
              <div class='tw-flex tw-items-center tw-text-gray-400' title={SEX_STATUS.desc[record.Sex]}>
                {record.Sex === SEX_STATUS.enum.Female ? (
                  <IconWomenLine class='tw-text-danger' />
                ) : record.Sex === SEX_STATUS.enum.Male ? (
                  <IconMenLine class='tw-text-primary' />
                ) : (
                  SEX_STATUS.desc[SEX_STATUS.enum.Unknown]
                )}
              </div>
            );
          },
          excel: {
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
          title: 'Phone',
          dataIndex: 'Phone',
          width: 100,
          sorter: true,
          excel: {}
        },
        {
          title: 'Email',
          dataIndex: 'Email',
          width: 110,
          excel: {}
        },
        {
          title: 'Roles',
          dataIndex: 'RoleNames',
          width: 180,
          customRender({ record }) {
            return (
              <div class='tw-flex tw-items-center tw-gap-1'>
                {record?.RoleNames?.split(',')?.map((x) => (
                  <Tag>{x}</Tag>
                ))}
              </div>
            );
          },
          excel: {}
        },
        {
          title: 'Created Time',
          dataIndex: 'CreatedTime',
          width: 110,
          defaultSortOrder: 'descend',
          sorter: true,
          excel: {
            format: 'datetime'
          }
        },
        {
          title: 'Status',
          dataIndex: 'Status',
          width: 90,
          fixed: 'right',
          customRender({ record }) {
            return record.Status === COMMON_STATUS.enum.enabled ? (
              <Tag color='green'>{COMMON_STATUS.desc[record.Status]}</Tag>
            ) : (
              <Tag color='red'>{COMMON_STATUS.desc[record.Status]}</Tag>
            );
          },
          excel: {
            customRender({ record }) {
              return COMMON_STATUS.desc[record.Status];
            }
          }
        },
        sessionService.user?.role?.permissions?.includes('UserInformationFullAccess')
          ? {
              title: 'Operation',
              width: 90,
              fixed: 'right',
              customRender({ record }) {
                return (
                  <div class='tw-flex tw-flex-wrap tw-items-center tw-gap-2'>
                    <XButtonEdit
                      notify
                      color='blue'
                      size='small'
                      type='outline'
                      onClick={() => {
                        formPopupRef.options.title = 'Update User';
                        formPopupRef.compProps.model = clone(record);
                        formPopupRef.handler.present();
                      }}
                    />
                    <XButtonDelete
                      confirmed
                      size='small'
                      type='outline'
                      handler={() => {
                        return sysUserApi
                          .systemManageUserDelete({
                            iDslongInput: {
                              IDs: [record.ID]
                            }
                          })
                          .then(() => {
                            tbRef.handler.refresh();
                          });
                      }}
                    />
                  </div>
                );
              }
            }
          : undefined
      ],
      dataSource: {
        serverPaging: true,
        transport: {
          read({ pageNo, pageSize }, params, filters, sorter) {
            let keywords = query.keywords?.trim();
            keywords = keywords || undefined;
            return sysUserApi
              .systemManageUserOdataDataAll({
                count: 'true',
                ...ODataHelper.getParams({
                  filter: ODataHelper.and(
                    ODataHelper.or(ODataHelper.filter('Name', 'contains', keywords), ODataHelper.filter('Code', 'contains', keywords)),
                    ...Object.keys(filters).map((key) => ODataHelper.filter(key, 'contains', filters?.[key]?.[0] ?? undefined))
                  ),
                  orderby: ODataHelper.orderby([
                    sorter.order
                      ? {
                          name: sorter.columnKey,
                          operator: sorter.order
                        }
                      : undefined
                  ]),
                  pageNo,
                  pageSize
                })
              })
              .then((res) => {
                return {
                  data: res?.data?.Result ?? [],
                  total: res?.data?.Extras ?? 0
                };
              });
          }
        }
      }
    });

    return {
      query,
      formPopupRef,
      tbRef
    };
  },
  render(ctx) {
    return (
      <PageWrapper
        bgGray
        overflow='scroll'
        title='Users'
        v-slots={{
          actions() {
            return (
              <div class='tw-flex tw-justify-end tw-gap-2'>
                {sessionService.user?.role?.permissions?.includes('UserInformationFullAccess') ? (
                  <XButtonAdd
                    color='primary'
                    type='3d'
                    onClick={() => {
                      ctx.formPopupRef.options.title = 'Add User';
                      ctx.formPopupRef.compProps.model = null;
                      ctx.formPopupRef.handler.present();
                    }}
                  >
                    Add
                  </XButtonAdd>
                ) : undefined}
                <XButtonExport
                  type='3d'
                  options={{
                    async excel() {
                      let keywords = ctx.query.keywords?.trim();
                      keywords = keywords || undefined;
                      return sysUserApi
                        .systemManageUserOdataAll({
                          count: 'true',
                          ...ODataHelper.getParams({
                            filter: ODataHelper.and(
                              ODataHelper.or(ODataHelper.filter('Name', 'contains', keywords), ODataHelper.filter('Code', 'contains', keywords))
                            )
                          })
                        })
                        .then((res) => {
                          return ctx.tbRef.handler.downloadExcel(res?.data?.Result ?? [], 'Users');
                        })
                        .catch((err) => {
                          Modal.error({
                            title: err.message
                          });
                        });
                    }
                  }}
                >
                  Export
                </XButtonExport>
              </div>
            );
          }
        }}
      >
        <div class='tw-p-2'>
          <div class='tw-p-2 tw-bg-white'>
            <XTable
              {...ctx.tbRef}
              v-slots={{
                title() {
                  return (
                    <div class='tw-flex tw-items-center tw-gap-2'>
                      <Input
                        class='tw-w-40 sm:tw-w-52 lg:tw-w-96'
                        allowClear
                        v-model={[ctx.query.keywords, 'value']}
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
                        placeholder='Input User Code or Name...'
                        v-slots={{
                          suffix() {
                            return (
                              <XButtonSearch
                                onlyIcon
                                size='mini'
                                type='link'
                                onClick={() => {
                                  ctx.tbRef.handler.reload();
                                }}
                              />
                            );
                          }
                        }}
                      />
                      <XButton color='secondary' type='3d' handler={ctx.tbRef.handler.reload}>
                        Search
                      </XButton>
                      <XButtonRefresh only-icon color='primary' size='mini' type='link' handler={ctx.tbRef.handler.reload} />
                    </div>
                  );
                }
              }}
            />
          </div>
        </div>
        <XModal {...ctx.formPopupRef} />
      </PageWrapper>
    );
  }
});
