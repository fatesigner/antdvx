import { useRoute } from 'vue-router';
import { computed, defineComponent } from 'vue';

import { ENV } from '@/app/core/constants';
import { AppFooter } from '@/app/layout/shared/footer';

import { PassportCore } from './core';

import $styles from './passport-bg.module.less';

/**
 * 带背景图的登录模板
 */
export const PassportBgView = defineComponent({
  name: 'PassportBgView',
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
      <div class={$styles.bg}>
        <div class={$styles.container}>
          <div class={$styles.content}>
            <img class='tw-max-w-full tw-w-100' src={require('@/assets/img/logo.png')} alt={ENV.APP_TITLE} title={ENV.APP_TITLE} />
            <div class={$styles.title}>Staffing Plan Management System</div>
            <div class='tw-w-full'>
              <PassportCore />
            </div>
          </div>
          <div class='tw-p-2'>
            <AppFooter pure />
          </div>
        </div>
      </div>
    );
  }
});
