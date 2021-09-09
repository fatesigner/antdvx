<template>
  <TransitionCollapse>
    <div v-if="loading_">
      <slot name="loading">
        <div class="tw-space-y-2">
          <div class="tw-text-center"><SpinnerLoading class="tw-align-top" :size="loadingSize" /></div>
          <div class="tw-text-center tw-mt-5" v-if="loadingText">{{ loadingText }}</div>
        </div>
      </slot>
    </div>
  </TransitionCollapse>

  <TransitionCollapse>
    <div v-if="!loading_ && error">
      <slot name="error" v-bind="{ error, reload }">
        <AAlert type="error" closable>
          <template #message>{{ error }}<XButtonRefresh only-icon color="primary" size="small" type="link" :handler="reload" /></template>
          <template #description>
            {{ error }}
            <XButtonRefresh only-icon color="primary" size="small" type="link" :handler="reload" />
          </template>
        </AAlert>
      </slot>
    </div>
  </TransitionCollapse>

  <TransitionCollapse>
    <div v-if="initialized">
      <slot v-bind="{ data, loading: loading_, reload: load }" />
    </div>
  </TransitionCollapse>
</template>

<script lang="ts">
import { Alert } from 'ant-design-vue';
import { bindPromiseQueue } from '@fatesigner/utils';
import { PropType, defineComponent, nextTick, onMounted, ref, watch } from 'vue';

import { i18nMessages } from '../../i18n/messages';

import { XButtonRefresh } from '../button';
import { SpinnerLoading } from '../loading';
import { TransitionCollapse } from '../transitions';

import { IAsAsyncSectionProps } from './types';

export default defineComponent({
  name: 'async-action',
  components: {
    XButtonRefresh,
    SpinnerLoading,
    TransitionCollapse,
    [Alert.name]: Alert
  },
  inheritAttrs: false,
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    loadingText: {
      type: String
    },
    loadingSize: {
      type: String as PropType<IAsAsyncSectionProps<any, any>['size']>,
      default: 'small'
    },
    immediate: {
      type: Boolean,
      default: true
    },
    initialize: {
      type: Function as PropType<() => Promise<any>>
    }
  },
  setup(props: any, { emit }) {
    const data = ref();
    const error = ref('');
    const initialized = ref(false);
    const loading_ = ref(!!props.initialize);

    if (props.loading) {
      loading_.value = true;
    }

    watch(
      () => props.loading,
      (val) => {
        if (loading_.value !== val) {
          loading_.value = val;
        }
      }
    );

    const load = bindPromiseQueue(() => {
      return props
        .initialize()
        .then((res: any) => {
          data.value = res;
          error.value = null;
          initialized.value = true;
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

    const reload = async () => {
      loading_.value = true;
      await load();
      loading_.value = false;
    };

    onMounted(() => {
      if (props.immediate) {
        nextTick().then(() => {
          reload();
        });
      }
    });

    return {
      i18nMessages,
      data,
      error,
      initialized,
      loading_,
      load,
      reload
    };
  }
});
</script>
