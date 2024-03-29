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


import { StaffingPlanDetail } from './staffing-plan-detail';

/**
 * 
 * @export
 * @interface ResultDataIQueryableStaffingPlanDetail
 */
export interface ResultDataIQueryableStaffingPlanDetail {
    /**
     * 状态码
     * @type {number}
     * @memberof ResultDataIQueryableStaffingPlanDetail
     */
    Code?: number | null;
    /**
     * 是否执行成功
     * @type {boolean}
     * @memberof ResultDataIQueryableStaffingPlanDetail
     */
    Succeeded?: boolean;
    /**
     * 提示信息或异常信息
     * @type {string}
     * @memberof ResultDataIQueryableStaffingPlanDetail
     */
    Message?: string | null;
    /**
     * 扩展Message
     * @type {string}
     * @memberof ResultDataIQueryableStaffingPlanDetail
     */
    Description?: string | null;
    /**
     * 附加数据
     * @type {any}
     * @memberof ResultDataIQueryableStaffingPlanDetail
     */
    Extras?: any | null;
    /**
     * 时间戳
     * @type {number}
     * @memberof ResultDataIQueryableStaffingPlanDetail
     */
    Timestamp?: number;
    /**
     * 
     * @type {Array<StaffingPlanDetail>}
     * @memberof ResultDataIQueryableStaffingPlanDetail
     */
    Result?: Array<StaffingPlanDetail> | null;
}


