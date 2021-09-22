/**
 * router
 */

import { i18nMessages } from '@/i18n';
import { IRouteConfig } from '@/types/route';

export default {
  path: '/grid-dragable',
  component: () => import('@/layout/layout-sidebar/layout-sidebar.vue'),
  children: [
    {
      name: 'grid-dragable',
      path: '',
      component: () => import('./grid-dragable.vue'),
      meta: {
        label: i18nMessages.app.route.dashboard,
        keepAlive: true
      }
    }
  ]
} as IRouteConfig;
