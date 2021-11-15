/**
 * App 服务实例
 */

import { ANTDVX_SYMBOLS, IAuthService, IHttpService, ISessionService, IStorageService } from '@/antdvx';

import { IUser } from '@/app/types/user';
import { ROLES } from '@/app/core/constants';
import { RouteMeta } from '@/app/types/route';

import { appDIC } from './inversify';

export const authService = appDIC.get<IAuthService<IUser<typeof ROLES.keys>, typeof ROLES.keys, RouteMeta<typeof ROLES.keys>>>(ANTDVX_SYMBOLS.AUTH_SERVICE);

export const sessionService = appDIC.get<ISessionService<IUser<typeof ROLES.keys>, typeof ROLES.keys>>(ANTDVX_SYMBOLS.SESSION_SERVICE);

export const localStorageService = appDIC.get<IStorageService>(ANTDVX_SYMBOLS.STORAGE_SERVICE);

export const httpService = appDIC.get<IHttpService>(ANTDVX_SYMBOLS.HTTP_SERVICE);
