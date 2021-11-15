/**
 * router
 */

import { i18nMessages } from '@/app/i18n';
import { IRouteConfig } from '@/app/types/route';

export default {
  path: '/transitions',
  component: () => import('@/app/layout/layout-sidebar/layout-sidebar.vue'),
  children: [
    {
      name: 'transitions',
      path: '',
      component: () => import('./transitions.vue'),
      meta: {
        label: i18nMessages.app.route.portal,
        keepAlive: true
      }
    }
  ]
} as IRouteConfig;
