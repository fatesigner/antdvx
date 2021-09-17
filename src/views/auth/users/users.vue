<template>
  <ScrollView fill-y scroll-y>
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
            <XButton size="small" @click="showAuthModal(record)"><IconShieldUserLine />授权</XButton>
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
import { IconShieldUserLine, ScrollView, XButtonAdd, XButtonDelete, XButtonEdit, XButtonRefresh, XTable, createXDrawer, createXTable } from '@/antdvx';

import { Api } from '@/mocks';
import { IUser } from '@/types/user';
import { MASTER_DATA_SEX } from '@/app/constants';

export default defineComponent({
  components: {
    XTable,
    ScrollView,
    IconShieldUserLine,
    XButtonAdd,
    XButtonEdit,
    XButtonDelete,
    XButtonRefresh
  },
  setup() {
    // 授权 弹出层
    let authPopupRef = createXDrawer(
      {
        fullscreen: true,
        onPresented() {}
      },
      () => import('./auth.vue'),
      {
        data: null,
        onDone() {
          // 保存成功后，关闭弹出层
          authPopupRef.handler.dismiss();
        }
      }
    );

    const tableRef = createXTable({
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
          dataIndex: 'sex',
          width: 60,
          filters: MASTER_DATA_SEX.arr.map((x) => ({
            value: x.value,
            text: x.text
          })),
          customRender({ text }) {
            return MASTER_DATA_SEX.desc[text];
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
      dataSource: {
        transport: {
          read() {
            return Api.getUsers();
          }
        }
      }
    });

    // 显示授权框
    const showAuthModal = (row) => {
      return async () => {
        authPopupRef.options.title = row?.name ?? 'zzz';
        await authPopupRef.handler.present();
      };
    };

    const add = async () => {
      return tableRef.handler.addData(0, {
        userid: '',
        username: ''
      });
    };

    const edit = async () => {};

    const del = (record) => {
      return async () => {
        return Api.deleteUser(record.userid, tableRef.options.dataSource.data);
      };
    };

    return { tableRef, showAuthModal, add, edit, del };
  }
});
</script>
