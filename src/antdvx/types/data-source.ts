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

export interface IQueryParams {
  pageNo: number;
  pageSize: number;
}

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

export type IDatasourceTransportGetMethod<
  TModel extends Record<string, any> = Record<string, any>,
  TParams extends Record<string, any> = Record<string, any>
> = (query: IQueryParams, params: TParams) => Promise<TModel[]>;

export type IDatasourceTransportPostMethod<
  TModel extends Record<string, any> = Record<string, any>,
  TParams extends Record<string, any> = Record<string, any>
> = (record: TModel, query: IQueryParams, params: TParams) => Promise<TModel>;

export type IDatasourceTransportPutMethod<
  TModel extends Record<string, any> = Record<string, any>,
  TParams extends Record<string, any> = Record<string, any>
> = (record: TModel, query: IQueryParams, params: TParams) => Promise<TModel>;

export type IDatasourceTransportDeleteMethod<
  TModel extends Record<string, any> = Record<string, any>,
  TParams extends Record<string, any> = Record<string, any>
> = (record: TModel, query: IQueryParams, params: TParams) => Promise<TModel>;

export type IDatasourceTransportDownloadExcelMethod<
  TModel extends Record<string, any> = Record<string, any>,
  TParams extends Record<string, any> = Record<string, any>
> = (record: TModel, query: IQueryParams, params: TParams) => Promise<TModel>;

export interface IDataSourceTransport<TModel extends Record<string, any>, TParams extends Record<string, any>> {
  serverPaging?: boolean;
  /*getParameterMap?: TGetMap;
  postParameterMap?: TPostMap;
  putParameterMap?: TPutMap;
  deleteParameterMap?: TDeleteMap;*/
  get?: string | IDataSourceRequestOptions | IDatasourceTransportGetMethod;
  post?: string | IDataSourceRequestOptions | IDatasourceTransportPostMethod;
  put?: string | IDataSourceRequestOptions | IDatasourceTransportPutMethod;
  delete?: string | IDataSourceRequestOptions | IDatasourceTransportDeleteMethod;
  downloadExcel?: string | IDataSourceRequestOptions | IDatasourceTransportDownloadExcelMethod;
}

export type IDataSourceTransportAddingMap<TModel extends Record<string, any>, TParams extends Record<string, any>> = () => TModel;

export type IDataSourceTransportEditingMap<TModel extends Record<string, any>, TParams extends Record<string, any>> = (
  row: TModel,
  index: number
) => Record<string, any>;

export interface IDataSourceSchema<TModel extends Record<string, any>, TParams extends Record<string, any>> {
  addingMap?: IDataSourceTransportAddingMap<TModel, TParams>;
  editingMap?: IDataSourceTransportEditingMap<TModel, TParams>;
  parse?: (response: any) => any;
  data?: (response: any) => any;
  total?: (response: any) => any;
}

export interface IDataSource<TModel extends Record<string, any>, TParams extends Record<string, any>> {
  schema?: IDataSourceSchema<TModel, TParams>;
  transport?: IDataSourceTransport<TModel, TParams>;
}
