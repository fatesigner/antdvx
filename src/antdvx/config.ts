/**
 * Antdv config
 */

import { IHttpAdapter } from './types/data-source';

export let AntdHttpAdapter: IHttpAdapter = null;

export function setRequestAdapter(adapter: IHttpAdapter) {
  AntdHttpAdapter = adapter;
}
