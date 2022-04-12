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


import { SysNoticeReceiveOutput } from './sys-notice-receive-output';

/**
 * 
 * @export
 * @interface ResultDataDictionaryStringDictionaryInt32ListSysNoticeReceiveOutput
 */
export interface ResultDataDictionaryStringDictionaryInt32ListSysNoticeReceiveOutput {
    /**
     * 状态码
     * @type {number}
     * @memberof ResultDataDictionaryStringDictionaryInt32ListSysNoticeReceiveOutput
     */
    Code?: number | null;
    /**
     * 是否执行成功
     * @type {boolean}
     * @memberof ResultDataDictionaryStringDictionaryInt32ListSysNoticeReceiveOutput
     */
    Succeeded?: boolean;
    /**
     * 提示信息或异常信息
     * @type {string}
     * @memberof ResultDataDictionaryStringDictionaryInt32ListSysNoticeReceiveOutput
     */
    Message?: string | null;
    /**
     * 扩展Message
     * @type {string}
     * @memberof ResultDataDictionaryStringDictionaryInt32ListSysNoticeReceiveOutput
     */
    Description?: string | null;
    /**
     * 附加数据
     * @type {any}
     * @memberof ResultDataDictionaryStringDictionaryInt32ListSysNoticeReceiveOutput
     */
    Extras?: any | null;
    /**
     * 时间戳
     * @type {number}
     * @memberof ResultDataDictionaryStringDictionaryInt32ListSysNoticeReceiveOutput
     */
    Timestamp?: number;
    /**
     * 
     * @type {{ [key: string]: { [key: string]: Array<SysNoticeReceiveOutput>; }; }}
     * @memberof ResultDataDictionaryStringDictionaryInt32ListSysNoticeReceiveOutput
     */
    Result?: { [key: string]: { [key: string]: Array<SysNoticeReceiveOutput>; }; } | null;
}


