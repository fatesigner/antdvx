import 'reflect-metadata';
import { merge } from 'lodash-es';
import { inject, injectable } from 'inversify';
import { isNullOrUndefined } from '@fatesigner/utils/type-check';

import { ANTDVX_SYMBOLS } from '../symbols';
import { IStorageService } from '../interfaces/storage.interface';
import { ISessionService, SessionLogoutResult, SessionUser } from '../interfaces/session.interface';
import { timer } from 'rxjs';

/**
 * session config
 */
export interface SessionServiceConfig<TUser extends SessionUser<TRoles>, TRoles extends readonly string[]> {
  getUserModel: () => TUser;
  onLogin: (user: TUser) => void;
  onLogout: (result: SessionLogoutResult) => void;
  onRoleChanged: (roles: TRoles[number]) => void;
}

/**
 * session 服务
 */
@injectable()
export class SessionService<TUser extends SessionUser<TRoles>, TRoles extends readonly string[]> implements ISessionService<TUser, TRoles> {
  config: SessionServiceConfig<TUser, TRoles>;

  /**
   * 当前用户信息
   */
  user: TUser;

  constructor(
    @inject(ANTDVX_SYMBOLS.SESSION_SERVICE_CONFIG) config: SessionServiceConfig<TUser, TRoles>,
    @inject(ANTDVX_SYMBOLS.STORAGE_SERVICE) private _localStorageService: IStorageService
  ) {
    this.config = merge({}, config);

    // 从 localStorage 中获取用户信息
    const user: TUser = this._localStorageService.get('user');

    // 验证用户信息有效性
    if (this.verify(user)) {
      this.updateUser(user);
      this.config?.onLogin?.(user);
    } else {
      // 重置用户信息
      this.updateUser(this.getDefaultUser());
    }
  }

  /**
   * 获取默认用户信息
   */
  getDefaultUser(user?: { [P in keyof TUser]?: TUser[P] }): TUser {
    return merge(this.config?.getUserModel?.(), user);
  }

  /**
   * 登录
   * @param user
   */
  async login(user: TUser) {
    this.updateUser(user);
    this.config?.onLogin?.(user);
    // 因为事件传递需要事件，这里做延迟 1s 处理
    await timer(500).toPromise();
  }

  /**
   * 注销
   * @param config
   */
  async logout(config?: SessionLogoutResult) {
    // 保存上次登录过的用户名
    this.updateUser(this.getDefaultUser({ username: this.user.username } as any));
    this.config?.onLogout?.(config);
    // 因为事件传递需要事件，这里做延迟处理
    await timer(500).toPromise();
  }

  /**
   * 更新当前用户信息
   * @param user
   */
  updateUser(user: TUser) {
    if (user) {
      // this.user = user;
      this.user = merge({}, this.user, user);
      this.saveToLocalStorage();

      /*this.user.permissions = [];
      if (!this.user.menus) {
        this.user.menus = [];
      }*/

      /* const strutree = new StructureTree<IMenu>();
      strutree.forEach(this.user.menus, (node) => {
        if (node.name) {
          this.user.permissions.push(node.name);
        }
      }); */
    }
  }

  updateRole(role: TRoles[number]) {
    merge(this.user, { currentRole: role });
    this.config?.onRoleChanged?.(role);
    this.saveToLocalStorage();
  }

  /**
   * 验证指定用户信息是否有效（是否为空值或过期）
   * @param user
   */
  verify(user?: TUser) {
    if (isNullOrUndefined(user)) {
      user = this.user;
    }

    // 和当前时间戳比较
    if (user) {
      return user.accessToken && user.accessToken.trim() && user.tokenExpirationTime > new Date().getTime();
    }

    return false;
  }

  /**
   * 将用户信息持久化保存至客户端
   */
  saveToLocalStorage() {
    this._localStorageService.set('user', this.user);
  }
}
