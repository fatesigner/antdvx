/**
 * router
 */

import { i18nMessages } from '@/app/i18n';
import { IRouteConfig } from '@/app/types/route';

export default {
  path: '/tabs',
  component: () => import('@/app/layout/layout-sidebar/layout-sidebar.vue'),
  children: [
    {
      name: 'tabs',
      path: '',
      component: () => import('./tabs.vue'),
      meta: {
        label: i18nMessages.app.route.portal,
        keepAlive: true
      }
    }
  ]
} as IRouteConfig;
