<template>
  <div class="tw-flex tw-flex-col tw-h-full">
    <div class="tw-flex-1 tw-overflow-hidden">
      <ScrollView fill-y scroll-y>
        <div class="tw-flex tw-flex-col tw-justify-center tw-items-center tw-p-4 tw-space-y-4">
          <ATransfer
            :data-source="data"
            show-search
            :list-style="{
              width: '200px',
              height: '2000px'
            }"
            :filter-option="filter"
            :target-keys="targetKeys"
            @change="onChange"
          >
            <template #render="item">
              <span>{{ item.title }}</span>
            </template>
          </ATransfer>
        </div>
      </ScrollView>
    </div>
    <div class="tw-flex-initial">
      <div class="tw-p-2 tw-space-x-4 box-shadow-top tw-text-center">
        <XButton size="large" type="3d" @click="onClose">返回</XButton>
        <XButton color="secondary" size="large" type="3d" :handler="onSubmit">确定</XButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import to from 'await-to-js';
import { ScrollView, XButton } from '@/antdvx';
import { Modal, Transfer, message, notification } from 'ant-design-vue';
import { PropType, defineComponent, onMounted, reactive, ref } from 'vue';

import { Api } from '@/mocks';
import { IUser } from '@/types/user';

export default defineComponent({
  name: 'auth',
  components: {
    XButton,
    ScrollView,
    [Modal.name]: Modal,
    [Transfer.name]: Transfer
  },
  props: {
    model: {
      type: Object as PropType<IUser<any>>,
      default: null
    }
  },
  setup(props, { emit }) {
    const loading = ref(false);
    const visible_ = ref(false);
    const data = reactive<any[]>([]);
    const targetKeys = reactive<string[]>([]);

    // 过滤
    const filter = (inputValue, option) => {
      return option.title.indexOf(inputValue.trim()) > -1;
    };

    const onChange = (nextTargetKeys: string[]) => {
      targetKeys.splice(0, targetKeys.length, ...nextTargetKeys);
    };

    const onSubmit = async () => {
      loading.value = true;

      const [err] = await to(Api.getRoles());
      if (err) {
        notification.error({ message: 'error', description: err.message });
      } else {
        // 保存成功
        message.success('更新成功');

        emit('done');
      }

      loading.value = false;
    };

    const onClose = () => {
      emit('done');
    };

    onMounted(() => {
      Promise.all([Api.getRoles(), Api.getRoles()]).then(([res1, res2]) => {
        targetKeys.splice(0, targetKeys.length, ...res2?.map((x) => x.roleid.toString()));
        data.splice(
          0,
          data.length,
          ...res1?.map((x) => ({
            key: x.roleid.toString(),
            title: x.description,
            description: x.description ?? '',
            disabled: false
          }))
        );
      });
    });

    return { visible_, loading, data, targetKeys, filter, onChange, onSubmit, onClose };
  }
});
</script>
