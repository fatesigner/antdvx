import { NamesTypeOfRole } from './role';
import { IUser, RoleTypeOfUser } from './user';

/**
 * Session 注销结果类型
 */
export interface SessionLogoutResult {
  /**
   * 指示此次注销动作是 session 过期导致的还是用户主动触发
   */
  expired: boolean;
  /**
   * 消息（用于提示弹出）
   */
  message: string;
}

/**
 * session 服务接口
 */
export interface ISessionService<TUser extends IUser> {
  config: {
    getUserModel: () => TUser;
    onLogin: (user: TUser) => void;
    onLogout: (result: SessionLogoutResult) => void;
    onRoleChanged: (role: RoleTypeOfUser<TUser>) => void;
  };

  /**
   * 当前用户信息
   */
  user: TUser;

  /**
   * 获取默认用户信息
   */
  getDefaultUser(user?: Partial<TUser>): TUser;

  /**
   * 登录
   * @param user
   */
  login(user: TUser): Promise<void>;

  /**
   * 注销
   * @param config
   */
  logout(config?: SessionLogoutResult): Promise<void>;

  /**
   * 更新当前用户信息
   * @param user
   */
  updateUser(user: Partial<TUser>): void;

  /**
   * 更新用户角色
   * @param roleName
   */
  updateRole(roleName: NamesTypeOfRole<RoleTypeOfUser<TUser>>): Promise<void>;

  /**
   * 验证指定用户信息是否有效（是否为空值或过期）
   * @param user
   */
  verify(user?: TUser): void;

  /**
   * 将用户信息持久化保存至客户端
   */
  saveToLocalStorage(): void;
}
