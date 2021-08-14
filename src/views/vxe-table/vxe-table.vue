<template>
  <ScrollView>
    <div class="tw-p-4">
      <VxeG v-bind="gridRef">
        <template #title="{ loading, refresh }">
          <div class="tw-flex tw-items-center tw-space-x-2">
            <div class="tw-flex-initial">筛选：</div>
            <AInput class="tw-w-72" placeholder="搜索患者案例..." />
            <XButton outline :handler="gridRef.handler.refresh">搜索</XButton>
            <XButtonRefresh :handler="refresh" />
          </div>
        </template>
        <template #no="{ record, rowIndex }"> {{ rowIndex + 1 }} </template>
        <template #actions="{ record }">
          <div class="tw-space-x-2">
            <XButtonEdit pure mode="icon" type="link" size="small" :handler="edit" />
            <XButtonDelete pure confirmed notify mode="icon" color="danger" type="link" size="small" :handler="del(record)" />
          </div>
        </template>
      </VxeG>
    </div>
  </ScrollView>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Input } from 'ant-design-vue';
import { ScrollView, VxeG, XButton, XButtonDelete, XButtonEdit, XButtonRefresh, createVxeGrid } from 'antdvx';

import { Api } from '@/mocks';
import { IUser } from '@/types/user';

export default defineComponent({
  components: {
    VxeG,
    XButton,
    ScrollView,
    XButtonEdit,
    XButtonDelete,
    XButtonRefresh,
    [Input.name]: Input
  },
  setup() {
    const gridRef = createVxeGrid<IUser<any>>(
      {
        border: true,
        columns: [
          { type: 'checkbox', width: 50, fixed: 'left' },
          {
            type: 'seq',
            width: 50,
            slots: {
              default: 'no'
            }
          },
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
            sortable: true,
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
            fixed: 'right',
            width: 150,
            slots: { default: 'actions' }
          }
        ],
        dataSource: {
          transport: {
            read() {
              return Api.getUsers().then((res) => {
                return [];
              });
            }
          }
        }
      },
      {}
    );

    const add = async () => {
      /*return gridRef.handler.addData(0, {
        userid: '',
        username: ''
      } as any);*/
    };

    const edit = async () => {};

    const del = (record) => {
      return async () => {
        return Api.deleteUser(record.userid, gridRef.options.data);
      };
    };

    return { gridRef, add, edit, del };
  }
});
</script>
