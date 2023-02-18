import { useRoute } from 'vue-router';
import { computed, defineComponent } from 'vue';

import { ENV } from '@/app/core/constants';
import PassportCore from '@/app/shared/passport/core';

import $styles from './passport-generic.module.less';

/**
 * 通用登录模板
 */
export default defineComponent({
  setup() {
    const route = useRoute();

    // get error message
    const error = computed(() => {
      return route.params.error;
    });

    // Close error
    const closeError = () => {
      route.params.error = null;
    };

    return {
      error,
      closeError
    };
  },
  render() {
    return (
      <div class={['tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-full tw-pt-12 tw-pr-4 tw-pb-12 tw-pl-4', $styles.bg]}>
        <div class={$styles.container}>
          <div class='tw-flex tw-justify-center tw-mb-8'>
            <img height='46' src={require('@/assets/img/logo.png')} alt={ENV.APP_TITLE} title={ENV.APP_TITLE} />
          </div>
          <div class='tw-mb-8 tw-text-center tw-text-sm tw-text-primary tw-italic tw-font-bold'>{ENV.APP_TITLE}</div>
          <PassportCore />
        </div>
      </div>
    );
  }
});
