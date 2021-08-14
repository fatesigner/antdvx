<template>
  <ScrollView>
    <div class="tw-p-4">
      <XTable v-bind="tableRef">
        <template #title="{ loading, refresh }">
          <div class="tw-space-x-2">
            <XButtonAdd size="small" :handler="add" />
            <XButtonRefresh size="small" :handler="refresh" />
          </div>
        </template>
        <template #actions="{ record }">
          <div class="tw-space-x-2">
            <XButton size="small" @click="showAuthModal(record)"><IconIdBadge />授权</XButton>
            <XButtonEdit pure mode="icon" type="link" size="small" :handler="edit" />
            <XButtonDelete pure confirmed notify mode="icon" color="danger" type="link" size="small" :handler="del(record)" />
          </div>
        </template>
      </XTable>
    </div>
  </ScrollView>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IconIdBadge, ScrollView, XButtonAdd, XButtonDelete, XButtonEdit, XButtonRefresh, XTable, createXDrawer, createXTable } from 'antdvx';

import { Api } from '@/mocks';
import { IUser } from '@/types/user';

export default defineComponent({
  components: {
    XTable,
    IconIdBadge,
    ScrollView,
    XButtonAdd,
    XButtonEdit,
    XButtonDelete,
    XButtonRefresh
  },
  setup() {
    // 授权 弹出层
    let authPopupRef = createXDrawer(
      () => import('./auth.vue'),
      {
        data: null,
        onDone() {
          // 保存成功后，关闭弹出层
          authPopupRef.dismiss();
        }
      },
      {
        fullscreen: true,
        onPresented() {}
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
