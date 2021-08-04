/**
 * user
 */

import { IMenu } from './menu';

export interface IUser<TRole extends readonly string[]> {
  userid?: string;
  username: string;
  password?: string;
  nickname?: string;
  id?: string;
  job?: string;
  phone?: string;
  // 用户拥有的角色 可以有多个
  roles?: TRole[number][];
  avatar?: string;
  realname?: string;
  // 用户可用的菜单
  menus?: IMenu[];
  address?: string;
  email?: string;
  isMale?: boolean;
  createTime?: string;
  // 用户可访问的链接
  permissions: string[];
  tokenType?: string;
  accessToken?: string;
  accessTokenFull?: string;
  refreshToken?: string;
  tokenExpirationTime?: number;
}
