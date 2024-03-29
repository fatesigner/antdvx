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
import { MessageInput } from '../models';
// @ts-ignore
import { MessageUsersInput } from '../models';
// @ts-ignore
import { ResultDataBoolean } from '../models';
/**
 * SendMessageApi - axios parameter creator
 * @export
 */
export const SendMessageApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary 发送消息给所有人
         * @param {MessageInput} [messageInput] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        systemSendMessageallUser: async (messageInput?: MessageInput, options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/System/SendMessage/allUser`;
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
            localVarRequestOptions.data = serializeDataIfNeeded(messageInput, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary 发送消息给所有人
         * @param {string} [message] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        systemSendMessagemessage: async (message?: string, options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/System/SendMessage/message`;
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

            if (message !== undefined) {
                localVarQueryParameter['message'] = message;
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
         * @summary 发送消息给除了发送人的其他人
         * @param {string} userCode 
         * @param {MessageInput} [messageInput] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        systemSendMessageuserCodeotherUser: async (userCode: string, messageInput?: MessageInput, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'userCode' is not null or undefined
            assertParamExists('systemSendMessageuserCodeotherUser', 'userCode', userCode)
            const localVarPath = `/System/SendMessage/{userCode}/otherUser`
                .replace(`{${"userCode"}}`, encodeURIComponent(String(userCode)));
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
            localVarRequestOptions.data = serializeDataIfNeeded(messageInput, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary 发送消息给某个人
         * @param {string} userCode 
         * @param {MessageInput} [messageInput] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        systemSendMessageuserCodeuser: async (userCode: string, messageInput?: MessageInput, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'userCode' is not null or undefined
            assertParamExists('systemSendMessageuserCodeuser', 'userCode', userCode)
            const localVarPath = `/System/SendMessage/{userCode}/user`
                .replace(`{${"userCode"}}`, encodeURIComponent(String(userCode)));
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
            localVarRequestOptions.data = serializeDataIfNeeded(messageInput, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary 发送消息给某些人
         * @param {MessageUsersInput} [messageUsersInput] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        systemSendMessageusers: async (messageUsersInput?: MessageUsersInput, options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/System/SendMessage/users`;
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
            localVarRequestOptions.data = serializeDataIfNeeded(messageUsersInput, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * SendMessageApi - functional programming interface
 * @export
 */
export const SendMessageApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = SendMessageApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @summary 发送消息给所有人
         * @param {MessageInput} [messageInput] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async systemSendMessageallUser(messageInput?: MessageInput, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.systemSendMessageallUser(messageInput, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @summary 发送消息给所有人
         * @param {string} [message] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async systemSendMessagemessage(message?: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.systemSendMessagemessage(message, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @summary 发送消息给除了发送人的其他人
         * @param {string} userCode 
         * @param {MessageInput} [messageInput] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async systemSendMessageuserCodeotherUser(userCode: string, messageInput?: MessageInput, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ResultDataBoolean>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.systemSendMessageuserCodeotherUser(userCode, messageInput, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @summary 发送消息给某个人
         * @param {string} userCode 
         * @param {MessageInput} [messageInput] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async systemSendMessageuserCodeuser(userCode: string, messageInput?: MessageInput, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ResultDataBoolean>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.systemSendMessageuserCodeuser(userCode, messageInput, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @summary 发送消息给某些人
         * @param {MessageUsersInput} [messageUsersInput] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async systemSendMessageusers(messageUsersInput?: MessageUsersInput, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ResultDataBoolean>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.systemSendMessageusers(messageUsersInput, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * SendMessageApi - factory interface
 * @export
 */
export const SendMessageApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = SendMessageApiFp(configuration)
    return {
        /**
         * 
         * @summary 发送消息给所有人
         * @param {MessageInput} [messageInput] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        systemSendMessageallUser(messageInput?: MessageInput, options?: any): AxiosPromise<void> {
            return localVarFp.systemSendMessageallUser(messageInput, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary 发送消息给所有人
         * @param {string} [message] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        systemSendMessagemessage(message?: string, options?: any): AxiosPromise<void> {
            return localVarFp.systemSendMessagemessage(message, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary 发送消息给除了发送人的其他人
         * @param {string} userCode 
         * @param {MessageInput} [messageInput] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        systemSendMessageuserCodeotherUser(userCode: string, messageInput?: MessageInput, options?: any): AxiosPromise<ResultDataBoolean> {
            return localVarFp.systemSendMessageuserCodeotherUser(userCode, messageInput, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary 发送消息给某个人
         * @param {string} userCode 
         * @param {MessageInput} [messageInput] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        systemSendMessageuserCodeuser(userCode: string, messageInput?: MessageInput, options?: any): AxiosPromise<ResultDataBoolean> {
            return localVarFp.systemSendMessageuserCodeuser(userCode, messageInput, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary 发送消息给某些人
         * @param {MessageUsersInput} [messageUsersInput] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        systemSendMessageusers(messageUsersInput?: MessageUsersInput, options?: any): AxiosPromise<ResultDataBoolean> {
            return localVarFp.systemSendMessageusers(messageUsersInput, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * Request parameters for systemSendMessageallUser operation in SendMessageApi.
 * @export
 * @interface SendMessageApiSystemSendMessageallUserRequest
 */
export interface SendMessageApiSystemSendMessageallUserRequest {
    /**
     * 
     * @type {MessageInput}
     * @memberof SendMessageApiSystemSendMessageallUser
     */
    readonly messageInput?: MessageInput
}

/**
 * Request parameters for systemSendMessagemessage operation in SendMessageApi.
 * @export
 * @interface SendMessageApiSystemSendMessagemessageRequest
 */
export interface SendMessageApiSystemSendMessagemessageRequest {
    /**
     * 
     * @type {string}
     * @memberof SendMessageApiSystemSendMessagemessage
     */
    readonly message?: string
}

/**
 * Request parameters for systemSendMessageuserCodeotherUser operation in SendMessageApi.
 * @export
 * @interface SendMessageApiSystemSendMessageuserCodeotherUserRequest
 */
export interface SendMessageApiSystemSendMessageuserCodeotherUserRequest {
    /**
     * 
     * @type {string}
     * @memberof SendMessageApiSystemSendMessageuserCodeotherUser
     */
    readonly userCode: string

    /**
     * 
     * @type {MessageInput}
     * @memberof SendMessageApiSystemSendMessageuserCodeotherUser
     */
    readonly messageInput?: MessageInput
}

/**
 * Request parameters for systemSendMessageuserCodeuser operation in SendMessageApi.
 * @export
 * @interface SendMessageApiSystemSendMessageuserCodeuserRequest
 */
export interface SendMessageApiSystemSendMessageuserCodeuserRequest {
    /**
     * 
     * @type {string}
     * @memberof SendMessageApiSystemSendMessageuserCodeuser
     */
    readonly userCode: string

    /**
     * 
     * @type {MessageInput}
     * @memberof SendMessageApiSystemSendMessageuserCodeuser
     */
    readonly messageInput?: MessageInput
}

/**
 * Request parameters for systemSendMessageusers operation in SendMessageApi.
 * @export
 * @interface SendMessageApiSystemSendMessageusersRequest
 */
export interface SendMessageApiSystemSendMessageusersRequest {
    /**
     * 
     * @type {MessageUsersInput}
     * @memberof SendMessageApiSystemSendMessageusers
     */
    readonly messageUsersInput?: MessageUsersInput
}

/**
 * SendMessageApi - object-oriented interface
 * @export
 * @class SendMessageApi
 * @extends {BaseAPI}
 */
export class SendMessageApi extends BaseAPI {
    /**
     * 
     * @summary 发送消息给所有人
     * @param {SendMessageApiSystemSendMessageallUserRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SendMessageApi
     */
    public systemSendMessageallUser(requestParameters: SendMessageApiSystemSendMessageallUserRequest = {}, options?: any) {
        return SendMessageApiFp(this.configuration).systemSendMessageallUser(requestParameters.messageInput, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary 发送消息给所有人
     * @param {SendMessageApiSystemSendMessagemessageRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SendMessageApi
     */
    public systemSendMessagemessage(requestParameters: SendMessageApiSystemSendMessagemessageRequest = {}, options?: any) {
        return SendMessageApiFp(this.configuration).systemSendMessagemessage(requestParameters.message, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary 发送消息给除了发送人的其他人
     * @param {SendMessageApiSystemSendMessageuserCodeotherUserRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SendMessageApi
     */
    public systemSendMessageuserCodeotherUser(requestParameters: SendMessageApiSystemSendMessageuserCodeotherUserRequest, options?: any) {
        return SendMessageApiFp(this.configuration).systemSendMessageuserCodeotherUser(requestParameters.userCode, requestParameters.messageInput, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary 发送消息给某个人
     * @param {SendMessageApiSystemSendMessageuserCodeuserRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SendMessageApi
     */
    public systemSendMessageuserCodeuser(requestParameters: SendMessageApiSystemSendMessageuserCodeuserRequest, options?: any) {
        return SendMessageApiFp(this.configuration).systemSendMessageuserCodeuser(requestParameters.userCode, requestParameters.messageInput, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary 发送消息给某些人
     * @param {SendMessageApiSystemSendMessageusersRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SendMessageApi
     */
    public systemSendMessageusers(requestParameters: SendMessageApiSystemSendMessageusersRequest = {}, options?: any) {
        return SendMessageApiFp(this.configuration).systemSendMessageusers(requestParameters.messageUsersInput, options).then((request) => request(this.axios, this.basePath));
    }
}
