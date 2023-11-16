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


import { WorkLocation } from './work-location';

/**
 * 
 * @export
 * @interface ResultDataIQueryableWorkLocation
 */
export interface ResultDataIQueryableWorkLocation {
    /**
     * 状态码
     * @type {number}
     * @memberof ResultDataIQueryableWorkLocation
     */
    Code?: number | null;
    /**
     * 是否执行成功
     * @type {boolean}
     * @memberof ResultDataIQueryableWorkLocation
     */
    Succeeded?: boolean;
    /**
     * 提示信息或异常信息
     * @type {string}
     * @memberof ResultDataIQueryableWorkLocation
     */
    Message?: string | null;
    /**
     * 扩展Message
     * @type {string}
     * @memberof ResultDataIQueryableWorkLocation
     */
    Description?: string | null;
    /**
     * 附加数据
     * @type {any}
     * @memberof ResultDataIQueryableWorkLocation
     */
    Extras?: any | null;
    /**
     * 时间戳
     * @type {number}
     * @memberof ResultDataIQueryableWorkLocation
     */
    Timestamp?: number;
    /**
     * 
     * @type {Array<WorkLocation>}
     * @memberof ResultDataIQueryableWorkLocation
     */
    Result?: Array<WorkLocation> | null;
}

