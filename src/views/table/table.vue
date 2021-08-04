<template>
  <ScrollView>
    <div class="tw-p-4">
      <XTable v-bind="tableRef">
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
      </XTable>
    </div>
  </ScrollView>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { AntdButton } from 'antdvx/components/button';
import { IconIdBadge } from 'antdvx/components/iconfont';
import { ScrollView } from 'antdvx/components/scroll-view';
import { XTable, createXTable } from 'antdvx/components/table';
import { ActionAdd, ActionDelete, ActionEdit, ActionRefresh } from 'antdvx/components/action-bars';

import { Api } from '@/mocks';
import { IUser } from '@/types/user';

export default defineComponent({
  components: {
    XTable,
    ScrollView,
    AntdButton,
    ActionAdd,
    ActionEdit,
    ActionDelete,
    ActionRefresh,
    IconIdBadge
  },
  setup() {
    const tableRef = createXTable<IUser<any>>({
      rowKey: 'userid',
      bordered: true,
      rowSelection: {
        type: 'checkbox',
        columnWidth: 40,
        selectedRowKeys: []
      },
      columns: [
        {
          title: '编号',
          dataIndex: 'userid',
          width: 100
        },
        {
          title: '用户名',
          dataIndex: 'username',
          width: 100
        },
        {
          title: '性别',
          dataIndex: 'isMale',
          width: 60,
          customRender({ text }) {
            return text ? '男' : '女';
          }
        },
        {
          title: '手机号',
          dataIndex: 'phone',
          width: 80
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          width: 100
        },
        {
          title: '地址',
          dataIndex: 'address',
          width: 120
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 100
        },
        {
          title: '操作',
          width: 150,
          slots: { customRender: 'actions' }
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
        return Api.deleteUser(record.userid, tableRef.options.dataSource);
      };
    };

    return { tableRef, add, edit, del };
  }
});
</script>
