/**
 * Storage interface
 * 客户端持久化缓存服务接口
 */
export interface IStorageService {
  readonly identification: string;
  set: (key, data) => void;
  get: (key) => any;
  remove: (key) => void;
}
