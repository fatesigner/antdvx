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
import { ResultDataDictionaryStringPharWorksConfigOutput } from '../models';
// @ts-ignore
import { ResultDataIQueryableSysDictType } from '../models';
// @ts-ignore
import { ResultDataListSysDictData } from '../models';
/**
 * DictDataConfigApi - axios parameter creator
 * @export
 */
export const DictDataConfigApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary 获取全部配置
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        pharWorksConfigAll: async (options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/PharWorksConfig/All`;
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
         * @summary 取出全部Code
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        pharWorksConfigGetCodesAll: async (options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/PharWorksConfig/GetCodes/All`;
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
         * @summary 根据配置Code获取字典明细
         * @param {string} code 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        pharWorksConfigcodeGet: async (code: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'code' is not null or undefined
            assertParamExists('pharWorksConfigcodeGet', 'code', code)
            const localVarPath = `/PharWorksConfig/{code}/Get`
                .replace(`{${"code"}}`, encodeURIComponent(String(code)));
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
         * @summary 根据配置Code获取字典明细
         * @param {string} code 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        pharWorksConfigcodeGetDic: async (code: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'code' is not null or undefined
            assertParamExists('pharWorksConfigcodeGetDic', 'code', code)
            const localVarPath = `/PharWorksConfig/{code}/GetDic`
                .replace(`{${"code"}}`, encodeURIComponent(String(code)));
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
    }
};

/**
 * DictDataConfigApi - functional programming interface
 * @export
 */
export const DictDataConfigApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = DictDataConfigApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @summary 获取全部配置
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async pharWorksConfigAll(options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ResultDataDictionaryStringPharWorksConfigOutput>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.pharWorksConfigAll(options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @summary 取出全部Code
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async pharWorksConfigGetCodesAll(options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ResultDataIQueryableSysDictType>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.pharWorksConfigGetCodesAll(options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @summary 根据配置Code获取字典明细
         * @param {string} code 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async pharWorksConfigcodeGet(code: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ResultDataListSysDictData>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.pharWorksConfigcodeGet(code, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @summary 根据配置Code获取字典明细
         * @param {string} code 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async pharWorksConfigcodeGetDic(code: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ResultDataDictionaryStringPharWorksConfigOutput>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.pharWorksConfigcodeGetDic(code, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * DictDataConfigApi - factory interface
 * @export
 */
export const DictDataConfigApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = DictDataConfigApiFp(configuration)
    return {
        /**
         * 
         * @summary 获取全部配置
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        pharWorksConfigAll(options?: any): AxiosPromise<ResultDataDictionaryStringPharWorksConfigOutput> {
            return localVarFp.pharWorksConfigAll(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary 取出全部Code
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        pharWorksConfigGetCodesAll(options?: any): AxiosPromise<ResultDataIQueryableSysDictType> {
            return localVarFp.pharWorksConfigGetCodesAll(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary 根据配置Code获取字典明细
         * @param {string} code 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        pharWorksConfigcodeGet(code: string, options?: any): AxiosPromise<ResultDataListSysDictData> {
            return localVarFp.pharWorksConfigcodeGet(code, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary 根据配置Code获取字典明细
         * @param {string} code 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        pharWorksConfigcodeGetDic(code: string, options?: any): AxiosPromise<ResultDataDictionaryStringPharWorksConfigOutput> {
            return localVarFp.pharWorksConfigcodeGetDic(code, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * Request parameters for pharWorksConfigcodeGet operation in DictDataConfigApi.
 * @export
 * @interface DictDataConfigApiPharWorksConfigcodeGetRequest
 */
export interface DictDataConfigApiPharWorksConfigcodeGetRequest {
    /**
     * 
     * @type {string}
     * @memberof DictDataConfigApiPharWorksConfigcodeGet
     */
    readonly code: string
}

/**
 * Request parameters for pharWorksConfigcodeGetDic operation in DictDataConfigApi.
 * @export
 * @interface DictDataConfigApiPharWorksConfigcodeGetDicRequest
 */
export interface DictDataConfigApiPharWorksConfigcodeGetDicRequest {
    /**
     * 
     * @type {string}
     * @memberof DictDataConfigApiPharWorksConfigcodeGetDic
     */
    readonly code: string
}

/**
 * DictDataConfigApi - object-oriented interface
 * @export
 * @class DictDataConfigApi
 * @extends {BaseAPI}
 */
export class DictDataConfigApi extends BaseAPI {
    /**
     * 
     * @summary 获取全部配置
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DictDataConfigApi
     */
    public pharWorksConfigAll(options?: any) {
        return DictDataConfigApiFp(this.configuration).pharWorksConfigAll(options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary 取出全部Code
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DictDataConfigApi
     */
    public pharWorksConfigGetCodesAll(options?: any) {
        return DictDataConfigApiFp(this.configuration).pharWorksConfigGetCodesAll(options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary 根据配置Code获取字典明细
     * @param {DictDataConfigApiPharWorksConfigcodeGetRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DictDataConfigApi
     */
    public pharWorksConfigcodeGet(requestParameters: DictDataConfigApiPharWorksConfigcodeGetRequest, options?: any) {
        return DictDataConfigApiFp(this.configuration).pharWorksConfigcodeGet(requestParameters.code, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary 根据配置Code获取字典明细
     * @param {DictDataConfigApiPharWorksConfigcodeGetDicRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DictDataConfigApi
     */
    public pharWorksConfigcodeGetDic(requestParameters: DictDataConfigApiPharWorksConfigcodeGetDicRequest, options?: any) {
        return DictDataConfigApiFp(this.configuration).pharWorksConfigcodeGetDic(requestParameters.code, options).then((request) => request(this.axios, this.basePath));
    }
}