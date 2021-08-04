/**
 * 授权、认证服务接口
 */
export interface IAuthService<
  TUser extends Record<string, any>,
  TRoles extends readonly string[],
  TRouteMeta extends {
    // 是否允许匿名访问，当设置为 false 时，需要同时配置 auth 属性
    allowAnonymous?: boolean;
    // 允许访问的角色清单
    auth?: TRoles[number][];
  }
> {
  config: {
    // 主页地址
    homePage: string;
    // 授权界面地址 name
    authPage: string;
    // 授权认证模式
    authMode: 'client' | 'server';
    // 是否开启重定向模式，登出后将暂存当前地址，登录后重定向至该地址
    redirectEnable?: boolean;
    // 超级管理员角色，该角色将会跳过认证
    superRole: TRoles[number][];
  };

  // 判断当前用户是否已认证
  isAuthenticated(): boolean;

  /**
   * 判断指定的路由是否有权限访问
   * @param to
   * @param roles 指定角色组，默认为当前用户的角色组
   */
  isAuthorized(to: any, roles?: TRoles[number][]): boolean;

  /**
   * 对于指定的角色组，判断给定的角色组是否已授权（即两个集合是否交集）
   * @param roles   roles
   * @param {Array} authorizedRoles
   * 没有指定角色组 视为已授权
   * @return {Object}
   * permissible：是否有权限访问
   * unauthorizedRoles：未符合的角色组 若数量和小于指定的角色组 视为 已授权 否则为 未授权
   */
  authRoles(
    roles: TRoles[number][],
    authorizedRoles: TRoles[number][]
  ): {
    permissible: boolean;
    unauthorizedRoles: TRoles[number][];
  };

  /**
   * 获取指定角色可访问的路由
   * @param routes
   * @param roles 指定的角色列表，默认为当前用户所拥有的的角色
   */
  getAuthorizedRoutes(routes: any[], roles?: TRoles[number][]): any[];

  /**
   * 获取指定角色可访问的菜单
   * @param menusFromServer 服务端返回的菜单
   * @param roles 指定的角色列表，默认为当前用户所拥有的的角色
   */
  getAuthorizedMenus(menusFromServer: any[], roles?: TRoles[number][]): any[];
}
