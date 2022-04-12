/**
 * Antdv config
 */

import { IDataSourceRequestOptions, IHttpAdapter, IStorageService } from './types';

export let AntdHttpAdapter: IHttpAdapter<any>;
export let AntdStorageService: IStorageService;

/**
 * 配置 http request 适配器
 * @param adapter
 */
export function setRequestAdapter<TOptions extends IDataSourceRequestOptions = IDataSourceRequestOptions>(adapter: IHttpAdapter<TOptions>) {
  AntdHttpAdapter = adapter;
}

/**
 * 配置 local storage（本地存储）适配器
 * @param storageService
 */
export function setStorageService(storageService: IStorageService) {
  AntdStorageService = storageService;
}
