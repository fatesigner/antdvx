import { UnknownKey } from '@fatesigner/utils/types';

/**
 * Storage interface
 * 客户端持久化缓存服务接口
 */
export interface IStorageService {
  readonly identification: UnknownKey;
  get: (key: UnknownKey) => unknown;
  set: (key: UnknownKey, data: unknown) => Storage;
  remove: (key: UnknownKey) => Storage;
}
