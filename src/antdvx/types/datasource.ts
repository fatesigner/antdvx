/**
 * 定义关于 dataSource 的一些通用类型
 */

import { UnknownType } from '@fatesigner/utils/types';

export type IHttpMethod =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'
  | 'purge'
  | 'PURGE'
  | 'link'
  | 'LINK'
  | 'unlink'
  | 'UNLINK';

export interface IPaginationParams {
  pageNo: number;
  pageSize: number;
}

export type IDataSourceResponse<TResult = unknown> = (response: unknown) => TResult;

export type IDataSourceRequestOptions<TParams extends UnknownType = UnknownType> = {
  url: string;
  method?: IHttpMethod;
  headers?: Record<string, string>;
  timeout?: number;
  params?: TParams;
  contentType?: string;
  dataType?: 'json' | 'jsonp';
};

export type IHttpAdapter<TOptions extends IDataSourceRequestOptions = IDataSourceRequestOptions> = (options: TOptions) => Promise<unknown>;

export type IDatasourceTransportReadMethod<
  TModel extends UnknownType<any> = UnknownType<any>,
  TParams extends UnknownType = never,
  TFilters extends UnknownType<unknown[]> = never,
  TSorter extends object = never
> = (
  pagination: IPaginationParams,
  params: TParams,
  filters: TFilters,
  sorter: TSorter,
  model: TModel,
  action: 'excel' | 'filter' | 'sorter' | 'pagination'
) => Promise<{
  data: TModel[];
  total?: number;
}>;

export type IDatasourceTransportPostMethod<TModel extends UnknownType<any> = UnknownType<any>, TParams extends UnknownType = never> = (
  record: TModel,
  query: IPaginationParams,
  params: TParams
) => Promise<TModel>;

export type IDatasourceTransportPutMethod<TModel extends UnknownType<any> = UnknownType<any>, TParams extends UnknownType = never> = (
  record: TModel,
  query: IPaginationParams,
  params: TParams
) => Promise<TModel>;

export type IDatasourceTransportDeleteMethod<TModel extends UnknownType<any> = UnknownType<any>, TParams extends UnknownType = never> = (
  record: TModel,
  query: IPaginationParams,
  params: TParams
) => Promise<TModel>;

export type IDatasourceTransportDownloadExcelMethod<TModel extends UnknownType<any> = UnknownType<any>, TParams extends UnknownType = never> = (
  record: TModel,
  query: IPaginationParams,
  params: TParams
) => Promise<TModel>;

/**
 * 用于加载和保存数据项的配置，根据数据源检索数据项的方式，数据是远程加载的还是本地加载
 * 远程数据源从远程端点(远程服务、服务器)加载并保存数据项，传输选项描述远程服务配置 URL、HTTP头等
 * 传输选项还可用于实现自定义数据加载和保存
 * 本地数据源通过 data 选项绑定到数组
 */
export interface IDataSourceTransport<
  TModel extends UnknownType<any> = UnknownType<any>,
  TParams extends UnknownType = never,
  TFilters extends UnknownType<unknown[]> = never,
  TSorter extends object = never
> {
  /**
   * 数据源从远程服务加载数据项时使用的配置
   * 如果指定为字符串，则数据源使用此字符串作为远程服务的 URL 并执行 ajax 请求
   * 如果指定为函数，则数据源调用该函数而不是 ajax
   */
  read: IDatasourceTransportReadMethod<TModel, TParams, TFilters, TSorter>;
  /* getParameterMap?: TGetMap;
  postParameterMap?: TPostMap;
  putParameterMap?: TPutMap;
  deleteParameterMap?: TDeleteMap;
  get?: string | IDataSourceRequestOptions | IDatasourceTransportReadMethod;
  post?: string | IDataSourceRequestOptions | IDatasourceTransportPostMethod;
  put?: string | IDataSourceRequestOptions | IDatasourceTransportPutMethod;
  delete?: string | IDataSourceRequestOptions | IDatasourceTransportDeleteMethod;
  downloadExcel?: string | IDataSourceRequestOptions | IDatasourceTransportDownloadExcelMethod; */
}

