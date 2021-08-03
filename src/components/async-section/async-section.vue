<template>
  <div v-if="loading || error" v-bind="$attrs">
    <slot v-if="loading" name="loading">
      <div class="tw-overflow-hidden">
        <spinner-loading :size="loadingSize" />
        <div v-if="loadingText" class="tw-mt-5">{{ loadingText }}</div>
      </div>
    </slot>
    <slot v-else name="error" v-bind="{ error }" :refresh="refresh">
      <a-alert type="error" show-icon>
        <template #description>
          {{ error }}
          <ActionRefresh :handler="refresh" size="small" />
        </template>
      </a-alert>
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
import { Alert, Button } from 'ant-design-vue';
import { bindPromiseQueue } from '@fatesigner/utils';
import { defineComponent, nextTick, onMounted, ref } from 'vue';

import { SpinnerLoading } from '../loading';
import { ActionRefresh } from '../action-bars';

export default defineComponent({
  components: {
    [Alert.name]: Alert,
    [Button.name]: Button,
    SpinnerLoading,
    ActionRefresh
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
