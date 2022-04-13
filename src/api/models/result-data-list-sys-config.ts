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


import { SysConfig } from './sys-config';

/**
 * 
 * @export
 * @interface ResultDataListSysConfig
 */
export interface ResultDataListSysConfig {
    /**
     * 状态码
     * @type {number}
     * @memberof ResultDataListSysConfig
     */
    Code?: number | null;
    /**
     * 是否执行成功
     * @type {boolean}
     * @memberof ResultDataListSysConfig
     */
    Succeeded?: boolean;
    /**
     * 提示信息或异常信息
     * @type {string}
     * @memberof ResultDataListSysConfig
     */
    Message?: string | null;
    /**
     * 扩展Message
     * @type {string}
     * @memberof ResultDataListSysConfig
     */
    Description?: string | null;
    /**
     * 附加数据
     * @type {any}
     * @memberof ResultDataListSysConfig
     */
    Extras?: any | null;
    /**
     * 时间戳
     * @type {number}
     * @memberof ResultDataListSysConfig
     */
    Timestamp?: number;
    /**
     * 
     * @type {Array<SysConfig>}
     * @memberof ResultDataListSysConfig
     */
    Result?: Array<SysConfig> | null;
}

