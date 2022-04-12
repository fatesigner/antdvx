import 'reflect-metadata';
import { getGUID } from '@fatesigner/utils/random';
import { UnknownKey } from '@fatesigner/utils/types';
import { inject, injectable, optional } from 'inversify';

import { ANTDVX_SYMBOLS } from '../symbols';
import { IStorageService } from '../types';

/**
 * Storage service
 * 客户端持久化缓存服务
 */
@injectable()
export class StorageService implements IStorageService {
  readonly identification: string;

  constructor(@inject(ANTDVX_SYMBOLS.STORAGE_SERVICE_IDENTIFICATION) @optional() identification?: string) {
    this.identification = identification ?? getGUID(7);
  }

  set<T>(key: UnknownKey, data: T) {
    window.localStorage.setItem(this.identification + '_' + key?.toString(), JSON.stringify(data));
    return window.localStorage;
  }

  get<T>(key: UnknownKey): T {
    const str = window.localStorage.getItem(this.identification + '_' + key?.toString());
    if (str) {
      try {
        return JSON.parse(window.localStorage.getItem(this.identification + '_' + key?.toString())) as T;
      } catch (e) {
        return undefined;
      }
    }
    return undefined;
  }

  remove(key: UnknownKey) {
    window.localStorage.removeItem(this.identification + '_' + key?.toString());
    return window.localStorage;
  }
}
