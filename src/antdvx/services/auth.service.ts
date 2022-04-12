import 'reflect-metadata';
import { isArray, mergeWith } from 'lodash-es';
import { inject, injectable } from 'inversify';
import { isNullOrUndefined } from '@fatesigner/utils/type-check';
import { StructureTree } from '@fatesigner/utils/structure-tree';

import { ANTDVX_SYMBOLS } from '../symbols';
import { AuthServiceConfig, IAuthService, IMenu, IRouteLocationNormalized, ISessionService, IUser, NamesTypeOfRole, RoleTypeOfUser } from '../types';

const defaultConfig: AuthServiceConfig = {
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
  TUser extends IUser = IUser,
  TRoute extends IRouteLocationNormalized<NamesTypeOfRole<RoleTypeOfUser<TUser>>> = IRouteLocationNormalized<NamesTypeOfRole<RoleTypeOfUser<TUser>>>,
  TMenu extends IMenu = IMenu
> implements IAuthService<TUser, TRoute, TMenu>
{
  config: AuthServiceConfig<TUser>;

  constructor(
    @inject(ANTDVX_SYMBOLS.AUTH_SERVICE_CONFIG) config: AuthServiceConfig<TUser>,
    @inject(ANTDVX_SYMBOLS.SESSION_SERVICE) private _sessionService: ISessionService<TUser>
  ) {
    this.config = mergeWith({}, defaultConfig, config, (objVal, srcVal) => (isArray(objVal) ? srcVal : undefined));
  }

  isAuthenticated(): boolean {
    return !!(this._sessionService.user?.username && this._sessionService.user?.accessToken);
  }

  isAuthorized(to: TRoute, roles?: NamesTypeOfRole<RoleTypeOfUser<TUser>>[number][]) {
    // 跳过授权界面
    if (!to.name || to.name === this.config.authPage) {
      return true;
    }

    // 绕过超级管理员角色
    if (this.config.superRole && this._sessionService?.user?.roles?.some((role) => this.config.superRole.includes(role.name))) {
      return true;
    }

    if (this.config.authMode === 'client') {
      if (!roles) {
        roles = this._sessionService?.user?.roles?.map((x) => x.name) ?? [];
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
        const meta: TRoute['meta'] = route.meta;
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
      return this._sessionService.user?.role?.menus?.some?.((menu) => menu.name === to.name);
    }
  }

  authRoles(roles: NamesTypeOfRole<RoleTypeOfUser<TUser>>[number][], authorizedRoles: NamesTypeOfRole<RoleTypeOfUser<TUser>>[number][]) {
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

  getAuthorizedRoutes(routes: TRoute[], roles?: NamesTypeOfRole<RoleTypeOfUser<TUser>>[number][]) {
    roles = roles ?? this._sessionService?.user?.roles?.map?.((x) => x.name);

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

  getAuthorizedMenus(menusFromServer: TMenu[], roles?: NamesTypeOfRole<RoleTypeOfUser<TUser>>[number][]) {
    if (isNullOrUndefined(roles)) {
      roles = this._sessionService?.user?.roles?.map?.((x) => x.name) ?? [];
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
