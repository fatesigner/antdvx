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
import { defineComponent, reactive } from 'vue';
import { PoweroffOutlined } from '@ant-design/icons-vue';
import { ColumnProps } from 'ant-design-vue/es/table/interface';
import { ActionDelete, ActionEdit, ActionRefresh } from 'antdvx/components/action-bars';
import { ScrollView } from 'antdvx/components/scroll-view';
import { IconIdBadge } from 'antdvx/components/iconfont';
import { AntdButton } from 'antdvx/components/button';
import { XTable } from 'antdvx/components/table';

import { Api } from '@/mocks';
import { message } from 'ant-design-vue';

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
