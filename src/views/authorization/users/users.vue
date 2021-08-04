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
            <AntdButton size="small" @click="showAuthModal(record)"><IconIdBadge />授权</AntdButton>
            <ActionEdit pure mode="icon" type="link" size="small" :handler="edit" />
            <ActionDelete pure confirmed notify mode="icon" color="danger" type="link" size="small" :handler="del(record)" />
          </div>
        </template>
      </XTable>
    </div>
  </ScrollView>
</template>

<script lang="ts">
import { defineComponent, h, reactive } from 'vue';
import { ActionAdd, ActionDelete, ActionEdit, ActionRefresh } from 'antdvx/components/action-bars';
import { ScrollView } from 'antdvx/components/scroll-view';
import { IconIdBadge } from 'antdvx/components/iconfont';
import { AntdButton } from 'antdvx/components/button';
import { createXModal } from 'antdvx/components/modal';
import { XTable, createXTable } from 'antdvx/components/table';

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
    // 授权 弹出层
    let authPopupRef = createXModal(
      {
        comp: () => import('./auth.vue'),
        props: {
          data: null
        },
        listeners: {
          done() {
            // 保存成功后，关闭弹出层
            authPopupRef.dismiss();
          }
        }
      },
      {
        props: {
          fullscreen: true
        },
        listeners: {
          presented() {}
        }
      }
    );

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

    // 显示授权框
    const showAuthModal = (row) => {
      return async () => {
        authPopupRef.options.title = row?.name ?? 'zzz';
        await authPopupRef.present();
      };
    };

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

    return { tableRef, showAuthModal, add, edit, del };
  }
});
</script>
