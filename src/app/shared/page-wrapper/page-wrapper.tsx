import { defineComponent, nextTick, onMounted, PropType, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { bindPromiseQueue } from '@fatesigner/utils';
import { isFunction, isString } from '@fatesigner/utils/type-check';
import { Empty, Spin } from 'ant-design-vue';
import { IconArrowLeftLine, ScrollView, TransitionZoom } from 'antdvx';

import { AppFooter } from '@/app/layout/shared/footer';

import $styles from './page-wrapper.module.less';

/**
 * 视图容器
 */
export const PageWrapper = defineComponent({
  name: 'PageWrapper',
  props: {
    title: {
      type: String
    },
    footer: {
      type: Boolean,
      default: false
    },
    bgGray: {
      type: Boolean,
      default: false
    },
    overflow: {
      type: String as PropType<'scroll' | 'hidden'>
    },
    returnable: {
      type: [Boolean, String],
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
    const router = useRouter();

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

    // 回到上一页
    const returnToPrevious = () => {
      if (isString(props.returnable)) {
        router.push({ path: props.returnable as string });
      } else if (props.returnable) {
        router.back();
      }
    };

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

    return { loading_, initialized, returnToPrevious, reload };
  },
  render(ctx) {
    const container = [
      <TransitionZoom>
        {ctx.loading_ ? (
          <div class='page-wrapper-loading'>
            <Spin />
          </div>
        ) : undefined}
      </TransitionZoom>,
      <TransitionZoom>
        {!ctx.loading_ && ctx.empty ? (
          <Empty
            class='page-wrapper-empty'
            image={require('@/assets/img/nodata.png')}
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

    const hasTop = ctx.returnable || ctx.title || ctx.$slots?.title || ctx.$slots?.actions;

    const wrapper = (
      <div
        class={[
          $styles['page-wrapper'],
          ctx.overflow === 'hidden' ? 'tw-h-full tw-overflow-hidden' : undefined,
          ctx.bgGray ? $styles['page-bg-gray'] : undefined
        ]}
      >
        {hasTop || ctx.$slots?.header ? (
          <div class={$styles['page-header']}>
            {hasTop ? (
              <div class={$styles['page-header-top']}>
                <div class={$styles['page-header-title']}>
                  {[
                    ctx.returnable ? (
                      <span
                        class={$styles['page-wrapper-back']}
                        title='Return to previous page'
                        onClick={ctx.returnToPrevious}
                      >
                        <IconArrowLeftLine />
                      </span>
                    ) : undefined,
                    ctx.$slots.icon?.(),
                    ctx.title ? <span>{ctx.title}</span> : undefined,
                    ctx.$slots.title?.()
                  ]}
                </div>
                <div class={$styles['page-header-actions']}>{ctx.$slots.actions?.()}</div>
              </div>
            ) : undefined}
            {ctx.$slots.header?.()}
          </div>
        ) : undefined}
        <div class={$styles['page-container']}>{container}</div>
        {ctx.footer ? <AppFooter /> : undefined}
      </div>
    );

    return ctx.overflow === 'scroll' ? (
      <ScrollView fillY scrollY>
        {wrapper}
      </ScrollView>
    ) : (
      wrapper
    );
  }
});
