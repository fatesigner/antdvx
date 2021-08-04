/**
 * router
 */

import { i18nMessages } from '@/i18n';
import { IRouteConfig } from '@/types/route';

export default {
  path: '/auth',
  component: () => import('@/layout/layout-sidebar/layout-sidebar.vue'),
  children: [
    {
      name: 'users',
      path: 'users',
      component: () => import('./users/users.vue'),
      meta: {
        label: i18nMessages.app.route.dashboard,
        keepAlive: true
      }
    },
    {
      name: 'roles',
      path: 'roles',
      component: () => import('./roles/roles.vue'),
      meta: {
        label: i18nMessages.app.route.dashboard,
        keepAlive: true
      }
    }
  ]
} as IRouteConfig;
