/**
 * main
 */

import { createApp } from 'vue';

// App
import { App } from '@/app/app';
import { createAppRouter } from '@/app/router';
import { Pipes } from '@/app/core/pipes';

// Plugins
import { i18n } from '@/app/i18n';
import { Dayjs } from '@/app/plugins/dayjs';
import { Antdvx } from '@/app/plugins/antdvx';
import { VeeValidate } from '@/app/plugins/vee-validate';

// Styles
import '@/app/styles/index.less';

export async function mountApp() {
  const app = createApp(App);
  const router = await createAppRouter();

  app.use(router).use(i18n._).use(Antdvx).use(Dayjs).use(VeeValidate).use(Pipes);

  router.isReady().then(() => {
    // 移除首屏启动界面
    const $splashScreen = document.getElementById('splash-screen');
    if ($splashScreen) {
      $splashScreen.remove();
    }

    app.mount('#app');
  });
}

mountApp();
