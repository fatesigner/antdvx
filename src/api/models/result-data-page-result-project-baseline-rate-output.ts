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


import { PageResultProjectBaselineRateOutput } from './page-result-project-baseline-rate-output';

/**
 * 
 * @export
 * @interface ResultDataPageResultProjectBaselineRateOutput
 */
export interface ResultDataPageResultProjectBaselineRateOutput {
    /**
     * 状态码
     * @type {number}
     * @memberof ResultDataPageResultProjectBaselineRateOutput
     */
    Code?: number | null;
    /**
     * 是否执行成功
     * @type {boolean}
     * @memberof ResultDataPageResultProjectBaselineRateOutput
     */
    Succeeded?: boolean;
    /**
     * 提示信息或异常信息
     * @type {string}
     * @memberof ResultDataPageResultProjectBaselineRateOutput
     */
    Message?: string | null;
    /**
     * 扩展Message
     * @type {string}
     * @memberof ResultDataPageResultProjectBaselineRateOutput
     */
    Description?: string | null;
    /**
     * 附加数据
     * @type {any}
     * @memberof ResultDataPageResultProjectBaselineRateOutput
     */
    Extras?: any | null;
    /**
     * 时间戳
     * @type {number}
     * @memberof ResultDataPageResultProjectBaselineRateOutput
     */
    Timestamp?: number;
    /**
     * 
     * @type {PageResultProjectBaselineRateOutput}
     * @memberof ResultDataPageResultProjectBaselineRateOutput
     */
    Result?: PageResultProjectBaselineRateOutput;
}


