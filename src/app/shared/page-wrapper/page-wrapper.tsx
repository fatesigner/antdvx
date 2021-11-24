import { Empty } from 'ant-design-vue';
import { bindPromiseQueue } from '@fatesigner/utils';
import { isFunction } from '@fatesigner/utils/type-check';
import { SpinnerLoading, TransitionZoom } from '@/antdvx';
import { PropType, defineComponent, nextTick, onMounted, ref, watch } from 'vue';

import { AppFooter } from '@/app/shared/footer';

import './page-wrapper.less';

export const PageWrapper = defineComponent({
  name: 'page-wrapper',
  props: {
    title: {
      type: String
    },
    footer: {
      type: Boolean,
      default: false
    },
    overflowHidden: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    empty: {
      type: Boolean,
      default: false
    },
    initialize: {
      type: Function as PropType<() => Promise<any>>
    }
  },
  setup(props, { emit }) {
    const data = ref();
    const error = ref();
    const initialized = ref(false);
    const loading_ = ref(false);

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
      if (isFunction(props.initialize)) {
        nextTick().then(() => {
          reload();
        });
      }
    });

    return { loading_, initialized, reload };
  },
  render(ctx) {
    const container = [
      <TransitionZoom>
        {ctx.loading_ ? (
          <div class='page-wrapper-loading'>
            <SpinnerLoading />
          </div>
        ) : (
          ''
        )}
      </TransitionZoom>,
      <TransitionZoom>
        {!ctx.loading_ && ctx.empty ? (
          <Empty
            class='page-wrapper-empty'
            image-style={{ height: '120px' }}
            v-slots={{
              description() {
                return <span class='tw-text-sm tw-text-gray-500'>暂无数据</span>;
              }
            }}
          >
            {ctx.$slots.empty?.({ initialize: ctx.initialize })}
          </Empty>
        ) : (
          ''
        )}
      </TransitionZoom>,
      !ctx.initialize || ctx.initialized ? ctx.$slots.default?.() : ctx.$slots.skeleton?.()
    ];

    return (
      <div class={['page-wrapper', ctx.overflowHidden ? 'tw-h-full tw-overflow-hidden' : undefined]}>
        <div class='page-header'>
          <div class='page-header-top'>
            <div class='page-header-title'>{ctx.title ?? ctx.$slots.title?.()}</div>
            <div class='page-header-actions'>{ctx.$slots.actions?.()}</div>
          </div>
          {ctx.$slots.header?.()}
        </div>
        <div class={['page-container', ctx.overflowHidden ? 'tw-overflow-hidden' : undefined]}>{container}</div>
        {ctx.footer ? <AppFooter /> : ''}
      </div>
    );
  }
});
