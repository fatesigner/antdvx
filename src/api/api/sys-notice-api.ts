/* tslint:disable */
/* eslint-disable */
/**
 * 全部
 * 全部API
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import globalAxios, { AxiosPromise, AxiosInstance } from 'axios';
import { Configuration } from '../configuration';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from '../common';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from '../base';
// @ts-ignore
import { ChangeStatusNoticeInput } from '../models';
// @ts-ignore
import { NoticeUserStatusInput } from '../models';
// @ts-ignore
import { ResultDataBoolean } from '../models';
// @ts-ignore
import { ResultDataDictionaryStringDictionaryInt32ListSysNoticeReceiveOutput } from '../models';
// @ts-ignore
import { ResultDataIQueryableSysNoticeReceiveOutput } from '../models';
// @ts-ignore
import { ResultDataSysNoticeDetailOutput } from '../models';
// @ts-ignore
import { SysNoticeInput } from '../models';
/**
 * SysNoticeApi - axios parameter creator
 * @export
 */
export const SysNoticeApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary 修改通知公告状态
         * @param {ChangeStatusNoticeInput} [changeStatusNoticeInput] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        noticeChangeStatus: async (changeStatusNoticeInput?: ChangeStatusNoticeInput, options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/Notice/ChangeStatus`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json;odata.metadata=minimal;odata.streaming=true';

            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(changeStatusNoticeInput, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary 删除公告
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        noticeIdDelete: async (id: number, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('noticeIdDelete', 'id', id)
            const localVarPath = `/Notice/{Id}/Delete`
                .replace(`{${"Id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary 当前用户全部消息
         * @param {string} [filter] $filter
         * @param {string} [apply] $apply
         * @param {string} [orderby] $orderby
         * @param {string} [top] $top
         * @param {string} [skip] $skip
         * @param {string} [select] $select
         * @param {string} [expand] $expand
         * @param {string} [count] $count
         * @param {string} [format] $format
         * @param {string} [skiptoken] $skiptoken
         * @param {string} [deltatoken] $deltatoken
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        noticeNoticeList: async (filter?: string, apply?: string, orderby?: string, top?: string, skip?: string, select?: string, expand?: string, count?: string, format?: string, skiptoken?: string, deltatoken?: string, options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/Notice/NoticeList`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)

            if (filter !== undefined) {
                localVarQueryParameter['filter'] = filter;
            }

            if (apply !== undefined) {
                localVarQueryParameter['apply'] = apply;
            }

            if (orderby !== undefined) {
                localVarQueryParameter['orderby'] = orderby;
            }

            if (top !== undefined) {
                localVarQueryParameter['top'] = top;
            }

            if (skip !== undefined) {
                localVarQueryParameter['skip'] = skip;
            }

            if (select !== undefined) {
                localVarQueryParameter['select'] = select;
            }

            if (expand !== undefined) {
                localVarQueryParameter['expand'] = expand;
            }

            if (count !== undefined) {
                localVarQueryParameter['count'] = count;
            }

            if (format !== undefined) {
                localVarQueryParameter['format'] = format;
            }

            if (skiptoken !== undefined) {
                localVarQueryParameter['skiptoken'] = skiptoken;
            }

            if (deltatoken !== undefined) {
                localVarQueryParameter['deltatoken'] = deltatoken;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary 当前用户全部未处理消息
         * @param {NoticeUserStatusInput} [noticeUserStatusInput] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        noticeUnReadNoticeList: async (noticeUserStatusInput?: NoticeUserStatusInput, options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/Notice/UnReadNoticeList`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json;odata.metadata=minimal;odata.streaming=true';

            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(noticeUserStatusInput, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary 增加通知公告
         * @param {SysNoticeInput} [sysNoticeInput] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        noticeadd: async (sysNoticeInput?: SysNoticeInput, options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/Notice/add`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json;odata.metadata=minimal;odata.streaming=true';

            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(sysNoticeInput, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary 获取通知公告详情
         * @param {number} [id] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        noticedetail: async (id?: number, options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/Notice/detail`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)

            if (id !== undefined) {
                localVarQueryParameter['Id'] = id;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * SysNoticeApi - functional programming interface
 * @export
 */
export const SysNoticeApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = SysNoticeApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @summary 修改通知公告状态
         * @param {ChangeStatusNoticeInput} [changeStatusNoticeInput] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async noticeChangeStatus(changeStatusNoticeInput?: ChangeStatusNoticeInput, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ResultDataBoolean>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.noticeChangeStatus(changeStatusNoticeInput, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @summary 删除公告
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async noticeIdDelete(id: number, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ResultDataBoolean>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.noticeIdDelete(id, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @summary 当前用户全部消息
         * @param {string} [filter] $filter
         * @param {string} [apply] $apply
         * @param {string} [orderby] $orderby
         * @param {string} [top] $top
         * @param {string} [skip] $skip
         * @param {string} [select] $select
         * @param {string} [expand] $expand
         * @param {string} [count] $count
         * @param {string} [format] $format
         * @param {string} [skiptoken] $skiptoken
         * @param {string} [deltatoken] $deltatoken
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async noticeNoticeList(filter?: string, apply?: string, orderby?: string, top?: string, skip?: string, select?: string, expand?: string, count?: string, format?: string, skiptoken?: string, deltatoken?: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ResultDataIQueryableSysNoticeReceiveOutput>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.noticeNoticeList(filter, apply, orderby, top, skip, select, expand, count, format, skiptoken, deltatoken, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @summary 当前用户全部未处理消息
         * @param {NoticeUserStatusInput} [noticeUserStatusInput] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async noticeUnReadNoticeList(noticeUserStatusInput?: NoticeUserStatusInput, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ResultDataDictionaryStringDictionaryInt32ListSysNoticeReceiveOutput>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.noticeUnReadNoticeList(noticeUserStatusInput, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @summary 增加通知公告
         * @param {SysNoticeInput} [sysNoticeInput] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async noticeadd(sysNoticeInput?: SysNoticeInput, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ResultDataBoolean>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.noticeadd(sysNoticeInput, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @summary 获取通知公告详情
         * @param {number} [id] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async noticedetail(id?: number, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ResultDataSysNoticeDetailOutput>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.noticedetail(id, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * SysNoticeApi - factory interface
 * @export
 */
export const SysNoticeApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = SysNoticeApiFp(configuration)
    return {
        /**
         * 
         * @summary 修改通知公告状态
         * @param {ChangeStatusNoticeInput} [changeStatusNoticeInput] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        noticeChangeStatus(changeStatusNoticeInput?: ChangeStatusNoticeInput, options?: any): AxiosPromise<ResultDataBoolean> {
            return localVarFp.noticeChangeStatus(changeStatusNoticeInput, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary 删除公告
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        noticeIdDelete(id: number, options?: any): AxiosPromise<ResultDataBoolean> {
            return localVarFp.noticeIdDelete(id, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary 当前用户全部消息
         * @param {string} [filter] $filter
         * @param {string} [apply] $apply
         * @param {string} [orderby] $orderby
         * @param {string} [top] $top
         * @param {string} [skip] $skip
         * @param {string} [select] $select
         * @param {string} [expand] $expand
         * @param {string} [count] $count
         * @param {string} [format] $format
         * @param {string} [skiptoken] $skiptoken
         * @param {string} [deltatoken] $deltatoken
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        noticeNoticeList(filter?: string, apply?: string, orderby?: string, top?: string, skip?: string, select?: string, expand?: string, count?: string, format?: string, skiptoken?: string, deltatoken?: string, options?: any): AxiosPromise<ResultDataIQueryableSysNoticeReceiveOutput> {
            return localVarFp.noticeNoticeList(filter, apply, orderby, top, skip, select, expand, count, format, skiptoken, deltatoken, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary 当前用户全部未处理消息
         * @param {NoticeUserStatusInput} [noticeUserStatusInput] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        noticeUnReadNoticeList(noticeUserStatusInput?: NoticeUserStatusInput, options?: any): AxiosPromise<ResultDataDictionaryStringDictionaryInt32ListSysNoticeReceiveOutput> {
            return localVarFp.noticeUnReadNoticeList(noticeUserStatusInput, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary 增加通知公告
         * @param {SysNoticeInput} [sysNoticeInput] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        noticeadd(sysNoticeInput?: SysNoticeInput, options?: any): AxiosPromise<ResultDataBoolean> {
            return localVarFp.noticeadd(sysNoticeInput, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary 获取通知公告详情
         * @param {number} [id] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        noticedetail(id?: number, options?: any): AxiosPromise<ResultDataSysNoticeDetailOutput> {
            return localVarFp.noticedetail(id, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * Request parameters for noticeChangeStatus operation in SysNoticeApi.
 * @export
 * @interface SysNoticeApiNoticeChangeStatusRequest
 */
export interface SysNoticeApiNoticeChangeStatusRequest {
    /**
     * 
     * @type {ChangeStatusNoticeInput}
     * @memberof SysNoticeApiNoticeChangeStatus
     */
    readonly changeStatusNoticeInput?: ChangeStatusNoticeInput
}

/**
 * Request parameters for noticeIdDelete operation in SysNoticeApi.
 * @export
 * @interface SysNoticeApiNoticeIdDeleteRequest
 */
export interface SysNoticeApiNoticeIdDeleteRequest {
    /**
     * 
     * @type {number}
     * @memberof SysNoticeApiNoticeIdDelete
     */
    readonly id: number
}

/**
 * Request parameters for noticeNoticeList operation in SysNoticeApi.
 * @export
 * @interface SysNoticeApiNoticeNoticeListRequest
 */
export interface SysNoticeApiNoticeNoticeListRequest {
    /**
     * $filter
     * @type {string}
     * @memberof SysNoticeApiNoticeNoticeList
     */
    readonly filter?: string

    /**
     * $apply
     * @type {string}
     * @memberof SysNoticeApiNoticeNoticeList
     */
    readonly apply?: string

    /**
     * $orderby
     * @type {string}
     * @memberof SysNoticeApiNoticeNoticeList
     */
    readonly orderby?: string

    /**
     * $top
     * @type {string}
     * @memberof SysNoticeApiNoticeNoticeList
     */
    readonly top?: string

    /**
     * $skip
     * @type {string}
     * @memberof SysNoticeApiNoticeNoticeList
     */
    readonly skip?: string

    /**
     * $select
     * @type {string}
     * @memberof SysNoticeApiNoticeNoticeList
     */
    readonly select?: string

    /**
     * $expand
     * @type {string}
     * @memberof SysNoticeApiNoticeNoticeList
     */
    readonly expand?: string

    /**
     * $count
     * @type {string}
     * @memberof SysNoticeApiNoticeNoticeList
     */
    readonly count?: string

    /**
     * $format
     * @type {string}
     * @memberof SysNoticeApiNoticeNoticeList
     */
    readonly format?: string

    /**
     * $skiptoken
     * @type {string}
     * @memberof SysNoticeApiNoticeNoticeList
     */
    readonly skiptoken?: string

    /**
     * $deltatoken
     * @type {string}
     * @memberof SysNoticeApiNoticeNoticeList
     */
    readonly deltatoken?: string
}

/**
 * Request parameters for noticeUnReadNoticeList operation in SysNoticeApi.
 * @export
 * @interface SysNoticeApiNoticeUnReadNoticeListRequest
 */
export interface SysNoticeApiNoticeUnReadNoticeListRequest {
    /**
     * 
     * @type {NoticeUserStatusInput}
     * @memberof SysNoticeApiNoticeUnReadNoticeList
     */
    readonly noticeUserStatusInput?: NoticeUserStatusInput
}

/**
 * Request parameters for noticeadd operation in SysNoticeApi.
 * @export
 * @interface SysNoticeApiNoticeaddRequest
 */
export interface SysNoticeApiNoticeaddRequest {
    /**
     * 
     * @type {SysNoticeInput}
     * @memberof SysNoticeApiNoticeadd
     */
    readonly sysNoticeInput?: SysNoticeInput
}

/**
 * Request parameters for noticedetail operation in SysNoticeApi.
 * @export
 * @interface SysNoticeApiNoticedetailRequest
 */
export interface SysNoticeApiNoticedetailRequest {
    /**
     * 
     * @type {number}
     * @memberof SysNoticeApiNoticedetail
     */
    readonly id?: number
}

/**
 * SysNoticeApi - object-oriented interface
 * @export
 * @class SysNoticeApi
 * @extends {BaseAPI}
 */
export class SysNoticeApi extends BaseAPI {
    /**
     * 
     * @summary 修改通知公告状态
     * @param {SysNoticeApiNoticeChangeStatusRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SysNoticeApi
     */
    public noticeChangeStatus(requestParameters: SysNoticeApiNoticeChangeStatusRequest = {}, options?: any) {
        return SysNoticeApiFp(this.configuration).noticeChangeStatus(requestParameters.changeStatusNoticeInput, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary 删除公告
     * @param {SysNoticeApiNoticeIdDeleteRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SysNoticeApi
     */
    public noticeIdDelete(requestParameters: SysNoticeApiNoticeIdDeleteRequest, options?: any) {
        return SysNoticeApiFp(this.configuration).noticeIdDelete(requestParameters.id, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary 当前用户全部消息
     * @param {SysNoticeApiNoticeNoticeListRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SysNoticeApi
     */
    public noticeNoticeList(requestParameters: SysNoticeApiNoticeNoticeListRequest = {}, options?: any) {
        return SysNoticeApiFp(this.configuration).noticeNoticeList(requestParameters.filter, requestParameters.apply, requestParameters.orderby, requestParameters.top, requestParameters.skip, requestParameters.select, requestParameters.expand, requestParameters.count, requestParameters.format, requestParameters.skiptoken, requestParameters.deltatoken, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary 当前用户全部未处理消息
     * @param {SysNoticeApiNoticeUnReadNoticeListRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SysNoticeApi
     */
    public noticeUnReadNoticeList(requestParameters: SysNoticeApiNoticeUnReadNoticeListRequest = {}, options?: any) {
        return SysNoticeApiFp(this.configuration).noticeUnReadNoticeList(requestParameters.noticeUserStatusInput, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary 增加通知公告
     * @param {SysNoticeApiNoticeaddRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SysNoticeApi
     */
    public noticeadd(requestParameters: SysNoticeApiNoticeaddRequest = {}, options?: any) {
        return SysNoticeApiFp(this.configuration).noticeadd(requestParameters.sysNoticeInput, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary 获取通知公告详情
     * @param {SysNoticeApiNoticedetailRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SysNoticeApi
     */
    public noticedetail(requestParameters: SysNoticeApiNoticedetailRequest = {}, options?: any) {
        return SysNoticeApiFp(this.configuration).noticedetail(requestParameters.id, options).then((request) => request(this.axios, this.basePath));
    }
}
