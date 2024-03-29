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


import { SysQueryConditionOutput } from './sys-query-condition-output';

/**
 * 
 * @export
 * @interface ResultDataListSysQueryConditionOutput
 */
export interface ResultDataListSysQueryConditionOutput {
    /**
     * 状态码
     * @type {number}
     * @memberof ResultDataListSysQueryConditionOutput
     */
    Code?: number | null;
    /**
     * 是否执行成功
     * @type {boolean}
     * @memberof ResultDataListSysQueryConditionOutput
     */
    Succeeded?: boolean;
    /**
     * 提示信息或异常信息
     * @type {string}
     * @memberof ResultDataListSysQueryConditionOutput
     */
    Message?: string | null;
    /**
     * 扩展Message
     * @type {string}
     * @memberof ResultDataListSysQueryConditionOutput
     */
    Description?: string | null;
    /**
     * 附加数据
     * @type {any}
     * @memberof ResultDataListSysQueryConditionOutput
     */
    Extras?: any | null;
    /**
     * 时间戳
     * @type {number}
     * @memberof ResultDataListSysQueryConditionOutput
     */
    Timestamp?: number;
    /**
     * 
     * @type {Array<SysQueryConditionOutput>}
     * @memberof ResultDataListSysQueryConditionOutput
     */
    Result?: Array<SysQueryConditionOutput> | null;
}


