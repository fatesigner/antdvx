import { clone } from 'lodash-es';
import { Input } from 'ant-design-vue';
import { defineComponent, reactive } from 'vue';
import { ODataHelper } from '@fatesigner/utils/odata';
import {
  XButton,
  XButtonAdd,
  XButtonDelete,
  XButtonEdit,
  XButtonExport,
  XButtonRefresh,
  XButtonSearch,
  XCombobox,
  XModal,
  XTable,
  createXModal,
  createXTable
} from '@/antdvx';

import { sysPermissionApi } from '@/api';
import { authService, sessionService } from '@/app/core/services';
import { PageWrapper } from '@/app/shared/page-wrapper';
import { PERMISSIONS_TYPE } from '@/app/core/constants';

/**
 * PermissionsView
 */
export const PermissionsView = defineComponent({
  name: 'PermissionsView',
  setup() {
    // 定义查询参数
    const query = reactive({
      category: undefined,
      keywords: undefined
    });

    // 表单 弹出层
    const formPopupRef = createXModal(
      {
        width: 720,
        footer: null,
        destroyOnClose: true
      },
      () => import('./permissions.form').then(({ PermissionsForm }) => ({ default: PermissionsForm })),
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
      rowKey: 'ID',
      columns: [
        {
          title: 'Permission Code',
          dataIndex: 'Code',
          width: 140,
          sorter: true,
          excel: {}
        },
        {
          title: 'Permission Name',
          dataIndex: 'Name',
          width: 140,
          sorter: true,
          excel: {}
        },
        {
          title: 'Permission Category',
          dataIndex: 'Category',
          width: 140,
          excel: {}
        },
        authService.permissible('RolesFullAccess')
          ? {
              title: 'Operation',
              width: 120,
              fixed: 'right',
              customRender({ record }) {
                return record.Category !== PERMISSIONS_TYPE.enum.System ? (
                  <div class='tw-flex tw-items-center tw-gap-2'>
                    <XButtonEdit
                      notify
                      color='blue'
                      size='small'
                      type='outline'
                      onClick={() => {
                        formPopupRef.options.title = 'Update Permission';
                        formPopupRef.compProps.model = clone(record);
                        formPopupRef.handler.present();
                      }}
                    />
                    <XButtonDelete
                      confirmed
                      size='small'
                      type='outline'
                      handler={() => {
                        return sysPermissionApi
                          .systemManageSysPermissionDelete({
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
                ) : undefined;
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
            return sysPermissionApi
              .systemManageSysPermissionOdataAll({
                count: 'true',
                ...ODataHelper.getParams({
                  filter: ODataHelper.and(
                    ODataHelper.filter('Category', 'eq', query.category),
                    ODataHelper.or(
                      ODataHelper.filter('Code', 'contains', keywords),
                      ODataHelper.filter('Name', 'contains', keywords),
                      ODataHelper.filter('Remark', 'contains', keywords)
                    ),
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
      tbRef
    };
  },
  render(ctx) {
    return (
      <PageWrapper
        bgGray
        title='Permissions'
        v-slots={{
          actions() {
            return (
              <div class='tw-flex tw-justify-end tw-gap-2'>
                {authService.permissible('RolesFullAccess') ? (
                  <XButtonAdd
                    color='primary'
                    type='3d'
                    onClick={() => {
                      ctx.formPopupRef.options.title = 'Add Permission';
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
                      return sysPermissionApi
                        .systemManageSysPermissionOdataAll({
                          ...ODataHelper.getParams({
                            filter: ODataHelper.and(
                              ODataHelper.filter('Category', 'eq', ctx.query.category),
                              ODataHelper.or(
                                ODataHelper.filter('Code', 'contains', keywords),
                                ODataHelper.filter('Name', 'contains', keywords),
                                ODataHelper.filter('Remark', 'contains', keywords)
                              )
                            )
                          })
                        })
                        .then((res) => {
                          return ctx.tbRef.handler.downloadExcel(res?.data?.Result ?? [], 'Permissions');
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
                      <XCombobox
                        class='tw-w-28'
                        clearable
                        dataValueField='value'
                        dataTextField='text'
                        v-model={[ctx.query.category, 'value']}
                        placeholder='Select Category'
                        options={PERMISSIONS_TYPE.arr as any}
                        onChange={() => {
                          ctx.tbRef.handler.reload();
                        }}
                      />
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
                        placeholder='Input Permission Code、Name...'
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
