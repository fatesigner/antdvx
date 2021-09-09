/**
 * router
 */

import { i18nMessages } from '@/i18n';
import { IRouteConfig } from '@/types/route';

export default {
  path: '/transitions',
  component: () => import('@/layout/layout-sidebar/layout-sidebar.vue'),
  children: [
    {
      name: 'transitions',
      path: '',
      component: () => import('./transitions.vue'),
      meta: {
        label: i18nMessages.app.route.dashboard,
        keepAlive: true
      }
    }
  ]
} as IRouteConfig;
