<template>
  <AModal v-model:visible="visible_" title="用户角色授权" :confirm-loading="loading" @ok="handleOk">
    <ATransfer
      :data-source="data"
      show-search
      :list-style="{
        width: '200px',
        height: '300px'
      }"
      :filter-option="filter"
      :target-keys="targetKeys"
      @change="handleChange"
    >
      <template #render="item">
        <span>{{ item.title }}</span>
      </template>
    </ATransfer>
  </AModal>
</template>

<script lang="ts">
import to from 'await-to-js';
import { defineComponent, onMounted, reactive, ref, watch } from 'vue';
import { Button, Modal, Transfer, message, notification } from 'ant-design-vue';

import { Api } from '@/mocks';

export default defineComponent({
  name: 'auth',
  components: {
    [Modal.name]: Modal,
    [Button.name]: Button,
    [Transfer.name]: Transfer
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    user: {
      type: Object,
      default: null
    }
  },
  setup(props, { emit }) {
    const loading = ref(false);
    const visible_ = ref(false);
    const data = reactive<any[]>([]);
    const targetKeys = reactive<string[]>([]);

    watch(
      () => props.visible,
      (val) => {
        visible_.value = val;
      },
      {
        immediate: true
      }
    );

    watch(visible_, (val) => {
      emit('update:visible', val);
    });

    // 过滤
    const filter = (inputValue, option) => {
      return option.title.indexOf(inputValue.trim()) > -1;
    };

    const handleChange = (nextTargetKeys: string[]) => {
      targetKeys.splice(0, targetKeys.length, ...nextTargetKeys);
    };

    const handleOk = async () => {
      loading.value = true;

      const [err] = await to(Api.saveRoles(targetKeys));
      if (err) {
        notification.error({ message: '', description: err.message });
      } else {
        // 保存成功后关闭
        visible_.value = false;
        message.success('操作成功');
      }

      loading.value = false;
    };

    onMounted(() => {
      Api.getRoles().then((res) => {
        data.splice(
          0,
          data.length,
          ...res.map((x) => ({
            key: x.roleid,
            title: x.rolename,
            description: x.description,
            disabled: false
          }))
        );
      });
    });

    return { visible_, loading, data, targetKeys, filter, handleChange, handleOk };
  }
});
</script>
