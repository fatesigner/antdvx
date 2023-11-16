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


import { ProjectBaselineRateOutput } from './project-baseline-rate-output';

/**
 * 
 * @export
 * @interface ResultDataListProjectBaselineRateOutput
 */
export interface ResultDataListProjectBaselineRateOutput {
    /**
     * 状态码
     * @type {number}
     * @memberof ResultDataListProjectBaselineRateOutput
     */
    Code?: number | null;
    /**
     * 是否执行成功
     * @type {boolean}
     * @memberof ResultDataListProjectBaselineRateOutput
     */
    Succeeded?: boolean;
    /**
     * 提示信息或异常信息
     * @type {string}
     * @memberof ResultDataListProjectBaselineRateOutput
     */
    Message?: string | null;
    /**
     * 扩展Message
     * @type {string}
     * @memberof ResultDataListProjectBaselineRateOutput
     */
    Description?: string | null;
    /**
     * 附加数据
     * @type {any}
     * @memberof ResultDataListProjectBaselineRateOutput
     */
    Extras?: any | null;
    /**
     * 时间戳
     * @type {number}
     * @memberof ResultDataListProjectBaselineRateOutput
     */
    Timestamp?: number;
    /**
     * 
     * @type {Array<ProjectBaselineRateOutput>}
     * @memberof ResultDataListProjectBaselineRateOutput
     */
    Result?: Array<ProjectBaselineRateOutput> | null;
}

