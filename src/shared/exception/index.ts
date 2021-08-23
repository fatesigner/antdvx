import { RouteLocationNormalized, Router } from 'vue-router';
import { getGUID } from '@fatesigner/utils/random';

export { default as NotFound } from './not-found.vue';

export { default as Unauthorized } from './unauthorized.vue';

// 动态路由名称前缀
const routeNamePrefix = 'Exception_' + getGUID(12);

/**
 * 动态添加 异常界面 路由
 * @param router
 * @param statusCode
 * @param to
 * @param layoutComp
 * @param props
 */
export function addExceptionRoute(router: Router, statusCode: 401 | 403 | 404, to: RouteLocationNormalized, layoutComp: any, props?: any): string {
  let comp;
  if (statusCode === 404) {
    comp = () => import('./not-found.vue');
  } else {
    comp = () => import('./unauthorized.vue');
  }

  const name = `${routeNamePrefix}_${to?.name?.toString() ?? ''}`;

  router.addRoute({
    path: to.fullPath,
    component: layoutComp,
    children: [
      {
        name,
        path: '',
        props: props,
        component: comp,
        meta: {
          allowAnonymous: true
        }
      }
    ]
  });

  return name;
}
