/**
 * router
 */

import { i18nMessages } from '@/i18n';
import { IRouteConfig } from '@/types/route';

export default {
  path: '/table',
  component: () => import('@/layout/layout-sidebar/layout-sidebar.vue'),
  children: [
    {
      name: 'table',
      path: '',
      component: () => import('./table.vue'),
      meta: {
        label: i18nMessages.app.route.table,
        keepAlive: true
      }
    }
  ]
} as IRouteConfig;
