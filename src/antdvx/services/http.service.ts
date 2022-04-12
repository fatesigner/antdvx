import 'reflect-metadata';
import Qs from 'qs';
import { inject, injectable, optional } from 'inversify';
import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import { IHttpService } from '../types';
import { ANTDVX_SYMBOLS } from '../symbols';

/**
 * Http 服务 config
 */
export interface HttpServiceConfig extends Partial<AxiosRequestConfig> {
  addXMLHttpRequestHeader?: boolean;
  configure?: (defaultAxiosRequestConfig: AxiosRequestConfig, interceptors: AxiosInstance['interceptors']) => void;
}

export enum HttpContentType {
  FormUrlEncoded = 'application/x-www-form-urlencoded;charset=UTF-8',
  FormData = 'multipart/form-data',
  JSON = 'application/json;charset=UTF-8',
  PDF = 'application/pdf'
}

const defaultHttpServiceConfig: HttpServiceConfig = {
  baseURL: '',
  timeout: 20000,
  // 允许携带 cookie
  withCredentials: false,
  responseType: 'json'
};

/**
 * Http 服务
 * 使用 Axios（一个基于 promise 的 HTTP 库，可以在浏览器和 node.js 中使用）
 *
 * 从浏览器中创建 XMLHttpRequests
 * 从 node.js 创建 http 请求
 * 支持 Promise API
 * 拦截请求和响应
 * 转换请求数据和响应数据
 * 取消请求
 * 自动转换 JSON 数据
 * 客户端支持防御 XSRF
 */
@injectable()
export class HttpService implements IHttpService {
  readonly instance: AxiosInstance;

  constructor(@inject(ANTDVX_SYMBOLS.HTTP_SERVICE_CONFIG) @optional() config?: HttpServiceConfig) {
    if (config) {
      config = Object.assign({}, defaultHttpServiceConfig, config);
    } else {
      config = defaultHttpServiceConfig;
    }

    this.instance = Axios.create(config);

    // 更新 Axios default config
    Object.keys(config).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(Axios.defaults, key)) {
        this.instance.defaults[key] = config[key];
      }
    });

    if (config.addXMLHttpRequestHeader) {
      // 为 xhr 请求添加 header 头
      this.instance.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    }

    // 请求拦截: 为 POST 类型的传参序列化
    this.instance.interceptors.request.use(
      function (config) {
        if (config.method !== 'get' && config.method !== 'GET' && config.headers['Content-Type'] === HttpContentType.FormUrlEncoded) {
          config.data = Qs.stringify(config.data);
        }
        return config;
      },
      function (error: Error) {
        return Promise.reject(error);
      }
    );

    // 执行自定义配置
    if (config.configure) {
      config.configure(this.instance.defaults, this.instance.interceptors);
    }
  }

  getUri(config?: AxiosRequestConfig) {
    return this.instance.getUri(config);
  }

  request<T = any, R = AxiosResponse<T>>(config: AxiosRequestConfig): Promise<R> {
    return this.instance.request(config);
  }

  get<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return this.instance.get(url, config);
  }

  delete<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return this.instance.delete(url, config);
  }

  head<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return this.instance.head(url, config);
  }

  options<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return this.instance.options(url, config);
  }

  post<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
    return this.instance.post(url, data, config);
  }

  put<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
    return this.instance.put(url, data, config);
  }

  patch<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
    return this.instance.patch(url, data, config);
  }
}

export function createHttpService(
  config: HttpServiceConfig,
  configure?: (defaultAxiosRequestConfig: AxiosRequestConfig, interceptors: AxiosInstance['interceptors']) => void
): AxiosInstance {
  config = Object.assign({}, defaultHttpServiceConfig, config);

  const Http = Axios.create();

  // 更新 Axios default config
  Object.keys(config).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(Axios.defaults, key)) {
      Http.defaults[key] = config[key];
    }
  });

  if (config.addXMLHttpRequestHeader) {
    // 为 xhr 请求添加 header 头
    Http.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  }

  // 请求拦截: 为 POST 类型的传参序列化
  Http.interceptors.request.use(
    function (config) {
      if (config.method !== 'get' && config.method !== 'GET' && config.headers['Content-Type'] === HttpContentType.FormUrlEncoded) {
        config.data = Qs.stringify(config.data);
      }
      return config;
    },
    function (error: Error) {
      return Promise.reject(error);
    }
  );

  // 执行自定义配置
  if (configure) {
    configure(Http.defaults, Http.interceptors);
  }

  return Http;
}
