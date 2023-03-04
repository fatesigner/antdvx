/**
 * types 定义业务类型（基于其他变量，如 constants 中定义的集合产生的 keys type）
 */

import { IAuthService, IRole, IRouteRecordRaw, ISessionService, IUser } from 'antdvx/types';

import { ROLES } from '@/app/core/constants';

// 角色名称 联合类型
export type RoleNamesType = (typeof ROLES.keys)[number];

// 权限 联合类型
export type PermissionType = 'RolesFullAccess' | 'UserInformationFullAccess' | 'RolesFullAccess';

export type RouteRecordRawType = IRouteRecordRaw<RoleNamesType>;

// 角色
export type RoleType = IRole<RoleNamesType, PermissionType>;

// 用户
export interface UserType extends IUser<RoleType> {
  userid?: number | string;
  username: string;
  password?: string;
  RoleName?: string;
  nickname?: string;
  id?: string;
  job?: string;
  phone?: string;
  avatar?: string;
  realname?: string;
  address?: string;
  email?: string;
  isMale?: boolean;
  createTime?: string;
  tokenType?: string;
  accessToken?: string;
  xAccessToken?: string;
  accessTokenFull?: string;
  refreshToken?: string;
  tokenExpirationTime?: number;
}

export type AuthServiceType = IAuthService<UserType>;
export type SessionServiceType = ISessionService<UserType>;
