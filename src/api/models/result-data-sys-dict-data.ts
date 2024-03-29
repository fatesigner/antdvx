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


import { SysDictData } from './sys-dict-data';

/**
 * 
 * @export
 * @interface ResultDataSysDictData
 */
export interface ResultDataSysDictData {
    /**
     * 状态码
     * @type {number}
     * @memberof ResultDataSysDictData
     */
    Code?: number | null;
    /**
     * 是否执行成功
     * @type {boolean}
     * @memberof ResultDataSysDictData
     */
    Succeeded?: boolean;
    /**
     * 提示信息或异常信息
     * @type {string}
     * @memberof ResultDataSysDictData
     */
    Message?: string | null;
    /**
     * 扩展Message
     * @type {string}
     * @memberof ResultDataSysDictData
     */
    Description?: string | null;
    /**
     * 附加数据
     * @type {any}
     * @memberof ResultDataSysDictData
     */
    Extras?: any | null;
    /**
     * 时间戳
     * @type {number}
     * @memberof ResultDataSysDictData
     */
    Timestamp?: number;
    /**
     * 
     * @type {SysDictData}
     * @memberof ResultDataSysDictData
     */
    Result?: SysDictData;
}


