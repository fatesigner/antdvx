/**
 * router
 */

import { i18nMessages } from '@/i18n';
import { IRouteConfig } from '@/types/route';

export default {
  path: '/icons',
  component: () => import('@/layout/layout-sidebar/layout-sidebar.vue'),
  children: [
    {
      name: 'icons',
      path: '',
      component: () => import('./icons.vue'),
      meta: {
        label: i18nMessages.app.route.button,
        keepAlive: true
      }
    }
  ]
} as IRouteConfig;
