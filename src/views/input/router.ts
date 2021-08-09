/**
 * router
 */

import { i18nMessages } from '@/i18n';
import { IRouteConfig } from '@/types/route';

export default {
  path: '/input',
  component: () => import('@/layout/layout-sidebar/layout-sidebar.vue'),
  children: [
    {
      name: 'input',
      path: '',
      component: () => import('./input.vue'),
      meta: {
        label: i18nMessages.app.route.button,
        keepAlive: true
      }
    }
  ]
} as IRouteConfig;
