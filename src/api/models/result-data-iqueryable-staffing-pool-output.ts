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


import { StaffingPoolOutput } from './staffing-pool-output';

/**
 * 
 * @export
 * @interface ResultDataIQueryableStaffingPoolOutput
 */
export interface ResultDataIQueryableStaffingPoolOutput {
    /**
     * 状态码
     * @type {number}
     * @memberof ResultDataIQueryableStaffingPoolOutput
     */
    Code?: number | null;
    /**
     * 是否执行成功
     * @type {boolean}
     * @memberof ResultDataIQueryableStaffingPoolOutput
     */
    Succeeded?: boolean;
    /**
     * 提示信息或异常信息
     * @type {string}
     * @memberof ResultDataIQueryableStaffingPoolOutput
     */
    Message?: string | null;
    /**
     * 扩展Message
     * @type {string}
     * @memberof ResultDataIQueryableStaffingPoolOutput
     */
    Description?: string | null;
    /**
     * 附加数据
     * @type {any}
     * @memberof ResultDataIQueryableStaffingPoolOutput
     */
    Extras?: any | null;
    /**
     * 时间戳
     * @type {number}
     * @memberof ResultDataIQueryableStaffingPoolOutput
     */
    Timestamp?: number;
    /**
     * 
     * @type {Array<StaffingPoolOutput>}
     * @memberof ResultDataIQueryableStaffingPoolOutput
     */
    Result?: Array<StaffingPoolOutput> | null;
}

