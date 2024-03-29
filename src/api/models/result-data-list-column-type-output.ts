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


import { ColumnTypeOutput } from './column-type-output';

/**
 * 
 * @export
 * @interface ResultDataListColumnTypeOutput
 */
export interface ResultDataListColumnTypeOutput {
    /**
     * 状态码
     * @type {number}
     * @memberof ResultDataListColumnTypeOutput
     */
    Code?: number | null;
    /**
     * 是否执行成功
     * @type {boolean}
     * @memberof ResultDataListColumnTypeOutput
     */
    Succeeded?: boolean;
    /**
     * 提示信息或异常信息
     * @type {string}
     * @memberof ResultDataListColumnTypeOutput
     */
    Message?: string | null;
    /**
     * 扩展Message
     * @type {string}
     * @memberof ResultDataListColumnTypeOutput
     */
    Description?: string | null;
    /**
     * 附加数据
     * @type {any}
     * @memberof ResultDataListColumnTypeOutput
     */
    Extras?: any | null;
    /**
     * 时间戳
     * @type {number}
     * @memberof ResultDataListColumnTypeOutput
     */
    Timestamp?: number;
    /**
     * 
     * @type {Array<ColumnTypeOutput>}
     * @memberof ResultDataListColumnTypeOutput
     */
    Result?: Array<ColumnTypeOutput> | null;
}


