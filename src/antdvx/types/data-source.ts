/**
 * 定义关于 dataSource 的一些通用类型
 */

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

export enum HttpContentType {
  FormUrlEncoded = 'application/x-www-form-urlencoded;charset=UTF-8',
  FormData = 'multipart/form-data',
  JSON = 'application/json;charset=UTF-8',
  PDF = 'application/pdf'
}

export interface IPaginationParams {
  pageNo: number;
  pageSize: number;
}

export type IDataSourceResponse<TResult = any> = (response: any) => TResult;

export type IDataSourceRequestOptions<TParams extends Record<string, any> = Record<string, any>> = {
  url: string;
  method?: IHttpMethod;
  headers?: any;
  timeout?: number;
  params?: TParams;
  contentType?: HttpContentType;
  dataType?: 'json' | 'jsonp';
};

export type IHttpAdapter = (options: IDataSourceRequestOptions) => Promise<any>;

export type IDatasourceTransportReadMethod<
  TModel extends Record<string, any> = Record<string, any>,
  TParams extends Record<string, any> = Record<string, any>,
  TFilters extends Record<string, any[]> = Record<string, any[]>,
  TSorter extends Record<string, any> = Record<string, any>
> = (
  pagination: IPaginationParams,
  params: TParams,
  filters: TFilters,
  sorter: TSorter,
  model: TModel
) => Promise<{
  data: TModel[];
  total?: number;
}>;

export type IDatasourceTransportPostMethod<
  TModel extends Record<string, any> = Record<string, any>,
  TParams extends Record<string, any> = Record<string, any>
> = (record: TModel, query: IPaginationParams, params: TParams) => Promise<TModel>;

export type IDatasourceTransportPutMethod<
  TModel extends Record<string, any> = Record<string, any>,
  TParams extends Record<string, any> = Record<string, any>
> = (record: TModel, query: IPaginationParams, params: TParams) => Promise<TModel>;

export type IDatasourceTransportDeleteMethod<
  TModel extends Record<string, any> = Record<string, any>,
  TParams extends Record<string, any> = Record<string, any>
> = (record: TModel, query: IPaginationParams, params: TParams) => Promise<TModel>;

export type IDatasourceTransportDownloadExcelMethod<
  TModel extends Record<string, any> = Record<string, any>,
  TParams extends Record<string, any> = Record<string, any>
> = (record: TModel, query: IPaginationParams, params: TParams) => Promise<TModel>;

/**
 * 用于加载和保存数据项的配置，根据数据源检索数据项的方式，数据是远程加载的还是本地加载
 * 远程数据源从远程端点(远程服务、服务器)加载并保存数据项，传输选项描述远程服务配置 URL、HTTP头等
 * 传输选项还可用于实现自定义数据加载和保存
 * 本地数据源通过 data 选项绑定到数组
 */
export interface IDataSourceTransport<
  TModel extends Record<string, any>,
  TParams extends Record<string, any>,
  TFilters extends Record<string, any[]> = Record<string, any[]>,
  TSorter extends Record<string, any> = Record<string, any>
> {
  /**
   * 数据源从远程服务加载数据项时使用的配置
   * 如果指定为字符串，则数据源使用此字符串作为远程服务的 URL 并执行 ajax 请求
   * 如果指定为函数，则数据源调用该函数而不是 ajax
   */
  read: IDatasourceTransportReadMethod<TModel, TParams, TFilters, TSorter>;
  /*getParameterMap?: TGetMap;
  postParameterMap?: TPostMap;
  putParameterMap?: TPutMap;
  deleteParameterMap?: TDeleteMap;
  get?: string | IDataSourceRequestOptions | IDatasourceTransportReadMethod;
  post?: string | IDataSourceRequestOptions | IDatasourceTransportPostMethod;
  put?: string | IDataSourceRequestOptions | IDatasourceTransportPutMethod;
  delete?: string | IDataSourceRequestOptions | IDatasourceTransportDeleteMethod;
  downloadExcel?: string | IDataSourceRequestOptions | IDatasourceTransportDownloadExcelMethod;*/
}

export type IDataSourceTransportAddingMap<TModel extends Record<string, any>, TParams extends Record<string, any>> = () => TModel;

export type IDataSourceTransportEditingMap<TModel extends Record<string, any>, TParams extends Record<string, any>> = (
  row: TModel,
  index: number
) => Record<string, any>;

/**
 * 数据源的分组配置，若设置该值，则数据项将在填充数据源时进行分组；默认情况下，不进行分组
 */
export interface IDataSourceGroup<TModel extends Record<string, any>> {
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
export interface IDataSourceSort<TModel extends Record<string, any>> {
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
export interface IDataSourceSchema<TModel extends Record<string, any>, TParams extends Record<string, any>> {
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

  addingMap?: IDataSourceTransportAddingMap<TModel, TParams>;
  editingMap?: IDataSourceTransportEditingMap<TModel, TParams>;
}

/**
 * 数据源配置
 */
export interface IDataSource<
  TModel extends Record<string, any>,
  TParams extends Record<string, any>,
  TFilters extends Record<string, any[]> = Record<string, any[]>,
  TSorter extends Record<string, any> = Record<string, any>
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
   * 是否执行服务端排序，默认情况下，数据源将执行客户端排序
   */
  serverSorting?: boolean;

  sort?: IDataSourceSort<TModel> | IDataSourceSort<TModel>[];
  group?: IDataSourceGroup<TModel> | IDataSourceGroup<TModel>[];
  schema?: IDataSourceSchema<TModel, TParams>;
  transport?: IDataSourceTransport<TModel, TParams, TFilters, TSorter>;
}
