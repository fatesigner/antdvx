/**
 * router
 */

import { i18nMessages } from '@/i18n';
import { IRouteConfig } from '@/types/route';

export default {
  path: '/button',
  component: () => import('@/layout/layout-sidebar/layout-sidebar.vue'),
  children: [
    {
      name: 'button',
      path: '',
      component: () => import('./button.vue'),
      meta: {
        label: i18nMessages.app.route.button,
        keepAlive: true
      }
    }
  ]
} as IRouteConfig;
