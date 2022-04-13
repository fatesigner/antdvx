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


import { SysRoleOutput } from './sys-role-output';

/**
 * 
 * @export
 * @interface ResultDataListSysRoleOutput
 */
export interface ResultDataListSysRoleOutput {
    /**
     * 状态码
     * @type {number}
     * @memberof ResultDataListSysRoleOutput
     */
    Code?: number | null;
    /**
     * 是否执行成功
     * @type {boolean}
     * @memberof ResultDataListSysRoleOutput
     */
    Succeeded?: boolean;
    /**
     * 提示信息或异常信息
     * @type {string}
     * @memberof ResultDataListSysRoleOutput
     */
    Message?: string | null;
    /**
     * 扩展Message
     * @type {string}
     * @memberof ResultDataListSysRoleOutput
     */
    Description?: string | null;
    /**
     * 附加数据
     * @type {any}
     * @memberof ResultDataListSysRoleOutput
     */
    Extras?: any | null;
    /**
     * 时间戳
     * @type {number}
     * @memberof ResultDataListSysRoleOutput
     */
    Timestamp?: number;
    /**
     * 
     * @type {Array<SysRoleOutput>}
     * @memberof ResultDataListSysRoleOutput
     */
    Result?: Array<SysRoleOutput> | null;
}

