import { clone } from 'lodash-es';
import { useI18n } from 'vue-i18n';
import { defineComponent, reactive } from 'vue';
import { ODataHelper } from '@fatesigner/utils/odata';
import { Input, Modal, Tag, notification } from 'ant-design-vue';
import {
  IconMenuAddLine,
  IconShapeLine,
  XButton,
  XButtonAdd,
  XButtonDelete,
  XButtonEdit,
  XButtonExport,
  XButtonRefresh,
  XButtonSearch,
  XDrawer,
  XModal,
  XTable,
  createXDrawer,
  createXModal,
  createXTable
} from '@/antdvx';

import { sysRoleApi } from '@/api';
import { i18nMessages } from '@/app/i18n';
import { COMMON_STATUS } from '@/app/core/constants';
import { authService, sessionService } from '@/app/core/services';
import { PageWrapper } from '@/app/shared/page-wrapper';

/**
 * RolesView
 */
export const RolesView = defineComponent({
  name: 'RolesView',
  setup() {
    const { t } = useI18n();

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
      () => import('./roles.form').then(({ RolesForm }) => ({ default: RolesForm })),
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

    // 菜单设置 弹出层
    const menusSettingPopupRef = createXDrawer(
      {
        title: t(i18nMessages.app.systemSettings.menu.title),
        width: '80%',
        destroyOnClose: true
      },
      () => import('./menus.setting').then(({ MenusSetting }) => ({ default: MenusSetting })),
      {
        roleId: undefined,
        onClose() {
          menusSettingPopupRef.handler.dismiss();
        }
      }
    );

    // 权限选择 弹出层
    const permissionsChooserPopupRef = createXDrawer(
      {
        width: '80%',
        destroyOnClose: true
      },
      () => import('./permissions.chooser').then(({ PermissionsChooser }) => ({ default: PermissionsChooser })),
      {
        roleId: undefined,
        onClose(updated) {
          permissionsChooserPopupRef.handler.dismiss();
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
          title: 'Role Code',
          dataIndex: 'Code',
          width: 150,
          excel: {}
        },
        {
          title: 'Role Name',
          dataIndex: 'Name',
          width: 150,
          excel: {}
        },
        {
          title: 'Status',
          dataIndex: 'Status',
          width: 150,
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
        {
          title: 'Remark',
          dataIndex: 'Remark',
          width: 150,
          excel: {}
        },
        authService.permissible('ExchangeRatesFullAccess')
          ? {
              title: 'Operation',
              width: 90,
              fixed: 'right',
              customRender({ record }) {
                return (
                  <div class='tw-flex tw-flex-wrap tw-items-center tw-gap-2'>
                    <XButton
                      color='primary'
                      size='small'
                      type='outline'
                      onClick={() => {
                        permissionsChooserPopupRef.options.title = 'Update Permissions';
                        permissionsChooserPopupRef.compProps.roleId = record.ID;
                        permissionsChooserPopupRef.compProps.onClose = (selectedData) => {
                          permissionsChooserPopupRef.handler.dismiss();
                          if (selectedData) {
                            sysRoleApi
                              .systemManageRoleGrantPermission({
                                sysRolePermissionInput: {
                                  SysRoleId: record.ID,
                                  PermissionIds: selectedData.map((x) => x.ID)
                                }
                              })
                              .then(() => {
                                notification.success({ message: 'Update permissions of projects success' });
                              })
                              .catch((err) => {
                                Modal.error({
                                  title: err.message
                                });
                              });
                          }
                        };
                        permissionsChooserPopupRef.handler.present();
                      }}
                    >
                      <div class='tw-flex tw-items-center tw-gap-2'>
                        <IconShapeLine />
                        <span>Permissions</span>
                      </div>
                    </XButton>
                    {
                      <XButton
                        color='tertiary'
                        size='small'
                        type='outline'
                        onClick={() => {
                          menusSettingPopupRef.compProps.roleId = record.ID;
                          menusSettingPopupRef.compProps.onClose = () => {
                            menusSettingPopupRef.handler.dismiss();
                          };
                          menusSettingPopupRef.handler.present();
                        }}
                      >
                        <div class='tw-flex tw-items-center tw-gap-2'>
                          <IconMenuAddLine />
                          <span>Menus</span>
                        </div>
                      </XButton>
                    }
                    <XButtonEdit
                      notify
                      color='blue'
                      size='small'
                      type='outline'
                      onClick={() => {
                        formPopupRef.options.title = 'Update Role';
                        formPopupRef.compProps.model = clone(record);
                        formPopupRef.handler.present();
                      }}
                    />
                    <XButtonDelete
                      confirmed
                      size='small'
                      type='outline'
                      handler={() => {
                        return sysRoleApi
                          .systemManageRoleDelete({
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
            return sysRoleApi
              .systemManageRoleOdataAll({
                count: 'true',
                ...ODataHelper.getParams({
                  filter: ODataHelper.and(
                    ODataHelper.or(ODataHelper.filter('Name', 'contains', keywords), ODataHelper.filter('Code', 'contains', keywords)),
                    ...Object.keys(filters).map((key) => ODataHelper.filter(key, 'contains', filters?.[key]?.[0] ?? undefined))
                  ),
                  orderby: ODataHelper.orderby([
                    sorter?.order
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
      menusSettingPopupRef,
      permissionsChooserPopupRef,
      tbRef
    };
  },
  render(ctx) {
    return (
      <PageWrapper
        bgGray
        overflow='scroll'
        title='Roles'
        v-slots={{
          actions() {
            return (
              <div class='tw-flex tw-justify-end tw-gap-2'>
                {authService.permissible('RolesFullAccess') ? (
                  <XButtonAdd
                    color='primary'
                    type='3d'
                    onClick={() => {
                      ctx.formPopupRef.options.title = 'Add Role';
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
                      return sysRoleApi
                        .systemManageRoleOdataAll({
                          count: 'true',
                          ...ODataHelper.getParams({
                            filter: ODataHelper.and(
                              ODataHelper.or(ODataHelper.filter('Name', 'contains', keywords), ODataHelper.filter('Code', 'contains', keywords))
                            )
                          })
                        })
                        .then((res) => {
                          return ctx.tbRef.handler.downloadExcel(res?.data?.Result ?? [], 'Roles');
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
                        placeholder='Input Role Code or Name...'
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
        <XDrawer {...ctx.menusSettingPopupRef} />
        <XDrawer {...ctx.permissionsChooserPopupRef} />
      </PageWrapper>
    );
  }
});
