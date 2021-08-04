/**
 * router
 */

import { RouteLocationNormalized } from 'vue-router';

/**
 * 给定一个路由，获取其访问权限
 * @param to
 * @param authenticator 是否已认证
 * @param authorizer 是否已授权
 * @constructor
 */
export function getAccessPermission<
  TLocation extends RouteLocationNormalized,
  TAuthenticator extends () => boolean,
  TAuthorizer extends (to: TLocation) => boolean
>(to: TLocation, authenticator: TAuthenticator, authorizer: TAuthorizer): 200 | 401 | 403 | 404 {
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
