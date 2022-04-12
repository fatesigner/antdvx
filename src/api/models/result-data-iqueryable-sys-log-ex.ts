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


import { SysLogEx } from './sys-log-ex';

/**
 * 
 * @export
 * @interface ResultDataIQueryableSysLogEx
 */
export interface ResultDataIQueryableSysLogEx {
    /**
     * 状态码
     * @type {number}
     * @memberof ResultDataIQueryableSysLogEx
     */
    Code?: number | null;
    /**
     * 是否执行成功
     * @type {boolean}
     * @memberof ResultDataIQueryableSysLogEx
     */
    Succeeded?: boolean;
    /**
     * 提示信息或异常信息
     * @type {string}
     * @memberof ResultDataIQueryableSysLogEx
     */
    Message?: string | null;
    /**
     * 扩展Message
     * @type {string}
     * @memberof ResultDataIQueryableSysLogEx
     */
    Description?: string | null;
    /**
     * 附加数据
     * @type {any}
     * @memberof ResultDataIQueryableSysLogEx
     */
    Extras?: any | null;
    /**
     * 时间戳
     * @type {number}
     * @memberof ResultDataIQueryableSysLogEx
     */
    Timestamp?: number;
    /**
     * 
     * @type {Array<SysLogEx>}
     * @memberof ResultDataIQueryableSysLogEx
     */
    Result?: Array<SysLogEx> | null;
}


