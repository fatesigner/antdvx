/**
 * router
 */

import { Component } from '@vue/runtime-core';
import { getGUID } from '@fatesigner/utils/random';
import { isArray } from '@fatesigner/utils/type-check';
import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';

/**
 * 附加的路由信息
 */
export interface IRouteMeta<TRoles extends readonly string[] = string[]> {
  // 标签，用于描述该页面名称
  label?: string;
  // 是否缓存视图
  keepAlive?: boolean;
  // 自定义数据
  data?: Record<string, any>;
  // 是否允许匿名访问，当设置为 false 时，需要同时配置 auth 属性
  allowAnonymous?: boolean;
  // 允许访问的角色清单
  auth?: TRoles[number][];
}

/**
 * 路由
 */
export type IRouteRecord<TRoles extends readonly string[] = string[]> = Omit<RouteRecordRaw, 'name'> & {
  name: string;
  components?: {
    default: Component;
    header?: Component;
    sideMenus?: Component;
    footer?: Component;
  };
} & {
  meta?: IRouteMeta<TRoles>;
  children?: IRouteRecord<TRoles>[];
};

const routes = [];

/**
 * 注册路由
 * @param route
 * @param layoutComp 母版页组件，相同的母版页将会合并，请确保根组件 name 在全局的唯一性
 */
export function registerRoute<TRoles extends readonly string[], TRoute extends IRouteRecord<TRoles>>(
  route: TRoute | TRoute[],
  layout?: {
    name: string;
    component?: Component;
  }
) {
  let name;
  const cacheRoot = [];

  if (!isArray(route)) {
    // route = [route];
  }

  if (layout) {
    name = layout.name;
  } else {
    //name = route.name;
  }

  (route as TRoute[]).forEach((r) => {
    if (cacheRoot.includes(name)) {
      // 已存在的 root
      console.warn(`[App Router warn]: The root route named '${name}' is duplicated`);
      if (!layout) {
        //route.name = name + '_' + getGUID(12);
      }
    } else {
      cacheRoot.push(name);
    }
  });

  if (layout) {
    routes.push({
      name: layout.name,
      component: layout.component,
      children: [route]
    });
  } else {
    routes.push(route);
  }
}

/**
 * 获取当前已注册的路由
 */
export function getRegistedRoutes() {
  return routes;
}

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
