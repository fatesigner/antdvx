import { IRole } from './role';

/**
 * 用户
 */
export interface IUser<TRole extends IRole = IRole> {
  /**
   * 用户 ID（主键，需保证唯一性）
   */
  userid?: number | string;
  /**
   * 用户账号名
   */
  username: string;
  /**
   * 用户昵称
   */
  nickname?: string;
  /**
   * 头像（url地址）
   */
  avatar?: string;
  /**
   * 该用户当前所属角色
   */
  role?: TRole;
  /**
   * 该用户拥有的角色列表
   */
  roles?: TRole[];
  /**
   * 指定的 Token 身份验证规范，可选：Basic、Bearer、Digest、HOBA、Mutual、VAPID、SCRAM、AWS4-HMAC-SHA256 等
   */
  tokenType?: string;
  /**
   * 用于访问的 Token
   */
  accessToken?: string;
  /**
   * 当 AccessToken 失效时，使用该 token 来重新获取 AccessToken。
   */
  refreshToken?: string;
  /**
   * Token 过期时间
   */
  tokenExpirationTime?: number;
}

/**
 * 获取用户类型中的角色类型
 */
export type RoleTypeOfUser<TUser> = TUser extends IUser<infer A> ? A : IRole;
