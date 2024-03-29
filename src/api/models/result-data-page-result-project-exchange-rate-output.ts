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


import { PageResultProjectExchangeRateOutput } from './page-result-project-exchange-rate-output';

/**
 * 
 * @export
 * @interface ResultDataPageResultProjectExchangeRateOutput
 */
export interface ResultDataPageResultProjectExchangeRateOutput {
    /**
     * 状态码
     * @type {number}
     * @memberof ResultDataPageResultProjectExchangeRateOutput
     */
    Code?: number | null;
    /**
     * 是否执行成功
     * @type {boolean}
     * @memberof ResultDataPageResultProjectExchangeRateOutput
     */
    Succeeded?: boolean;
    /**
     * 提示信息或异常信息
     * @type {string}
     * @memberof ResultDataPageResultProjectExchangeRateOutput
     */
    Message?: string | null;
    /**
     * 扩展Message
     * @type {string}
     * @memberof ResultDataPageResultProjectExchangeRateOutput
     */
    Description?: string | null;
    /**
     * 附加数据
     * @type {any}
     * @memberof ResultDataPageResultProjectExchangeRateOutput
     */
    Extras?: any | null;
    /**
     * 时间戳
     * @type {number}
     * @memberof ResultDataPageResultProjectExchangeRateOutput
     */
    Timestamp?: number;
    /**
     * 
     * @type {PageResultProjectExchangeRateOutput}
     * @memberof ResultDataPageResultProjectExchangeRateOutput
     */
    Result?: PageResultProjectExchangeRateOutput;
}


