import { defineComponent, nextTick, onMounted, PropType, ref, watch } from 'vue';
import { bindPromiseQueue } from '@fatesigner/utils';
import { Alert, Spin } from 'ant-design-vue';

import { XButtonRefresh } from '../button';
import { TransitionCollapse } from '../transitions';

import { IAsAsyncSectionProps } from './types';

/**
 * 用于显示异步加载状态的区域
 */
export const AsyncSection = defineComponent({
  name: 'AsyncSection',
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
      default: 'default'
    },
    immediate: {
      type: Boolean,
      default: true
    },
    initialize: {
      type: Function as PropType<() => Promise<any>>
    }
  },
  emits: ['initialized'],
  setup(props: any, { emit }) {
    const data = ref();
    const error = ref();
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
      data,
      error,
      initialized,
      loading_,
      load,
      reload
    };
  },
  render(ctx) {
    return [
      <TransitionCollapse appear={false}>
        {ctx.loading_ ? (
          <div {...ctx.$attrs}>
            {ctx.$slots.loading ? (
              ctx.$slots.loading()
            ) : (
              <div class='tw-space-y-2'>
                <div class='tw-text-center'>
                  <Spin class='tw-align-top' size={ctx.loadingSize} />
                </div>
                {ctx.loadingText ? <div class='tw-mt-5 tw-text-center'>{ctx.loadingText}</div> : undefined}
              </div>
            )}
          </div>
        ) : undefined}
      </TransitionCollapse>,
      <TransitionCollapse appear={false}>
        {!ctx.loading_ && ctx.error ? (
          <div {...ctx.$attrs}>
            {ctx.$slots.error ? (
              ctx.$slots.error({ error: ctx.error, reload: ctx.reload })
            ) : (
              <Alert
                type='error'
                closable
                v-slots={{
                  message: () => [
                    ctx.error,
                    <XButtonRefresh only-icon color='primary' size='small' type='link' handler={ctx.reload} />
                  ]
                }}
              />
            )}
          </div>
        ) : undefined}
      </TransitionCollapse>,
      <TransitionCollapse appear={false}>
        {ctx.initialized ? (
          <div {...ctx.$attrs}>{ctx.$slots.default?.({ data: ctx.data, loading: ctx.loading_, reload: ctx.load })}</div>
        ) : undefined}
      </TransitionCollapse>
    ];
  }
});
