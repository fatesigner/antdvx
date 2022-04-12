/**
 * user
 */

import { IRole, IUser } from '@/antdvx/types';

export interface IAppUser<TRole extends IRole = IRole> extends IUser<TRole> {
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
