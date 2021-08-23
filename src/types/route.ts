/**
 * route
 */

import { Component } from 'vue';
import { RouteRecordRaw } from 'vue-router';

export interface RouteMeta<TRoles extends readonly string[] = string[]> {
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

export type IRouteConfig<TRoles extends readonly string[] = string[]> = Omit<RouteRecordRaw, 'name'> & {
  name?: string;
  components?: {
    default: Component;
    header?: Component;
    sideMenus?: Component;
    footer?: Component;
  };
} & {
  meta?: RouteMeta<TRoles>;
  children?: IRouteConfig<TRoles>[];
};
