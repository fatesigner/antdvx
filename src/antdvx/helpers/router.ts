/**
 * router
 */

import { RouteLocationNormalizedLoaded } from 'vue-router';

import { IRouteLocationNormalized } from '../types';

/**
 * 获取指定 Component 的标识，默认为 name，当 name 不存在时，取 __hmrId
 * @param component
 */
export function getComponentName(component: any) {
  if (component) {
    if (component.type) {
      return component.type.name ?? component.type.__hmrId;
    } else {
      return component.name ?? component.__hmrId;
    }
  }
  return undefined;
}

/**
 * 获取指定 Component 对应的 route 和 key（默认为 route.fullPath），用于 RouterView 的 keepAlive 渲染
 * @param component
 * @param route
 */
export function getMatchedRoute(component: any, route: RouteLocationNormalizedLoaded) {
  let key = route.fullPath;
  const componentName = getComponentName(component);
  const matchedRoute = componentName ? route?.matched?.find((x) => getComponentName(x?.components?.default) === componentName) : undefined;
  if (matchedRoute) {
    // const currentRoute = route.matched[route.matched.length - 1];
    const path = route.path;
    const diffPath = path.replace(matchedRoute.path, '');
    if (diffPath) {
      key = key.replace(diffPath, '');
    }
  }
  return {
    matchedRoute: matchedRoute ?? route,
    key: key || route.fullPath
  };
}

/**
 * 给定一个路由，获取其访问权限
 * @param to
 * @param authenticator 是否已认证
 * @param authorizer 是否已授权
 * @constructor
 */
export function getAccessPermission<TRoleName extends string = string>(
  to: IRouteLocationNormalized<TRoleName>,
  authenticator: () => boolean,
  authorizer: (to: IRouteLocationNormalized<TRoleName>) => boolean
): 200 | 401 | 403 | 404 {
  if (authenticator()) {
    // 用户已认证
    if (to.matched.length) {
      // 路由已匹配
      if (!authorizer(to)) {
        // 无访问权限
        return 403;
      }
    } else {
      // 路由未匹配
      return 404;
    }
  } else {
    // 用户未认证
    if (to.matched.length) {
      // 路由已匹配
      if (!authorizer(to)) {
        // 无访问权限
        return 401;
      }
    } else {
      // 路由不存在
      return 404;
    }
  }

  return 200;
}
