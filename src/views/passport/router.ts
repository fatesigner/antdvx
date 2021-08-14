/**
 * router
 */

import { i18nMessages } from '@/i18n';
import { IRouteConfig } from '@/types/route';

export default {
  path: '/passport',
  component: () => import('@/layout/layout-empty.vue'),
  children: [
    {
      name: 'login',
      path: 'login',
      component: () => import('./login/login.vue'),
      meta: {
        label: i18nMessages.app.route.login,
        keepAlive: true,
        allowAnonymous: true
      }
    }
  ]
} as IRouteConfig;
