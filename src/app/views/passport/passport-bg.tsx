import { computed, defineComponent } from 'vue';
import { useRoute } from 'vue-router';

import { ENV } from '@/app/core/constants';
import AppFooter from '@/app/layout/shared/footer/footer';
import PassportCore from '@/app/shared/passport/core';
import { LogoImage } from '@/assets';

import $styles from './passport-bg.module.less';

/**
 * 带背景图的登录模板
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
      <div class={$styles.wrap}>
        <div class={$styles.bg}>
          <div class='tw-m-auto tw-space-y-8 tw-p-8 _md:tw-hidden'>
            <div class='tw-text-2xl tw-text-white lg:tw-text-5xl'>{ENV.APP_TITLE}</div>
            <div class='tw-text-md tw-text-white lg:tw-text-2xl'></div>
          </div>
        </div>
        <div class={$styles.container}>
          <div class={$styles.content}>
            <img class={$styles.logo} height='46' src={LogoImage} alt={ENV.APP_TITLE} title={ENV.APP_TITLE} />
            <div class={$styles.title}>{ENV.APP_TITLE}</div>
            <PassportCore />
            <div class={$styles.footer}>
              <AppFooter pure />
            </div>
          </div>
        </div>
      </div>
    );
  }
});
