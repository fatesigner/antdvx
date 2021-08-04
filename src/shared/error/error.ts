/**
 * error
 */

import { RouteLocationNormalized, Router } from 'vue-router';

export function AddNotFoundRoute(to: RouteLocationNormalized, router: Router, layoutComp: any, props?: any): Router {
  router.addRoute({
    path: to.path,
    component: layoutComp,
    children: [
      {
        name: to.name,
        path: '',
        meta: to.meta,
        props: props,
        component: () => import('./not-found.vue')
      }
    ]
  });
  return router;
}

export function AddUnauthorizedRoute(to: RouteLocationNormalized, router: Router, layoutComp: any, props?: any): Router {
  router.addRoute({
    path: to.path,
    component: layoutComp,
    children: [
      {
        name: to.name,
        path: '',
        meta: to.meta,
        props: props,
        component: () => import('./unauthorized.vue')
      }
    ]
  });
  return router;
}
