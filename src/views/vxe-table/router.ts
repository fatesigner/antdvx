/**
 * router
 */

import { i18nMessages } from '@/i18n';
import { IRouteConfig } from '@/types/route';

export default {
  path: '/vxe-table',
  component: () => import('@/layout/layout-sidebar/layout-sidebar.vue'),
  children: [
    {
      name: 'vxe-table',
      path: '',
      component: () => import('./vxe-table.vue'),
      meta: {
        label: i18nMessages.app.route.table,
        keepAlive: true
      }
    }
  ]
} as IRouteConfig;
