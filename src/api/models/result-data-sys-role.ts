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


import { SysRole } from './sys-role';

/**
 * 
 * @export
 * @interface ResultDataSysRole
 */
export interface ResultDataSysRole {
    /**
     * 状态码
     * @type {number}
     * @memberof ResultDataSysRole
     */
    Code?: number | null;
    /**
     * 是否执行成功
     * @type {boolean}
     * @memberof ResultDataSysRole
     */
    Succeeded?: boolean;
    /**
     * 提示信息或异常信息
     * @type {string}
     * @memberof ResultDataSysRole
     */
    Message?: string | null;
    /**
     * 扩展Message
     * @type {string}
     * @memberof ResultDataSysRole
     */
    Description?: string | null;
    /**
     * 附加数据
     * @type {any}
     * @memberof ResultDataSysRole
     */
    Extras?: any | null;
    /**
     * 时间戳
     * @type {number}
     * @memberof ResultDataSysRole
     */
    Timestamp?: number;
    /**
     * 
     * @type {SysRole}
     * @memberof ResultDataSysRole
     */
    Result?: SysRole;
}


