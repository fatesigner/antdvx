<template>
  <scroll-view>
    <div class="tw-p-4">
      <x-table :columns="columns" :row-key="rowKey" :load-data="loadData" :data-source="users">
        <template #title="{ loading, refresh }">
          <action-refresh size="small" :handler="refresh" />
        </template>
        <template #actions="{ record }">
          <div class="tw-space-x-2">
            <antd-button size="small"><icon-id-badge />授权</antd-button>
            <action-edit pure mode="icon" type="link" size="small" :handler="edit" />
            <action-delete confirmed pure mode="icon" color="danger" type="link" size="small" :handler="del(record)" />
          </div>
        </template>
      </x-table>
    </div>
  </scroll-view>
</template>

<script lang="ts">
import { message } from 'ant-design-vue';
import { defineComponent, reactive } from 'vue';
import { PoweroffOutlined } from '@ant-design/icons-vue';
import { ActionDelete, ActionEdit, ActionRefresh } from 'antdvx/components/action-bars';
import { IXTableColumnProps, XTable } from 'antdvx/components/table';
import { ScrollView } from 'antdvx/components/scroll-view';
import { IconIdBadge } from 'antdvx/components/iconfont';
import { AntdButton } from 'antdvx/components/button';

import { IRole } from '@/types/role';
import { Api } from '@/mocks';

export default defineComponent({
  components: {
    XTable,
    ScrollView,
    AntdButton,
    ActionRefresh,
    ActionEdit,
    ActionDelete,
    IconIdBadge,
    // Antd
    PoweroffOutlined
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
