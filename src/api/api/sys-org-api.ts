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
import { IDslongInput } from '../models';
// @ts-ignore
import { ResultDataBoolean } from '../models';
// @ts-ignore
import { ResultDataIQueryableSysOrg } from '../models';
// @ts-ignore
import { SysOrgInput } from '../models';
/**
 * SysOrgApi - axios parameter creator
 * @export
 */
export const SysOrgApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary 删除
         * @param {IDslongInput} [iDslongInput] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        systemManageOrgDelete: async (iDslongInput?: IDslongInput, options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/SystemManage/Org/Delete`;
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
            localVarRequestOptions.data = serializeDataIfNeeded(iDslongInput, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary 查询全部
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
        systemManageOrgOdataAll: async (filter?: string, apply?: string, orderby?: string, top?: string, skip?: string, select?: string, expand?: string, count?: string, format?: string, skiptoken?: string, deltatoken?: string, options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/SystemManage/Org/Odata/All`;
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
         * @summary 增加和修改
         * @param {SysOrgInput} [sysOrgInput] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        systemManageOrgSave: async (sysOrgInput?: SysOrgInput, options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/SystemManage/Org/Save`;
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
            localVarRequestOptions.data = serializeDataIfNeeded(sysOrgInput, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * SysOrgApi - functional programming interface
 * @export
 */
export const SysOrgApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = SysOrgApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @summary 删除
         * @param {IDslongInput} [iDslongInput] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async systemManageOrgDelete(iDslongInput?: IDslongInput, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ResultDataBoolean>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.systemManageOrgDelete(iDslongInput, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @summary 查询全部
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
        async systemManageOrgOdataAll(filter?: string, apply?: string, orderby?: string, top?: string, skip?: string, select?: string, expand?: string, count?: string, format?: string, skiptoken?: string, deltatoken?: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ResultDataIQueryableSysOrg>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.systemManageOrgOdataAll(filter, apply, orderby, top, skip, select, expand, count, format, skiptoken, deltatoken, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @summary 增加和修改
         * @param {SysOrgInput} [sysOrgInput] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async systemManageOrgSave(sysOrgInput?: SysOrgInput, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ResultDataBoolean>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.systemManageOrgSave(sysOrgInput, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * SysOrgApi - factory interface
 * @export
 */
export const SysOrgApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = SysOrgApiFp(configuration)
    return {
        /**
         * 
         * @summary 删除
         * @param {IDslongInput} [iDslongInput] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        systemManageOrgDelete(iDslongInput?: IDslongInput, options?: any): AxiosPromise<ResultDataBoolean> {
            return localVarFp.systemManageOrgDelete(iDslongInput, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary 查询全部
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
        systemManageOrgOdataAll(filter?: string, apply?: string, orderby?: string, top?: string, skip?: string, select?: string, expand?: string, count?: string, format?: string, skiptoken?: string, deltatoken?: string, options?: any): AxiosPromise<ResultDataIQueryableSysOrg> {
            return localVarFp.systemManageOrgOdataAll(filter, apply, orderby, top, skip, select, expand, count, format, skiptoken, deltatoken, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary 增加和修改
         * @param {SysOrgInput} [sysOrgInput] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        systemManageOrgSave(sysOrgInput?: SysOrgInput, options?: any): AxiosPromise<ResultDataBoolean> {
            return localVarFp.systemManageOrgSave(sysOrgInput, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * Request parameters for systemManageOrgDelete operation in SysOrgApi.
 * @export
 * @interface SysOrgApiSystemManageOrgDeleteRequest
 */
export interface SysOrgApiSystemManageOrgDeleteRequest {
    /**
     * 
     * @type {IDslongInput}
     * @memberof SysOrgApiSystemManageOrgDelete
     */
    readonly iDslongInput?: IDslongInput
}

/**
 * Request parameters for systemManageOrgOdataAll operation in SysOrgApi.
 * @export
 * @interface SysOrgApiSystemManageOrgOdataAllRequest
 */
export interface SysOrgApiSystemManageOrgOdataAllRequest {
    /**
     * $filter
     * @type {string}
     * @memberof SysOrgApiSystemManageOrgOdataAll
     */
    readonly filter?: string

    /**
     * $apply
     * @type {string}
     * @memberof SysOrgApiSystemManageOrgOdataAll
     */
    readonly apply?: string

    /**
     * $orderby
     * @type {string}
     * @memberof SysOrgApiSystemManageOrgOdataAll
     */
    readonly orderby?: string

    /**
     * $top
     * @type {string}
     * @memberof SysOrgApiSystemManageOrgOdataAll
     */
    readonly top?: string

    /**
     * $skip
     * @type {string}
     * @memberof SysOrgApiSystemManageOrgOdataAll
     */
    readonly skip?: string

    /**
     * $select
     * @type {string}
     * @memberof SysOrgApiSystemManageOrgOdataAll
     */
    readonly select?: string

    /**
     * $expand
     * @type {string}
     * @memberof SysOrgApiSystemManageOrgOdataAll
     */
    readonly expand?: string

    /**
     * $count
     * @type {string}
     * @memberof SysOrgApiSystemManageOrgOdataAll
     */
    readonly count?: string

    /**
     * $format
     * @type {string}
     * @memberof SysOrgApiSystemManageOrgOdataAll
     */
    readonly format?: string

    /**
     * $skiptoken
     * @type {string}
     * @memberof SysOrgApiSystemManageOrgOdataAll
     */
    readonly skiptoken?: string

    /**
     * $deltatoken
     * @type {string}
     * @memberof SysOrgApiSystemManageOrgOdataAll
     */
    readonly deltatoken?: string
}

/**
 * Request parameters for systemManageOrgSave operation in SysOrgApi.
 * @export
 * @interface SysOrgApiSystemManageOrgSaveRequest
 */
export interface SysOrgApiSystemManageOrgSaveRequest {
    /**
     * 
     * @type {SysOrgInput}
     * @memberof SysOrgApiSystemManageOrgSave
     */
    readonly sysOrgInput?: SysOrgInput
}

/**
 * SysOrgApi - object-oriented interface
 * @export
 * @class SysOrgApi
 * @extends {BaseAPI}
 */
export class SysOrgApi extends BaseAPI {
    /**
     * 
     * @summary 删除
     * @param {SysOrgApiSystemManageOrgDeleteRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SysOrgApi
     */
    public systemManageOrgDelete(requestParameters: SysOrgApiSystemManageOrgDeleteRequest = {}, options?: any) {
        return SysOrgApiFp(this.configuration).systemManageOrgDelete(requestParameters.iDslongInput, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary 查询全部
     * @param {SysOrgApiSystemManageOrgOdataAllRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SysOrgApi
     */
    public systemManageOrgOdataAll(requestParameters: SysOrgApiSystemManageOrgOdataAllRequest = {}, options?: any) {
        return SysOrgApiFp(this.configuration).systemManageOrgOdataAll(requestParameters.filter, requestParameters.apply, requestParameters.orderby, requestParameters.top, requestParameters.skip, requestParameters.select, requestParameters.expand, requestParameters.count, requestParameters.format, requestParameters.skiptoken, requestParameters.deltatoken, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary 增加和修改
     * @param {SysOrgApiSystemManageOrgSaveRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SysOrgApi
     */
    public systemManageOrgSave(requestParameters: SysOrgApiSystemManageOrgSaveRequest = {}, options?: any) {
        return SysOrgApiFp(this.configuration).systemManageOrgSave(requestParameters.sysOrgInput, options).then((request) => request(this.axios, this.basePath));
    }
}
