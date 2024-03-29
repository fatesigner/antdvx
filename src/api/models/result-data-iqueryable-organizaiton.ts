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


import { Organizaiton } from './organizaiton';

/**
 * 
 * @export
 * @interface ResultDataIQueryableOrganizaiton
 */
export interface ResultDataIQueryableOrganizaiton {
    /**
     * 状态码
     * @type {number}
     * @memberof ResultDataIQueryableOrganizaiton
     */
    Code?: number | null;
    /**
     * 是否执行成功
     * @type {boolean}
     * @memberof ResultDataIQueryableOrganizaiton
     */
    Succeeded?: boolean;
    /**
     * 提示信息或异常信息
     * @type {string}
     * @memberof ResultDataIQueryableOrganizaiton
     */
    Message?: string | null;
    /**
     * 扩展Message
     * @type {string}
     * @memberof ResultDataIQueryableOrganizaiton
     */
    Description?: string | null;
    /**
     * 附加数据
     * @type {any}
     * @memberof ResultDataIQueryableOrganizaiton
     */
    Extras?: any | null;
    /**
     * 时间戳
     * @type {number}
     * @memberof ResultDataIQueryableOrganizaiton
     */
    Timestamp?: number;
    /**
     * 
     * @type {Array<Organizaiton>}
     * @memberof ResultDataIQueryableOrganizaiton
     */
    Result?: Array<Organizaiton> | null;
}


