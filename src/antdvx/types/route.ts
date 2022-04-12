import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';

/**
 * 附加到 route 记录上的任意数据
 */
export interface IRouteMeta<TRoleName extends readonly string[] = never> {
  /**
   * 标签，用于描述该页面名称
   */
  label?: string;
  /**
   * 是否缓存视图
   */
  keepAlive?: boolean;
  /**
   * 是否允许匿名访问，当设置为 false 时，需同时配置 auth 属性
   */
  allowAnonymous?: boolean;
  /**
   * 允许访问的角色名称列表
   */
  auth?: TRoleName[number][];
}

/**
 * RouteRecordRaw 接口
 */
export type IRouteRecordRaw<TRoleName extends readonly string[] = never> = RouteRecordRaw & {
  meta?: IRouteMeta<TRoleName>;
  children?: IRouteRecordRaw<TRoleName>[];
};

/**
 * RouteLocationNormalized 接口
 */
export type IRouteLocationNormalized<TRoleName extends readonly string[] = never> = RouteLocationNormalized & {
  meta?: IRouteMeta<TRoleName>;
};
