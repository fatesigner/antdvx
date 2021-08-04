/**
 * main
 */

import { createApp } from 'vue';
import { TransitionRouter } from '@/antdvx/components/transitions';

// Plugins
import { i18n } from '@/i18n';
import { Antdv } from '@/plugins/antdv';
import { Dayjs } from '@/plugins/dayjs';
import { VeeValidate } from '@/plugins/vee-validate';

// Styles
import './main.scss';

// App
import App from '@/app/App.vue';
import { Pipes } from '@/app/pipes';
import { createAppRouter } from '@/app/router';

async function mountApp() {
  const router = await createAppRouter();

  const app = createApp(App).use(router).use(i18n._).use(Antdv).use(Dayjs).use(VeeValidate).use(Pipes);

  // 注册全局组件
  app.component('TransitionRouter', TransitionRouter);

  router.isReady().then(() => {
    // 隐藏启动界面
    const $splashScreen = document.getElementById('splash-screen');
    if ($splashScreen) {
      $splashScreen.remove();
    }

    app.mount('#app');
  });
}

mountApp();
