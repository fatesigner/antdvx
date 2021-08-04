<template>
  <ScrollView>
    <div class="tw-p-4">
      <VxeT v-bind="tableRef">
        <template #title="{ loading, refresh }">
          <div class="tw-space-x-2">
            <ActionAdd size="small" :handler="add" />
            <ActionRefresh size="small" :handler="refresh" />
          </div>
        </template>
        <template #actions="{ record }">
          <div class="tw-space-x-2">
            <ActionEdit pure mode="icon" type="link" size="small" :handler="edit" />
            <ActionDelete pure confirmed notify mode="icon" color="danger" type="link" size="small" :handler="del(record)" />
          </div>
        </template>
      </VxeT>
    </div>
  </ScrollView>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { AntdButton } from 'antdvx/components/button';
import { IconIdBadge } from 'antdvx/components/iconfont';
import { ScrollView } from 'antdvx/components/scroll-view';
import { VxeT, createVxeTable } from 'antdvx/components/vxe-table';
import { ActionAdd, ActionDelete, ActionEdit, ActionRefresh } from 'antdvx/components/action-bars';

import { Api } from '@/mocks';
import { IUser } from '@/types/user';

export default defineComponent({
  components: {
    VxeT,
    ScrollView,
    AntdButton,
    ActionAdd,
    ActionEdit,
    ActionDelete,
    ActionRefresh,
    IconIdBadge
  },
  setup() {
    const tableRef = createVxeTable<IUser<any>>({
      border: true,
      columns: [
        {
          title: '编号',
          field: 'userid',
          minWidth: 100
        },
        {
          title: '用户名',
          field: 'username',
          minWidth: 100
        },
        {
          title: '性别',
          field: 'isMale',
          minWidth: 60,
          formatter({ cellValue }) {
            return cellValue ? '男' : '女';
          }
        },
        {
          title: '手机号',
          field: 'phone',
          minWidth: 80
        },
        {
          title: '邮箱',
          field: 'email',
          minWidth: 100
        },
        {
          title: '地址',
          field: 'address',
          minWidth: 120
        },
        {
          title: '创建时间',
          field: 'createTime',
          minWidth: 100
        },
        {
          title: '操作',
          field: 'actions',
          fixed: 'right',
          width: 150
        }
      ],
      transport: {
        get() {
          return Api.getUsers();
        }
      }
    });

    const add = async () => {
      return tableRef.handler.addItem({
        userid: '',
        username: ''
      } as any);
    };

    const edit = async () => {};

    const del = (record) => {
      return async () => {
        return Api.deleteUser(record.userid, tableRef.options.data);
      };
    };

    return { tableRef, add, edit, del };
  }
});
</script>
