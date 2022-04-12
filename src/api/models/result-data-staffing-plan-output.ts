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


import { StaffingPlanOutput } from './staffing-plan-output';

/**
 * 
 * @export
 * @interface ResultDataStaffingPlanOutput
 */
export interface ResultDataStaffingPlanOutput {
    /**
     * 状态码
     * @type {number}
     * @memberof ResultDataStaffingPlanOutput
     */
    Code?: number | null;
    /**
     * 是否执行成功
     * @type {boolean}
     * @memberof ResultDataStaffingPlanOutput
     */
    Succeeded?: boolean;
    /**
     * 提示信息或异常信息
     * @type {string}
     * @memberof ResultDataStaffingPlanOutput
     */
    Message?: string | null;
    /**
     * 扩展Message
     * @type {string}
     * @memberof ResultDataStaffingPlanOutput
     */
    Description?: string | null;
    /**
     * 附加数据
     * @type {any}
     * @memberof ResultDataStaffingPlanOutput
     */
    Extras?: any | null;
    /**
     * 时间戳
     * @type {number}
     * @memberof ResultDataStaffingPlanOutput
     */
    Timestamp?: number;
    /**
     * 
     * @type {StaffingPlanOutput}
     * @memberof ResultDataStaffingPlanOutput
     */
    Result?: StaffingPlanOutput;
}


