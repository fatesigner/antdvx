type Optional<T> = { [P in keyof T]?: T[P] };

export interface SessionUser<TRoles extends readonly string[]> {
  username?: string;
  currentRole?: TRoles[number];
  roles?: TRoles[number][];
  accessToken?: string;
  tokenExpirationTime?: number;
}

export interface SessionLogoutResult {
  // 注销原因：用户主动触发或者是用户信息过期
  expired: boolean;
  // 对应的 message
  message: string;
}

/**
 * session 服务接口
 */
export interface ISessionService<TUser extends SessionUser<TRoles>, TRoles extends readonly string[]> {
  config: {
    getUserModel: () => TUser;
    onLogin: (user: TUser) => void;
    onLogout: (result: SessionLogoutResult) => void;
    onRoleChanged: (roles: TRoles[number]) => void;
  };

  /**
   * 当前用户信息
   */
  user: TUser;

  /**
   * 获取默认用户信息
   */
  getDefaultUser(user?: Optional<TUser>): TUser;

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

  updateRole(role: TRoles[number]): void;

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
