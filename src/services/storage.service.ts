import 'reflect-metadata';
import { inject, injectable, optional } from 'inversify';
import { getGUID } from '@fatesigner/utils/random';

import { ANTDVX_SYMBOLS } from '../symbols';
import { IStorageService } from '../interfaces/storage.interface';

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

  set(key, data) {
    return window.localStorage.setItem(this.identification + '_' + key, JSON.stringify(data));
  }

  get(key) {
    const str = window.localStorage.getItem(this.identification + '_' + key);
    if (str) {
      try {
        return JSON.parse(window.localStorage.getItem(this.identification + '_' + key));
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  remove(key) {
    window.localStorage.removeItem(this.identification + '_' + key);
  }
}
