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
import { ExLogPageInput } from '../models';
// @ts-ignore
import { OpLogPageInput } from '../models';
// @ts-ignore
import { ResultDataIQueryableSysLogEx } from '../models';
// @ts-ignore
import { ResultDataIQueryableSysLogOp } from '../models';
// @ts-ignore
import { ResultDataIQueryableSysLogVis } from '../models';
// @ts-ignore
import { ResultDataPageResultExLogOutput } from '../models';
// @ts-ignore
import { ResultDataPageResultOpLogOutput } from '../models';
// @ts-ignore
import { ResultDataPageResultVisLogOutput } from '../models';
// @ts-ignore
import { VisLogPageInput } from '../models';
/**
 * LogApi - axios parameter creator
 * @export
 */
export const LogApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Odata全部异常日志
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
        logGetExList: async (filter?: string, apply?: string, orderby?: string, top?: string, skip?: string, select?: string, expand?: string, count?: string, format?: string, skiptoken?: string, deltatoken?: string, options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/Log/GetExList`;
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
         * @summary 数据库异常日志分页
         * @param {ExLogPageInput} [exLogPageInput] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        logGetExPage: async (exLogPageInput?: ExLogPageInput, options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/Log/GetExPage`;
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
            localVarRequestOptions.data = serializeDataIfNeeded(exLogPageInput, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Odata请求日志
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
        logGetOpList: async (filter?: string, apply?: string, orderby?: string, top?: string, skip?: string, select?: string, expand?: string, count?: string, format?: string, skiptoken?: string, deltatoken?: string, options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/Log/GetOpList`;
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
         * @summary 请求日志分页
         * @param {OpLogPageInput} [opLogPageInput] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        logGetOpPage: async (opLogPageInput?: OpLogPageInput, options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/Log/GetOpPage`;
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
            localVarRequestOptions.data = serializeDataIfNeeded(opLogPageInput, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary 全部登录日志
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
        logGetVisList: async (filter?: string, apply?: string, orderby?: string, top?: string, skip?: string, select?: string, expand?: string, count?: string, format?: string, skiptoken?: string, deltatoken?: string, options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/Log/GetVisList`;
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
         * @summary 登录日志分页
         * @param {VisLogPageInput} [visLogPageInput] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        logGetVisPage: async (visLogPageInput?: VisLogPageInput, options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/Log/GetVisPage`;
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
            localVarRequestOptions.data = serializeDataIfNeeded(visLogPageInput, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * LogApi - functional programming interface
 * @export
 */
export const LogApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = LogApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @summary Odata全部异常日志
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
        async logGetExList(filter?: string, apply?: string, orderby?: string, top?: string, skip?: string, select?: string, expand?: string, count?: string, format?: string, skiptoken?: string, deltatoken?: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ResultDataIQueryableSysLogEx>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.logGetExList(filter, apply, orderby, top, skip, select, expand, count, format, skiptoken, deltatoken, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @summary 数据库异常日志分页
         * @param {ExLogPageInput} [exLogPageInput] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async logGetExPage(exLogPageInput?: ExLogPageInput, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ResultDataPageResultExLogOutput>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.logGetExPage(exLogPageInput, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @summary Odata请求日志
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
        async logGetOpList(filter?: string, apply?: string, orderby?: string, top?: string, skip?: string, select?: string, expand?: string, count?: string, format?: string, skiptoken?: string, deltatoken?: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ResultDataIQueryableSysLogOp>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.logGetOpList(filter, apply, orderby, top, skip, select, expand, count, format, skiptoken, deltatoken, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @summary 请求日志分页
         * @param {OpLogPageInput} [opLogPageInput] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async logGetOpPage(opLogPageInput?: OpLogPageInput, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ResultDataPageResultOpLogOutput>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.logGetOpPage(opLogPageInput, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @summary 全部登录日志
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
        async logGetVisList(filter?: string, apply?: string, orderby?: string, top?: string, skip?: string, select?: string, expand?: string, count?: string, format?: string, skiptoken?: string, deltatoken?: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ResultDataIQueryableSysLogVis>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.logGetVisList(filter, apply, orderby, top, skip, select, expand, count, format, skiptoken, deltatoken, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @summary 登录日志分页
         * @param {VisLogPageInput} [visLogPageInput] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async logGetVisPage(visLogPageInput?: VisLogPageInput, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ResultDataPageResultVisLogOutput>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.logGetVisPage(visLogPageInput, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * LogApi - factory interface
 * @export
 */
export const LogApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = LogApiFp(configuration)
    return {
        /**
         * 
         * @summary Odata全部异常日志
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
        logGetExList(filter?: string, apply?: string, orderby?: string, top?: string, skip?: string, select?: string, expand?: string, count?: string, format?: string, skiptoken?: string, deltatoken?: string, options?: any): AxiosPromise<ResultDataIQueryableSysLogEx> {
            return localVarFp.logGetExList(filter, apply, orderby, top, skip, select, expand, count, format, skiptoken, deltatoken, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary 数据库异常日志分页
         * @param {ExLogPageInput} [exLogPageInput] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        logGetExPage(exLogPageInput?: ExLogPageInput, options?: any): AxiosPromise<ResultDataPageResultExLogOutput> {
            return localVarFp.logGetExPage(exLogPageInput, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Odata请求日志
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
        logGetOpList(filter?: string, apply?: string, orderby?: string, top?: string, skip?: string, select?: string, expand?: string, count?: string, format?: string, skiptoken?: string, deltatoken?: string, options?: any): AxiosPromise<ResultDataIQueryableSysLogOp> {
            return localVarFp.logGetOpList(filter, apply, orderby, top, skip, select, expand, count, format, skiptoken, deltatoken, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary 请求日志分页
         * @param {OpLogPageInput} [opLogPageInput] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        logGetOpPage(opLogPageInput?: OpLogPageInput, options?: any): AxiosPromise<ResultDataPageResultOpLogOutput> {
            return localVarFp.logGetOpPage(opLogPageInput, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary 全部登录日志
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
        logGetVisList(filter?: string, apply?: string, orderby?: string, top?: string, skip?: string, select?: string, expand?: string, count?: string, format?: string, skiptoken?: string, deltatoken?: string, options?: any): AxiosPromise<ResultDataIQueryableSysLogVis> {
            return localVarFp.logGetVisList(filter, apply, orderby, top, skip, select, expand, count, format, skiptoken, deltatoken, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary 登录日志分页
         * @param {VisLogPageInput} [visLogPageInput] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        logGetVisPage(visLogPageInput?: VisLogPageInput, options?: any): AxiosPromise<ResultDataPageResultVisLogOutput> {
            return localVarFp.logGetVisPage(visLogPageInput, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * Request parameters for logGetExList operation in LogApi.
 * @export
 * @interface LogApiLogGetExListRequest
 */
export interface LogApiLogGetExListRequest {
    /**
     * $filter
     * @type {string}
     * @memberof LogApiLogGetExList
     */
    readonly filter?: string

    /**
     * $apply
     * @type {string}
     * @memberof LogApiLogGetExList
     */
    readonly apply?: string

    /**
     * $orderby
     * @type {string}
     * @memberof LogApiLogGetExList
     */
    readonly orderby?: string

    /**
     * $top
     * @type {string}
     * @memberof LogApiLogGetExList
     */
    readonly top?: string

    /**
     * $skip
     * @type {string}
     * @memberof LogApiLogGetExList
     */
    readonly skip?: string

    /**
     * $select
     * @type {string}
     * @memberof LogApiLogGetExList
     */
    readonly select?: string

    /**
     * $expand
     * @type {string}
     * @memberof LogApiLogGetExList
     */
    readonly expand?: string

    /**
     * $count
     * @type {string}
     * @memberof LogApiLogGetExList
     */
    readonly count?: string

    /**
     * $format
     * @type {string}
     * @memberof LogApiLogGetExList
     */
    readonly format?: string

    /**
     * $skiptoken
     * @type {string}
     * @memberof LogApiLogGetExList
     */
    readonly skiptoken?: string

    /**
     * $deltatoken
     * @type {string}
     * @memberof LogApiLogGetExList
     */
    readonly deltatoken?: string
}

/**
 * Request parameters for logGetExPage operation in LogApi.
 * @export
 * @interface LogApiLogGetExPageRequest
 */
export interface LogApiLogGetExPageRequest {
    /**
     * 
     * @type {ExLogPageInput}
     * @memberof LogApiLogGetExPage
     */
    readonly exLogPageInput?: ExLogPageInput
}

/**
 * Request parameters for logGetOpList operation in LogApi.
 * @export
 * @interface LogApiLogGetOpListRequest
 */
export interface LogApiLogGetOpListRequest {
    /**
     * $filter
     * @type {string}
     * @memberof LogApiLogGetOpList
     */
    readonly filter?: string

    /**
     * $apply
     * @type {string}
     * @memberof LogApiLogGetOpList
     */
    readonly apply?: string

    /**
     * $orderby
     * @type {string}
     * @memberof LogApiLogGetOpList
     */
    readonly orderby?: string

    /**
     * $top
     * @type {string}
     * @memberof LogApiLogGetOpList
     */
    readonly top?: string

    /**
     * $skip
     * @type {string}
     * @memberof LogApiLogGetOpList
     */
    readonly skip?: string

    /**
     * $select
     * @type {string}
     * @memberof LogApiLogGetOpList
     */
    readonly select?: string

    /**
     * $expand
     * @type {string}
     * @memberof LogApiLogGetOpList
     */
    readonly expand?: string

    /**
     * $count
     * @type {string}
     * @memberof LogApiLogGetOpList
     */
    readonly count?: string

    /**
     * $format
     * @type {string}
     * @memberof LogApiLogGetOpList
     */
    readonly format?: string

    /**
     * $skiptoken
     * @type {string}
     * @memberof LogApiLogGetOpList
     */
    readonly skiptoken?: string

    /**
     * $deltatoken
     * @type {string}
     * @memberof LogApiLogGetOpList
     */
    readonly deltatoken?: string
}

/**
 * Request parameters for logGetOpPage operation in LogApi.
 * @export
 * @interface LogApiLogGetOpPageRequest
 */
export interface LogApiLogGetOpPageRequest {
    /**
     * 
     * @type {OpLogPageInput}
     * @memberof LogApiLogGetOpPage
     */
    readonly opLogPageInput?: OpLogPageInput
}

/**
 * Request parameters for logGetVisList operation in LogApi.
 * @export
 * @interface LogApiLogGetVisListRequest
 */
export interface LogApiLogGetVisListRequest {
    /**
     * $filter
     * @type {string}
     * @memberof LogApiLogGetVisList
     */
    readonly filter?: string

    /**
     * $apply
     * @type {string}
     * @memberof LogApiLogGetVisList
     */
    readonly apply?: string

    /**
     * $orderby
     * @type {string}
     * @memberof LogApiLogGetVisList
     */
    readonly orderby?: string

    /**
     * $top
     * @type {string}
     * @memberof LogApiLogGetVisList
     */
    readonly top?: string

    /**
     * $skip
     * @type {string}
     * @memberof LogApiLogGetVisList
     */
    readonly skip?: string

    /**
     * $select
     * @type {string}
     * @memberof LogApiLogGetVisList
     */
    readonly select?: string

    /**
     * $expand
     * @type {string}
     * @memberof LogApiLogGetVisList
     */
    readonly expand?: string

    /**
     * $count
     * @type {string}
     * @memberof LogApiLogGetVisList
     */
    readonly count?: string

    /**
     * $format
     * @type {string}
     * @memberof LogApiLogGetVisList
     */
    readonly format?: string

    /**
     * $skiptoken
     * @type {string}
     * @memberof LogApiLogGetVisList
     */
    readonly skiptoken?: string

    /**
     * $deltatoken
     * @type {string}
     * @memberof LogApiLogGetVisList
     */
    readonly deltatoken?: string
}

/**
 * Request parameters for logGetVisPage operation in LogApi.
 * @export
 * @interface LogApiLogGetVisPageRequest
 */
export interface LogApiLogGetVisPageRequest {
    /**
     * 
     * @type {VisLogPageInput}
     * @memberof LogApiLogGetVisPage
     */
    readonly visLogPageInput?: VisLogPageInput
}

/**
 * LogApi - object-oriented interface
 * @export
 * @class LogApi
 * @extends {BaseAPI}
 */
export class LogApi extends BaseAPI {
    /**
     * 
     * @summary Odata全部异常日志
     * @param {LogApiLogGetExListRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof LogApi
     */
    public logGetExList(requestParameters: LogApiLogGetExListRequest = {}, options?: any) {
        return LogApiFp(this.configuration).logGetExList(requestParameters.filter, requestParameters.apply, requestParameters.orderby, requestParameters.top, requestParameters.skip, requestParameters.select, requestParameters.expand, requestParameters.count, requestParameters.format, requestParameters.skiptoken, requestParameters.deltatoken, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary 数据库异常日志分页
     * @param {LogApiLogGetExPageRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof LogApi
     */
    public logGetExPage(requestParameters: LogApiLogGetExPageRequest = {}, options?: any) {
        return LogApiFp(this.configuration).logGetExPage(requestParameters.exLogPageInput, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Odata请求日志
     * @param {LogApiLogGetOpListRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof LogApi
     */
    public logGetOpList(requestParameters: LogApiLogGetOpListRequest = {}, options?: any) {
        return LogApiFp(this.configuration).logGetOpList(requestParameters.filter, requestParameters.apply, requestParameters.orderby, requestParameters.top, requestParameters.skip, requestParameters.select, requestParameters.expand, requestParameters.count, requestParameters.format, requestParameters.skiptoken, requestParameters.deltatoken, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary 请求日志分页
     * @param {LogApiLogGetOpPageRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof LogApi
     */
    public logGetOpPage(requestParameters: LogApiLogGetOpPageRequest = {}, options?: any) {
        return LogApiFp(this.configuration).logGetOpPage(requestParameters.opLogPageInput, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary 全部登录日志
     * @param {LogApiLogGetVisListRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof LogApi
     */
    public logGetVisList(requestParameters: LogApiLogGetVisListRequest = {}, options?: any) {
        return LogApiFp(this.configuration).logGetVisList(requestParameters.filter, requestParameters.apply, requestParameters.orderby, requestParameters.top, requestParameters.skip, requestParameters.select, requestParameters.expand, requestParameters.count, requestParameters.format, requestParameters.skiptoken, requestParameters.deltatoken, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary 登录日志分页
     * @param {LogApiLogGetVisPageRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof LogApi
     */
    public logGetVisPage(requestParameters: LogApiLogGetVisPageRequest = {}, options?: any) {
        return LogApiFp(this.configuration).logGetVisPage(requestParameters.visLogPageInput, options).then((request) => request(this.axios, this.basePath));
    }
}
