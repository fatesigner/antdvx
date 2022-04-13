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


import { SysLogVis } from './sys-log-vis';

/**
 * 
 * @export
 * @interface ResultDataIQueryableSysLogVis
 */
export interface ResultDataIQueryableSysLogVis {
    /**
     * 状态码
     * @type {number}
     * @memberof ResultDataIQueryableSysLogVis
     */
    Code?: number | null;
    /**
     * 是否执行成功
     * @type {boolean}
     * @memberof ResultDataIQueryableSysLogVis
     */
    Succeeded?: boolean;
    /**
     * 提示信息或异常信息
     * @type {string}
     * @memberof ResultDataIQueryableSysLogVis
     */
    Message?: string | null;
    /**
     * 扩展Message
     * @type {string}
     * @memberof ResultDataIQueryableSysLogVis
     */
    Description?: string | null;
    /**
     * 附加数据
     * @type {any}
     * @memberof ResultDataIQueryableSysLogVis
     */
    Extras?: any | null;
    /**
     * 时间戳
     * @type {number}
     * @memberof ResultDataIQueryableSysLogVis
     */
    Timestamp?: number;
    /**
     * 
     * @type {Array<SysLogVis>}
     * @memberof ResultDataIQueryableSysLogVis
     */
    Result?: Array<SysLogVis> | null;
}

