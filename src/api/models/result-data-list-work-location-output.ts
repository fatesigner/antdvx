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


import { WorkLocationOutput } from './work-location-output';

/**
 * 
 * @export
 * @interface ResultDataListWorkLocationOutput
 */
export interface ResultDataListWorkLocationOutput {
    /**
     * 状态码
     * @type {number}
     * @memberof ResultDataListWorkLocationOutput
     */
    Code?: number | null;
    /**
     * 是否执行成功
     * @type {boolean}
     * @memberof ResultDataListWorkLocationOutput
     */
    Succeeded?: boolean;
    /**
     * 提示信息或异常信息
     * @type {string}
     * @memberof ResultDataListWorkLocationOutput
     */
    Message?: string | null;
    /**
     * 扩展Message
     * @type {string}
     * @memberof ResultDataListWorkLocationOutput
     */
    Description?: string | null;
    /**
     * 附加数据
     * @type {any}
     * @memberof ResultDataListWorkLocationOutput
     */
    Extras?: any | null;
    /**
     * 时间戳
     * @type {number}
     * @memberof ResultDataListWorkLocationOutput
     */
    Timestamp?: number;
    /**
     * 
     * @type {Array<WorkLocationOutput>}
     * @memberof ResultDataListWorkLocationOutput
     */
    Result?: Array<WorkLocationOutput> | null;
}


