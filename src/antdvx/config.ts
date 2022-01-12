/**
 * Antdv config
 */

import { IStorageService } from './interfaces';
import { IHttpAdapter } from './types/data-source';

export let AntdHttpAdapter: IHttpAdapter = null;
export let AntdStorageService: IStorageService = null;

/**
 * 配置 http request 适配器
 * @param adapter
 */
export function setRequestAdapter(adapter: IHttpAdapter) {
  AntdHttpAdapter = adapter;
}

/**
 * 配置 local storage（本地存储）适配器
 * @param storageService
 */
export function setStorageService(storageService: IStorageService) {
  AntdStorageService = storageService;
}
