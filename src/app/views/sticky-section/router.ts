/**
 * router
 */

import { i18nMessages } from '@/app/i18n';
import { IRouteConfig } from '@/app/types/route';

export default {
  path: '/sticky-section',
  component: () => import('@/app/layout/layout-sidebar/layout-sidebar.vue'),
  children: [
    {
      name: 'sticky-section',
      path: '',
      component: () => import('./sticky-section.vue'),
      meta: {
        label: i18nMessages.app.route.portal,
        keepAlive: true
      }
    }
  ]
} as IRouteConfig;
