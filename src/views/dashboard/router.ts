/**
 * router
 */

import { i18nMessages } from '@/i18n';
import { IRouteConfig } from '@/types/route';

export default {
  path: '/',
  component: () => import('@/layout/layout-sidebar/layout-sidebar.vue'),
  children: [
    {
      name: 'dashboard',
      path: '',
      component: () => import('./dashboard.vue'),
      meta: {
        label: i18nMessages.app.route.dashboard,
        keepAlive: true
      }
    }
  ]
} as IRouteConfig;
