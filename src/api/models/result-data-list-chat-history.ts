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


import { ChatHistory } from './chat-history';

/**
 * 
 * @export
 * @interface ResultDataListChatHistory
 */
export interface ResultDataListChatHistory {
    /**
     * 状态码
     * @type {number}
     * @memberof ResultDataListChatHistory
     */
    Code?: number | null;
    /**
     * 是否执行成功
     * @type {boolean}
     * @memberof ResultDataListChatHistory
     */
    Succeeded?: boolean;
    /**
     * 提示信息或异常信息
     * @type {string}
     * @memberof ResultDataListChatHistory
     */
    Message?: string | null;
    /**
     * 扩展Message
     * @type {string}
     * @memberof ResultDataListChatHistory
     */
    Description?: string | null;
    /**
     * 附加数据
     * @type {any}
     * @memberof ResultDataListChatHistory
     */
    Extras?: any | null;
    /**
     * 时间戳
     * @type {number}
     * @memberof ResultDataListChatHistory
     */
    Timestamp?: number;
    /**
     * 
     * @type {Array<ChatHistory>}
     * @memberof ResultDataListChatHistory
     */
    Result?: Array<ChatHistory> | null;
}


