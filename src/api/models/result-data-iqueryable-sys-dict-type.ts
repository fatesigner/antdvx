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


import { SysDictType } from './sys-dict-type';

/**
 * 
 * @export
 * @interface ResultDataIQueryableSysDictType
 */
export interface ResultDataIQueryableSysDictType {
    /**
     * 状态码
     * @type {number}
     * @memberof ResultDataIQueryableSysDictType
     */
    Code?: number | null;
    /**
     * 是否执行成功
     * @type {boolean}
     * @memberof ResultDataIQueryableSysDictType
     */
    Succeeded?: boolean;
    /**
     * 提示信息或异常信息
     * @type {string}
     * @memberof ResultDataIQueryableSysDictType
     */
    Message?: string | null;
    /**
     * 扩展Message
     * @type {string}
     * @memberof ResultDataIQueryableSysDictType
     */
    Description?: string | null;
    /**
     * 附加数据
     * @type {any}
     * @memberof ResultDataIQueryableSysDictType
     */
    Extras?: any | null;
    /**
     * 时间戳
     * @type {number}
     * @memberof ResultDataIQueryableSysDictType
     */
    Timestamp?: number;
    /**
     * 
     * @type {Array<SysDictType>}
     * @memberof ResultDataIQueryableSysDictType
     */
    Result?: Array<SysDictType> | null;
}


