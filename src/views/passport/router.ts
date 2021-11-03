/**
 * router
 */

import { i18nMessages } from '@/i18n';
import { IRouteConfig } from '@/types/route';

export default {
  name: 'passport',
  path: '/passport',
  component: () => import('@/layout/layout-empty.vue'),
  children: [
    {
      name: 'login',
      path: 'login',
      component: () => import('./login-generic.vue'),
      meta: {
        label: i18nMessages.app.route.passport.login,
        keepAlive: true,
        allowAnonymous: true
      }
    }
  ]
} as IRouteConfig;