export type IDataSourceTransportAddingMap<TModel extends UnknownType<any> = UnknownType<any>> = () => TModel;

export type IDataSourceTransportEditingMap<TModel extends UnknownType<any> = UnknownType<any>> = (row: TModel, index: number) => UnknownType;

/**
 * 数据源的分组配置，若设置该值，则数据项将在填充数据源时进行分组；默认情况下，不进行分组
 */
export interface IDataSourceGroup<TModel extends UnknownType<any> = UnknownType<any>> {
  /**
   * 待分组的字段
   */
  field: keyof TModel;
  /**
   * 排序方式，asc（升序），desc（降序），默认为升序
   */
  dir?: 'asc' | 'desc';
  /**
   * 指定分组间排序的函数，与 Array.sort 函数类型一致
   * @param a
   * @param b
   */
  compare?: (a: TModel, b: TModel) => number;
}

/**
 * 数据源的排序配置，设置该值，则数据项将在填充数据源时进行排序；默认情况下，不进行排序
 */
export interface IDataSourceSort<TModel extends UnknownType<any> = UnknownType<any>> {
  /**
   * 待分组的字段
   */
  field: keyof TModel;
  /**
   * 排序方式，asc（升序），desc（降序），默认为升序
   */
  dir?: 'asc' | 'desc';
  /**
   * 指定分组间排序的函数，与 Array.sort 函数类型一致
   * @param a
   * @param b
   */
  compare?: (a: TModel, b: TModel) => number;
}

/**
 * 用于解析远程服务响应的配置
 */
export interface IDataSourceSchema<TModel extends UnknownType<any> = UnknownType<any>> {
  /**
   * 在使用服务器响应之前执行，用来解析或预处理服务器响应
   */
  parse?: IDataSourceResponse;
  /**
   * 指定服务端响应中包含数据项的字段，可以设置为一个函数，该函数将被调用以返回响应的数据项
   * @param response
   */
  data?: string | IDataSourceResponse<TModel[]>;
  /**
   * 指定服务器响应中包含数据项总数的字段，可以设置为一个函数，该函数将被调用以返回响应的数据项总数
   * @param response
   */
  total?: string | IDataSourceResponse<number>;
  /**
   * 指定服务端响应中包含服务器端错误的字段，可以设置为一个函数，该函数将被调用以返回响应的错误
   */
  errors?: string | IDataSourceResponse<string>;

  addingMap?: IDataSourceTransportAddingMap<TModel>;
  editingMap?: IDataSourceTransportEditingMap<TModel>;
}

/**
 * 数据源配置
 */
export interface IDataSource<
  TModel extends UnknownType<any> = UnknownType<any>,
  TParams extends UnknownType = never,
  TFilters extends UnknownType<unknown[]> = never,
  TSorter extends object = never
> {
  /**
   * 数据源包含的数据项的数组
   */
  data?: TModel[];

  /**
   * 显示第几页的数据，除非 serverPaging 选项设置为 true，否则数据源将在客户端进行分页
   */
  pageNo?: number;

  /**
   * 一页显示多少条数据
   */
  pageSize?: number;

  /**
   * 数据总数
   */
  total?: number;

  /**
   * 是否执行服务端分页，默认情况下，数据源将执行客户端分页
   */
  serverPaging?: boolean;

  /**
   * 是否执行服务端过滤，默认情况下，数据源将执行客户端过滤
   */
  serverFiltering?: boolean;

  /**
   * 是否执行服务端排序，默认情况下，数据源将执行客户端排序
   */
  serverSorting?: boolean;

  sort?: IDataSourceSort<TModel> | IDataSourceSort<TModel>[];
  group?: IDataSourceGroup<TModel> | IDataSourceGroup<TModel>[];
  schema?: IDataSourceSchema<TModel>;
  transport?: IDataSourceTransport<TModel, TParams, TFilters, TSorter>;
}
