import { Input, notification } from 'ant-design-vue';
import { ODataHelper } from '@fatesigner/utils/odata';
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { XButton, XButtonSearch, XCombobox, XTable, createXTable } from '@/antdvx';

import { sysPermissionApi } from '@/api';
import { SysPermissionOutput } from '@/api/models';
import { PERMISSIONS_TYPE } from '@/app/core/constants';

/**
 * 权限选择列表
 */
export const PermissionsChooser = defineComponent({
  props: {
    roleid: [Number, String]
  },
  emits: ['close'],
  setup(props: any) {
    const wrapRef = ref();

    const query = reactive({
      category: undefined,
      keywords: undefined
    });

    // 当前已选择的行
    const selectedRows = reactive<SysPermissionOutput[]>([]);

    const tbRef = createXTable({
      autoScroll: true,
      pagination: null,
      rowKey: 'ID',
      rowSelection: {
        fixed: 'left',
        selectedRowKeys: []
      },
      columns: [
        {
          title: 'Permission Code',
          dataIndex: 'Code',
          width: 140,
          sorter: true
        },
        {
          title: 'Permission Name',
          dataIndex: 'Name',
          width: 140,
          sorter: true
        },
        {
          title: 'Permission Category',
          dataIndex: 'Category',
          width: 140
        }
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
                      ODataHelper.filter('Code', 'eq', keywords),
                      ODataHelper.filter('Name', 'contains', keywords),
                      ODataHelper.filter('Remark', 'contains', keywords)
                    ),
                    ...Object.keys(filters).map((key) => ODataHelper.filter(key, 'contains', filters?.[key]?.[0] ?? undefined))
                  ),
                  orderby: ODataHelper.orderby([
                    sorter?.order
                      ? {
                          name: sorter.columnKey,
                          operator: sorter.order as any
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
      },
      listeners: {
        rowSelectChange(keys, rows) {
          rows.forEach((x) => {
            if (selectedRows.findIndex((y) => y.ID === x.ID) < 0) {
              selectedRows.push(x);
            }
          });
        },
        dataChange() {
          updateSelectedKeys();
        }
      }
    });

    // 更新已选中
    const updateSelectedKeys = () => {
      tbRef.options.rowSelection.selectedRowKeys.splice(
        0,
        tbRef.options.rowSelection.selectedRowKeys.length,
        ...tbRef.options.dataSource.data.filter((x) => selectedRows.findIndex((y) => y.ID === x.ID) > -1).map((x) => x.ID)
      );
    };

    onMounted(() => {
      sysPermissionApi
        .systemManageSysPermissionroleIdPermissions({
          roleId: props.roleid as string
        })
        .then((res) => {
          selectedRows.splice(0, selectedRows.length, ...(res?.data?.Result ?? []));
          updateSelectedKeys();
        })
        .catch((err) => {
          notification.error({ message: err.message, duration: 1 });
        });
    });

    return {
      wrapRef,
      query,
      selectedRows,
      tbRef
    };
  },
  render(ctx) {
    return (
      <div class='tw-flex tw-flex-col tw-h-full tw-h-96' ref='wrapRef'>
        <div class='tw-flex tw-items-center tw-gap-2 tw-p-2'>
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
            class='tw-w-full'
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
            placeholder='Input perssion name or description...'
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
          <XButton
            color='cyan'
            type='primary'
            onClick={() => {
              ctx.tbRef.handler.reload();
            }}>
            Search
          </XButton>
        </div>
        <div class='tw-flex-1 tw-p-2 tw-overflow-y-auto'>
          <XTable {...ctx.tbRef} />
        </div>
        <div class='tw-flex tw-justify-center tw-gap-4 tw-p-4 tw-border-t tw-border-gray-200'>
          <XButton
            color='secondary'
            size='large'
            type='3d'
            disabled={!ctx.tbRef.options.rowSelection.selectedRowKeys.length}
            onClick={() => {
              ctx.$emit('close', ctx.selectedRows);
            }}>
            Confirm
          </XButton>
          <XButton
            size='large'
            type='3d'
            onClick={() => {
              ctx.$emit('close');
            }}>
            Cancel
          </XButton>
        </div>
      </div>
    );
  }
});
