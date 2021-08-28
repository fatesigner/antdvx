<template>
  <ScrollView>
    <div class="tw-p-4">
      <XTable :columns="columns" :row-key="rowKey" :load-data="loadData" :data-source="users">
        <template #title="{ loading, refresh }">
          <action-refresh size="small" :handler="refresh" />
        </template>
        <template #actions="{ record }">
          <div class="tw-space-x-2">
            <XButton size="small"><IconUser2Line />授权</XButton>
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
import { ColumnProps } from 'ant-design-vue/es/table/interface';
import { IconUser2Line, ScrollView, XButton, XButtonDelete, XButtonEdit, XButtonRefresh, XTable } from '@/antdvx';

import { Api } from '@/mocks';

export default defineComponent({
  components: {
    IconUser2Line,
    ScrollView,
    XTable,
    XButton,
    XButtonEdit,
    XButtonDelete,
    XButtonRefresh
  },
  setup() {
    const rowKey = 'userid';
    const users = reactive([]);
    const columns: ColumnProps[] = [
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
        dataIndex: 'sex',
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
