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


import { PositionOutput } from './position-output';

/**
 * 
 * @export
 * @interface ResultDataListPositionOutput
 */
export interface ResultDataListPositionOutput {
    /**
     * 状态码
     * @type {number}
     * @memberof ResultDataListPositionOutput
     */
    Code?: number | null;
    /**
     * 是否执行成功
     * @type {boolean}
     * @memberof ResultDataListPositionOutput
     */
    Succeeded?: boolean;
    /**
     * 提示信息或异常信息
     * @type {string}
     * @memberof ResultDataListPositionOutput
     */
    Message?: string | null;
    /**
     * 扩展Message
     * @type {string}
     * @memberof ResultDataListPositionOutput
     */
    Description?: string | null;
    /**
     * 附加数据
     * @type {any}
     * @memberof ResultDataListPositionOutput
     */
    Extras?: any | null;
    /**
     * 时间戳
     * @type {number}
     * @memberof ResultDataListPositionOutput
     */
    Timestamp?: number;
    /**
     * 
     * @type {Array<PositionOutput>}
     * @memberof ResultDataListPositionOutput
     */
    Result?: Array<PositionOutput> | null;
}

