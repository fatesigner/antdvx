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
import { ConnectionIdInput } from '../models';
// @ts-ignore
import { ResultDataBoolean } from '../models';
// @ts-ignore
import { ResultDataIQueryableOnlineUserOutput } from '../models';
// @ts-ignore
import { ResultDataListOnlineUserOutput } from '../models';
/**
 * SysOnlineUserApi - axios parameter creator
 * @export
 */
export const SysOnlineUserApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary 获取在线用户信息
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
        systemOnlineUserall: async (filter?: string, apply?: string, orderby?: string, top?: string, skip?: string, select?: string, expand?: string, count?: string, format?: string, skiptoken?: string, deltatoken?: string, options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/System/OnlineUser/all`;
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
         * @summary 强制下线
         * @param {ConnectionIdInput} [connectionIdInput] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        systemOnlineUserforceExist: async (connectionIdInput?: ConnectionIdInput, options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/System/OnlineUser/forceExist`;
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


    
            localVarHeaderParameter['Content-Type'] = 'application/json;odata.metadata=minimal;odata.streaming=true';

            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(connectionIdInput, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary 获取在线用户信息
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        systemOnlineUserlist: async (options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/System/OnlineUser/list`;
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
 * SysOnlineUserApi - functional programming interface
 * @export
 */
export const SysOnlineUserApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = SysOnlineUserApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @summary 获取在线用户信息
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
        async systemOnlineUserall(filter?: string, apply?: string, orderby?: string, top?: string, skip?: string, select?: string, expand?: string, count?: string, format?: string, skiptoken?: string, deltatoken?: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ResultDataIQueryableOnlineUserOutput>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.systemOnlineUserall(filter, apply, orderby, top, skip, select, expand, count, format, skiptoken, deltatoken, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @summary 强制下线
         * @param {ConnectionIdInput} [connectionIdInput] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async systemOnlineUserforceExist(connectionIdInput?: ConnectionIdInput, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ResultDataBoolean>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.systemOnlineUserforceExist(connectionIdInput, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @summary 获取在线用户信息
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async systemOnlineUserlist(options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ResultDataListOnlineUserOutput>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.systemOnlineUserlist(options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * SysOnlineUserApi - factory interface
 * @export
 */
export const SysOnlineUserApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = SysOnlineUserApiFp(configuration)
    return {
        /**
         * 
         * @summary 获取在线用户信息
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
        systemOnlineUserall(filter?: string, apply?: string, orderby?: string, top?: string, skip?: string, select?: string, expand?: string, count?: string, format?: string, skiptoken?: string, deltatoken?: string, options?: any): AxiosPromise<ResultDataIQueryableOnlineUserOutput> {
            return localVarFp.systemOnlineUserall(filter, apply, orderby, top, skip, select, expand, count, format, skiptoken, deltatoken, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary 强制下线
         * @param {ConnectionIdInput} [connectionIdInput] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        systemOnlineUserforceExist(connectionIdInput?: ConnectionIdInput, options?: any): AxiosPromise<ResultDataBoolean> {
            return localVarFp.systemOnlineUserforceExist(connectionIdInput, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary 获取在线用户信息
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        systemOnlineUserlist(options?: any): AxiosPromise<ResultDataListOnlineUserOutput> {
            return localVarFp.systemOnlineUserlist(options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * Request parameters for systemOnlineUserall operation in SysOnlineUserApi.
 * @export
 * @interface SysOnlineUserApiSystemOnlineUserallRequest
 */
export interface SysOnlineUserApiSystemOnlineUserallRequest {
    /**
     * $filter
     * @type {string}
     * @memberof SysOnlineUserApiSystemOnlineUserall
     */
    readonly filter?: string

    /**
     * $apply
     * @type {string}
     * @memberof SysOnlineUserApiSystemOnlineUserall
     */
    readonly apply?: string

    /**
     * $orderby
     * @type {string}
     * @memberof SysOnlineUserApiSystemOnlineUserall
     */
    readonly orderby?: string

    /**
     * $top
     * @type {string}
     * @memberof SysOnlineUserApiSystemOnlineUserall
     */
    readonly top?: string

    /**
     * $skip
     * @type {string}
     * @memberof SysOnlineUserApiSystemOnlineUserall
     */
    readonly skip?: string

    /**
     * $select
     * @type {string}
     * @memberof SysOnlineUserApiSystemOnlineUserall
     */
    readonly select?: string

    /**
     * $expand
     * @type {string}
     * @memberof SysOnlineUserApiSystemOnlineUserall
     */
    readonly expand?: string

    /**
     * $count
     * @type {string}
     * @memberof SysOnlineUserApiSystemOnlineUserall
     */
    readonly count?: string

    /**
     * $format
     * @type {string}
     * @memberof SysOnlineUserApiSystemOnlineUserall
     */
    readonly format?: string

    /**
     * $skiptoken
     * @type {string}
     * @memberof SysOnlineUserApiSystemOnlineUserall
     */
    readonly skiptoken?: string

    /**
     * $deltatoken
     * @type {string}
     * @memberof SysOnlineUserApiSystemOnlineUserall
     */
    readonly deltatoken?: string
}

/**
 * Request parameters for systemOnlineUserforceExist operation in SysOnlineUserApi.
 * @export
 * @interface SysOnlineUserApiSystemOnlineUserforceExistRequest
 */
export interface SysOnlineUserApiSystemOnlineUserforceExistRequest {
    /**
     * 
     * @type {ConnectionIdInput}
     * @memberof SysOnlineUserApiSystemOnlineUserforceExist
     */
    readonly connectionIdInput?: ConnectionIdInput
}

/**
 * SysOnlineUserApi - object-oriented interface
 * @export
 * @class SysOnlineUserApi
 * @extends {BaseAPI}
 */
export class SysOnlineUserApi extends BaseAPI {
    /**
     * 
     * @summary 获取在线用户信息
     * @param {SysOnlineUserApiSystemOnlineUserallRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SysOnlineUserApi
     */
    public systemOnlineUserall(requestParameters: SysOnlineUserApiSystemOnlineUserallRequest = {}, options?: any) {
        return SysOnlineUserApiFp(this.configuration).systemOnlineUserall(requestParameters.filter, requestParameters.apply, requestParameters.orderby, requestParameters.top, requestParameters.skip, requestParameters.select, requestParameters.expand, requestParameters.count, requestParameters.format, requestParameters.skiptoken, requestParameters.deltatoken, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary 强制下线
     * @param {SysOnlineUserApiSystemOnlineUserforceExistRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SysOnlineUserApi
     */
    public systemOnlineUserforceExist(requestParameters: SysOnlineUserApiSystemOnlineUserforceExistRequest = {}, options?: any) {
        return SysOnlineUserApiFp(this.configuration).systemOnlineUserforceExist(requestParameters.connectionIdInput, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary 获取在线用户信息
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SysOnlineUserApi
     */
    public systemOnlineUserlist(options?: any) {
        return SysOnlineUserApiFp(this.configuration).systemOnlineUserlist(options).then((request) => request(this.axios, this.basePath));
    }
}
