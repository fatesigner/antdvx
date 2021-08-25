<template>
  <ScrollView>
    <div class="tw-p-4">
      <XTable :columns="columns" :row-key="rowKey" :load-data="loadData" :data-source="users">
        <template #title="{ loading, refresh }">
          <XButtonRefresh size="small" :handler="refresh" />
        </template>
        <template #actions="{ record }">
          <div class="tw-space-x-2">
            <XButton size="small"><IconUserSharedLine />授权</XButton>
            <XButtonEdit pure mode="icon" type="link" size="small" :handler="edit" />
            <XButtonDelete confirmed pure mode="icon" color="danger" type="link" size="small" :handler="del(record)" />
          </div>
        </template>
      </XTable>
    </div>
  </ScrollView>
</template>

<script lang="ts">
import { message } from 'ant-design-vue';
import { defineComponent, reactive } from 'vue';
import { IXTableColumnProps, IconUserSharedLine, ScrollView, XButton, XButtonDelete, XButtonEdit, XButtonRefresh, XTable } from 'antdvx';

import { Api } from '@/mocks';
import { IRole } from '@/types/role';

export default defineComponent({
  components: {
    XTable,
    XButton,
    ScrollView,
    IconUserSharedLine,
    XButtonEdit,
    XButtonDelete,
    XButtonRefresh
  },
  setup() {
    const rowKey = 'userid';
    const users = reactive([]);
    const columns: IXTableColumnProps<IRole>[] = [
      {
        title: '编号',
        dataIndex: 'roleid',
        width: 100
      },
      {
        title: '角色名',
        dataIndex: 'rolename',
        width: 100
      },
      {
        title: '描述',
        dataIndex: 'description',
        width: 100
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 100
      },
      {
        title: '操作',
        width: 150,
        fixed: 'right',
        slots: { customRender: 'actions' }
      }
    ];
    const loadData = () => {
      return Api.getUsers();
    };

    const edit = async () => {};

    const del = (record) => {
      return async () => {
        return Api.deleteUser(record.userid, users).then(() => {
          message.success('操作成功');
        });
      };
    };

    return { rowKey, columns, users, loadData, edit, del };
  }
});
</script>
