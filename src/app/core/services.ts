/**
 * App 服务实例
 */

import { ANTDVX_SYMBOLS } from '@/antdvx';
import { IHttpService, IStorageService } from '@/antdvx/types';

import { AuthServiceType, SessionServiceType, appDIC } from './inversify';

export const authService = appDIC.get<AuthServiceType>(ANTDVX_SYMBOLS.AUTH_SERVICE);

export const sessionService = appDIC.get<SessionServiceType>(ANTDVX_SYMBOLS.SESSION_SERVICE);

export const localStorageService = appDIC.get<IStorageService>(ANTDVX_SYMBOLS.STORAGE_SERVICE);

export const httpService = appDIC.get<IHttpService>(ANTDVX_SYMBOLS.HTTP_SERVICE);
