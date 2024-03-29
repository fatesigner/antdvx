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


import { Discipline } from './discipline';

/**
 * 
 * @export
 * @interface ResultDataIQueryableDiscipline
 */
export interface ResultDataIQueryableDiscipline {
    /**
     * 状态码
     * @type {number}
     * @memberof ResultDataIQueryableDiscipline
     */
    Code?: number | null;
    /**
     * 是否执行成功
     * @type {boolean}
     * @memberof ResultDataIQueryableDiscipline
     */
    Succeeded?: boolean;
    /**
     * 提示信息或异常信息
     * @type {string}
     * @memberof ResultDataIQueryableDiscipline
     */
    Message?: string | null;
    /**
     * 扩展Message
     * @type {string}
     * @memberof ResultDataIQueryableDiscipline
     */
    Description?: string | null;
    /**
     * 附加数据
     * @type {any}
     * @memberof ResultDataIQueryableDiscipline
     */
    Extras?: any | null;
    /**
     * 时间戳
     * @type {number}
     * @memberof ResultDataIQueryableDiscipline
     */
    Timestamp?: number;
    /**
     * 
     * @type {Array<Discipline>}
     * @memberof ResultDataIQueryableDiscipline
     */
    Result?: Array<Discipline> | null;
}


