/**
 * App 服务实例
 */

import { ANTDVX_SYMBOLS } from 'antdvx/symbols';
import { IStorageService } from 'antdvx/interfaces/storage.interface';
import { IHttpService } from 'antdvx/interfaces/http.interface';
import { IAuthService } from 'antdvx/interfaces/auth.interface';
import { ISessionService } from 'antdvx/interfaces/session.interface';

import { IUser } from '@/types/user';
import { ROLES } from '@/app/constants';
import { RouteMeta } from '@/types/route';

import { appDIC } from './inversify';

export const authService = appDIC.get<IAuthService<IUser<typeof ROLES.keys>, typeof ROLES.keys, RouteMeta<typeof ROLES.keys>>>(ANTDVX_SYMBOLS.AUTH_SERVICE);

export const sessionService = appDIC.get<ISessionService<IUser<typeof ROLES.keys>, typeof ROLES.keys>>(ANTDVX_SYMBOLS.SESSION_SERVICE);

export const localStorageService = appDIC.get<IStorageService>(ANTDVX_SYMBOLS.STORAGE_SERVICE);

export const httpService = appDIC.get<IHttpService>(ANTDVX_SYMBOLS.HTTP_SERVICE);
