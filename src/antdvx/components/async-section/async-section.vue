<template>
  <div :class="[$style.transition, $style.hidden]" ref="loadingRef">
    <slot name="loading">
      <div :class="$style.loading">
        <div class="tw-space-y-2">
          <div class="tw-text-center"><SpinnerLoading :size="loadingSize" /></div>
          <div v-if="loadingText" class="tw-mt-5">{{ loadingText }}</div>
        </div>
      </div>
    </slot>
  </div>

  <div :class="[$style.transition, $style.hidden]" ref="errorRef">
    <slot name="error" v-bind="{ error, reload }">
      <div :class="$style.error">
        <AAlert type="error" show-icon>
          <!--<template #message>{{ $t(i18nMessages.antd.asyncAction.error) }}</template>-->
          <template #description>
            {{ error }}
            <XButtonRefresh only-icon color="primary" size="small" type="link" :handler="reload" />
          </template>
        </AAlert>
      </div>
    </slot>
  </div>

  <div v-if="initialized" :class="[$style.transition, $style.hidden]" ref="contentRef">
    <slot v-bind="{ data, loading: loading_, reload: load }" />
  </div>
</template>

<script lang="ts">
import { Alert } from 'ant-design-vue';
import { bindPromiseQueue } from '@fatesigner/utils';
import { PropType, defineComponent, nextTick, onMounted, ref, useCssModule, watch } from 'vue';

import { i18nMessages } from '../../i18n/messages';
import { collapseSection, expandSection } from '../../utils';

import { XButtonRefresh } from '../button';
import { SpinnerLoading } from '../loading';
import { IScrollViewOptions } from '../scroll-view';

export default defineComponent({
  name: 'async-action',
  components: {
    XButtonRefresh,
    SpinnerLoading,
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
      type: String as PropType<IScrollViewOptions['loadingSize']>,
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
    const $style = useCssModule();

    const errorRef = ref();
    const loadingRef = ref();
    const contentRef = ref();

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
          if (val) {
            Promise.all([
              expandSection(loadingRef.value, function (el) {
                el.classList.remove($style.hidden);
              }),
              collapseSection(errorRef.value, function (el) {
                el.classList.add($style.hidden);
              })
            ]);
          } else {
            collapseSection(loadingRef.value, function (el) {
              el.classList.add($style.hidden);
            });
          }
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
          collapseSection(errorRef.value, function (el) {
            el.classList.add($style.hidden);
          });
          return res;
        })
        .catch((err: Error) => {
          error.value = err.message;
          expandSection(errorRef.value, function (el) {
            el.classList.remove($style.hidden);
          });
        })
        .finally(() => {
          nextTick(() => {
            emit('initialized', data.value);
          });
        });
    }, true);

    const reload = async () => {
      loading_.value = true;
      await nextTick();

      await Promise.all([
        expandSection(loadingRef.value, function (el) {
          el.classList.remove($style.hidden);
        }),
        collapseSection(errorRef.value, function (el) {
          el.classList.add($style.hidden);
        })
      ]);

      await load();

      loading_.value = false;
      await nextTick();

      let promises = [
        collapseSection(loadingRef.value, function (el) {
          el.classList.add($style.hidden);
        })
      ];

      if (contentRef.value) {
        promises.push(
          expandSection(contentRef.value, function (el) {
            el.classList.remove($style.hidden);
          })
        );
      }

      await Promise.all(promises);
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
      errorRef,
      loadingRef,
      contentRef,
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

<style lang="less" module>
.transition {
  overflow: hidden;
  transition-timing-function: ease;
  transition-duration: 0.2s;
  transition-property: height;
}

.hidden {
  height: 0;
}
</style>
