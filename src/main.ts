/**
 * main
 */

import { createApp } from 'vue';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';

// App
import { App } from '@/app/app';
import { Pipes } from '@/app/core/pipes';
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

async function mountApp() {
  const app = createApp(App);
  const router = await createAppRouter();

  app.use(router).use(i18n._).use(Antdvx).use(Dayjs).use(Exceljs).use(VeeValidate).use(Pipes).use(Directives);

  router.isReady().then(() => {
    // Nprogress 延迟 100ms 显示
    let progressBarTimeout;
    const clearProgressBarTimeout = () => {
      if (progressBarTimeout) {
        clearTimeout(progressBarTimeout);
        progressBarTimeout = null;
      }
    };
    const startProgressBar = () => {
      clearProgressBarTimeout();
      progressBarTimeout = setTimeout(() => {
        nprogress.start();
      }, 200);
    };
    const stopProgressBar = () => {
      clearProgressBarTimeout();
      nprogress.done();
    };

    router.beforeEach((to: any, from: any, next: any) => {
      startProgressBar();
      return next();
    });

    router.beforeResolve((to: any, from: any, next: any) => {
      stopProgressBar();
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
