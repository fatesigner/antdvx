/**
 * main
 */

import { createApp } from 'vue';

// App
import { App } from '@/app/app';
import { Pipes } from '@/app/core/pipes';
import { AppStore } from '@/app/core/store';
import { createAppRouter } from '@/app/router';
import { Directives } from '@/app/core/directives';

// Plugins
import { i18n } from '@/app/i18n';
import { Dayjs } from '@/app/plugins/dayjs';
import { Antdvx } from '@/app/plugins/antdvx';
import { Exceljs } from '@/app/plugins/exceljs';
import { VeeValidate } from '@/app/plugins/vee-validate';

// Styles
import '@/app/styles/index.less';

export async function mountApp() {
  const app = createApp(App);
  const router = await createAppRouter();

  app.use(router).use(i18n._).use(Antdvx).use(Exceljs).use(Dayjs).use(VeeValidate).use(Pipes).use(Directives);

  router.isReady().then(() => {
    router.beforeEach((to: any, from: any, next: any) => {
      AppStore.presentProgressBar();
      return next();
    });
    router.beforeResolve((to: any, from: any, next: any) => {
      AppStore.dismissProgressBar();
      return next();
    });

    // 移除首屏启动界面
    const $splashScreen = document.getElementById('splash-screen');
    if ($splashScreen) {
      $splashScreen.remove();
    }

    app.mount('#app');
  });
}

mountApp();
