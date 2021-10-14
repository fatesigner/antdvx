/**
 * router
 */

import { i18nMessages } from '@/i18n';
import { IRouteConfig } from '@/types/route';

export default {
  path: '/sticky-section',
  component: () => import('@/layout/layout-sidebar/layout-sidebar.vue'),
  children: [
    {
      name: 'sticky-section',
      path: '',
      component: () => import('./sticky-section.vue'),
      meta: {
        label: i18nMessages.app.route.dashboard,
        keepAlive: true
      }
    }
  ]
} as IRouteConfig;
