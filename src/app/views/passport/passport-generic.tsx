import { computed, defineComponent } from 'vue';
import { useRoute } from 'vue-router';

import { ENV } from '@/app/core/constants';
import PassportCore from '@/app/shared/passport/core';
import { LogoImage } from '@/assets';

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
      <div
        class={[
          'tw-flex tw-h-full tw-flex-col tw-items-center tw-justify-center tw-pb-12 tw-pl-4 tw-pr-4 tw-pt-12',
          $styles.bg
        ]}>
        <div class={$styles.container}>
          <div class='tw-mb-8 tw-flex tw-justify-center'>
            <img height='46' src={LogoImage} alt={ENV.APP_TITLE} title={ENV.APP_TITLE} />
          </div>
          <div class='tw-mb-8 tw-text-center tw-text-sm tw-font-bold tw-italic tw-text-primary'>{ENV.APP_TITLE}</div>
          <PassportCore />
        </div>
      </div>
    );
  }
});
