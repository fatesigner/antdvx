/**
 * router
 */

import { i18nMessages } from '@/app/i18n';
import { IRouteConfig } from '@/app/types/route';

export default {
  path: '/echarts',
  component: () => import('@/app/layout/layout-sidebar/layout-sidebar.vue'),
  children: [
    {
      name: 'echarts',
      path: '',
      component: () => import('./echarts.vue'),
      meta: {
        label: i18nMessages.app.route.portal,
        keepAlive: true
      }
    }
  ]
} as IRouteConfig;
