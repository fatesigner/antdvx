import 'reflect-metadata';
import { merge } from 'lodash-es';
import { inject, injectable } from 'inversify';
import { isNullOrUndefined } from '@fatesigner/utils/type-check';
import { StructureTree } from '@fatesigner/utils/structure-tree';

import { ANTDVX_SYMBOLS } from '../symbols';
import { IAuthService } from '../interfaces/auth.interface';
import { ISessionService, SessionUser } from '../interfaces/session.interface';

/**
 * 授权、认证服务 config
 */
export interface AuthServiceConfig<TRoles extends readonly string[]> {
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
}

const defaultConfig: AuthServiceConfig<any> = {
  homePage: null,
  redirectEnable: false,
  authPage: null,
  authMode: null,
  superRole: []
};

/**
 * Auth service
 * 授权、认证服务
 */
@injectable()
export class AuthService<
  TUser extends SessionUser<TRoles> & { permissions: string[] },
  TRoles extends readonly string[],
  TRouteMeta extends {
    // 是否允许匿名访问，当设置为 false 时，需要同时配置 auth 属性
    allowAnonymous?: boolean;
    // 允许访问的角色清单
    auth?: TRoles[number][];
  }
> implements IAuthService<TUser, TRoles, TRouteMeta>
{
  config: AuthServiceConfig<TRoles>;

  constructor(
    @inject(ANTDVX_SYMBOLS.AUTH_SERVICE_CONFIG) config: AuthServiceConfig<TRoles>,
    @inject(ANTDVX_SYMBOLS.SESSION_SERVICE) private _sessionService: ISessionService<TUser, TRoles>
  ) {
    this.config = merge({}, defaultConfig, config);
  }

  // 判断当前用户是否已认证
  isAuthenticated(): boolean {
    return !!(this._sessionService.user?.username && this._sessionService.user?.accessToken);
  }

  /**
   * 判断指定的路由是否有权限访问
   * @param to
   * @param roles 指定角色组，默认为当前用户的角色组
   */
  isAuthorized(to: any, roles?: TRoles[number][]) {
    // 跳过授权界面
    if (!to.name || to.name === this.config.authPage) {
      return true;
    }

    // 绕过超级管理员角色
    if (this.config.superRole && this._sessionService?.user?.roles?.some((role) => this.config.superRole.includes(role))) {
      return true;
    }

    if (this.config.authMode === 'client') {
      if (!roles) {
        roles = this._sessionService?.user?.roles ?? [];
      }

      let routes = [];
      if (to.matched && to.matched.length) {
        // 对于嵌套路由的情况，将从尾部（子路由）开始依次验证
        routes = to.matched.slice().reverse();
      } else {
        routes.push(to);
      }

      return routes.every((route) => {
        // 寻找 route 中定义的 meta 属性
        const meta: TRouteMeta = route.meta;
        if (meta && route.name) {
          if (meta.allowAnonymous) {
            // 允许匿名
            return true;
          } else if (meta.auth && meta.auth.length) {
            const isa = this.authRoles(roles, meta.auth);
            return isa.permissible;
          } else {
            // 验证用户是否登录
            return this.isAuthenticated();
          }
        } else {
          // 无 name 属性，视为虚拟路由，跳过
          return true;
        }
      });
    } else {
      return this._sessionService.user.permissions.some((record) => record === to.name);
    }
  }

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
  } {
    const authorizedRolesNew = [];
    const length = authorizedRoles && authorizedRoles.length;
    let temp;
    let temp2 = false;
    for (let i = 0; i < length; i++) {
      temp = authorizedRoles[i];
      for (const item of roles) {
        if (temp === item) {
          temp2 = true;
          break;
        }
      }
      if (!temp2) {
        authorizedRolesNew.push(temp);
        temp2 = false;
      }
    }
    return {
      permissible: !length || authorizedRolesNew.length < length,
      unauthorizedRoles: authorizedRolesNew
    };
  }

  /**
   * 获取指定角色可访问的路由
   * @param routes
   * @param roles 指定的角色列表，默认为当前用户所拥有的的角色
   */
  getAuthorizedRoutes(routes: any[], roles?: TRoles[number][]) {
    roles = roles ?? this._sessionService.user.roles;

    const strutree = new StructureTree<any>({
      idKey: 'path',
      labelKey: 'path',
      childrenKey: 'children'
    });

    const d: any[] = strutree.filter(routes, (node) => {
      return this.isAuthorized(node, roles);
    });

    return d.filter((x) => x.children.length);
  }

  /**
   * 获取指定角色可访问的菜单
   * @param menusFromServer 服务端返回的菜单
   * @param roles 指定的角色列表，默认为当前用户所拥有的的角色
   */
  getAuthorizedMenus(menusFromServer: any[], roles?: TRoles[number][]) {
    if (isNullOrUndefined(roles)) {
      roles = this._sessionService.user.roles;
    }

    // 绕过超级管理员角色
    /* if (this.superRole && roles.includes(this.superRole)) {
      // 获取当前应用下的所有菜单
      return GetMenusFromRoutes(RichRoutes);
    } */

    if (this.config.authMode === 'client') {
      // 客户端授权模式，分析当前路由表以获取菜单
      return [];
    }

    // 服务端授权模式，后端返回菜单
    return menusFromServer;
  }
}
