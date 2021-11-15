/**
 * router
 */

import { i18nMessages } from '@/app/i18n';
import { IRouteConfig } from '@/app/types/route';

export default {
  path: '/popup',
  component: () => import('@/app/layout/layout-sidebar/layout-sidebar.vue'),
  children: [
    {
      name: 'popup',
      path: '',
      component: () => import('./popup.vue'),
      meta: {
        label: i18nMessages.app.route.table,
        keepAlive: true
      }
    }
  ]
} as IRouteConfig;
