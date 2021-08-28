<template>
  <div v-if="loading || error" v-bind="$attrs">
    <slot v-if="loading" name="loading">
      <div class="tw-overflow-hidden">
        <SpinnerLoading :size="loadingSize" />
        <div v-if="loadingText" class="tw-mt-5">{{ loadingText }}</div>
      </div>
    </slot>
    <slot v-else name="error" v-bind="{ error }" :refresh="refresh">
      <AAlert type="error" show-icon>
        <template #description>
          {{ error }}
          <XButton :handler="refresh" size="small" />
        </template>
      </AAlert>
    </slot>
  </div>

  <template v-else>
    <slot v-bind="{ loading, data, refresh }" />
    <!--<a-button v-if="refreshable" class="btn-reload" type="link" @click="refresh" title="刷新">
      <sync-outlined name="sync" scale=".9" :spin="reloading" />
    </a-button>-->
  </template>
</template>

<script lang="ts">
import { Alert } from 'ant-design-vue';
import { bindPromiseQueue } from '@fatesigner/utils';
import { defineComponent, nextTick, onMounted, ref, watch } from 'vue';

import { XButton } from '../button';
import { SpinnerLoading } from '../loading';

export default defineComponent({
  components: {
    XButton,
    SpinnerLoading,
    [Alert.name]: Alert
  },
  inheritAttrs: false,
  props: {
    loadingSize: {
      type: String,
      default: 'large'
    },
    loadingText: {
      type: String,
      default: null
    },
    immediate: {
      type: Boolean,
      default: true
    },
    refreshable: Boolean,
    initialize: Function
  },
  setup(props, { emit }) {
    const error = ref('');
    const initialized = ref(false);
    const loading = ref(true);
    const reloading = ref(false);
    const data = ref(false);

    const refresh = bindPromiseQueue(() => {
      loading.value = true;
      initialized.value = false;
      return props
        .initialize()
        .then((res: any) => {
          data.value = res;
          error.value = null;
          initialized.value = true;
          return res;
        })
        .catch((err: Error) => {
          error.value = err.message;
          initialized.value = false;
        })
        .finally(() => {
          loading.value = false;
          nextTick(() => {
            emit('initialized', data.value);
          });
        });
    }, true);

    // 监控 columns 变化
    watch(
      () => props.initialize,
      (val) => {
        if (val) {
          refresh();
        }
      }
    );

    onMounted(async () => {
      if (props.immediate) {
        await nextTick();
        return refresh();
      }
    });

    return {
      data,
      error,
      loading,
      reloading,
      refresh
    };
  }
});
</script>
