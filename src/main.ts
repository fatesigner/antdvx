/**
 * main
 */

import { createApp } from 'vue';

// Plugins
import { i18n } from '@/i18n';
import { Antdvx } from '@/plugins/antdvx';
import { Dayjs } from '@/plugins/dayjs';
import { VeeValidate } from '@/plugins/vee-validate';

// Styles
import './main.less';

// App
import App from '@/app/App.vue';
import { Pipes } from '@/app/pipes';
import { createAppRouter } from '@/app/router';

async function mountApp() {
  const router = await createAppRouter();

  const app = createApp(App).use(router).use(i18n._).use(Antdvx).use(Dayjs).use(VeeValidate).use(Pipes);

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
