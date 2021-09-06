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
        <template #message>{{ $t(i18nMessages.antd.asyncAction.error) }}</template>
        <template #description>
          {{ error }}
          <XButtonRefresh only-icon color="primary" size="small" type="link" :handler="refresh" />
        </template>
      </AAlert>
    </slot>
  </div>

  <template v-else>
    <slot v-bind="{ loading, data, refresh: load }" />
  </template>
</template>

<script lang="ts">
import { Alert } from 'ant-design-vue';
import { bindPromiseQueue } from '@fatesigner/utils';
import { PropType, defineComponent, nextTick, onMounted, ref } from 'vue';

import { i18nMessages } from '../../i18n/messages';

import { XButtonRefresh } from '../button';
import { SpinnerLoading } from '../loading';

export default defineComponent({
  name: 'async-action',
  components: {
    XButtonRefresh,
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
    initialize: Function as PropType<() => Promise<any>>
  },
  setup(props, { emit }) {
    const data = ref();
    const error = ref('');
    const loading = ref(true);

    const load = bindPromiseQueue(() => {
      return props
        .initialize()
        .then((res: any) => {
          data.value = res;
          error.value = null;
          return res;
        })
        .catch((err: Error) => {
          error.value = err.message;
        })
        .finally(() => {
          nextTick(() => {
            emit('initialized', data.value);
          });
        });
    }, true);

    const refresh = async () => {
      loading.value = true;
      await load();
      loading.value = false;
    };

    onMounted(() => {
      if (props.immediate) {
        nextTick().then(() => {
          refresh();
        });
      }
    });

    return {
      i18nMessages,
      data,
      error,
      loading,
      load,
      refresh
    };
  }
});
</script>
