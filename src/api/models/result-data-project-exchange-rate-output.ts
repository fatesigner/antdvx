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


import { ProjectExchangeRateOutput } from './project-exchange-rate-output';

/**
 * 
 * @export
 * @interface ResultDataProjectExchangeRateOutput
 */
export interface ResultDataProjectExchangeRateOutput {
    /**
     * 状态码
     * @type {number}
     * @memberof ResultDataProjectExchangeRateOutput
     */
    Code?: number | null;
    /**
     * 是否执行成功
     * @type {boolean}
     * @memberof ResultDataProjectExchangeRateOutput
     */
    Succeeded?: boolean;
    /**
     * 提示信息或异常信息
     * @type {string}
     * @memberof ResultDataProjectExchangeRateOutput
     */
    Message?: string | null;
    /**
     * 扩展Message
     * @type {string}
     * @memberof ResultDataProjectExchangeRateOutput
     */
    Description?: string | null;
    /**
     * 附加数据
     * @type {any}
     * @memberof ResultDataProjectExchangeRateOutput
     */
    Extras?: any | null;
    /**
     * 时间戳
     * @type {number}
     * @memberof ResultDataProjectExchangeRateOutput
     */
    Timestamp?: number;
    /**
     * 
     * @type {ProjectExchangeRateOutput}
     * @memberof ResultDataProjectExchangeRateOutput
     */
    Result?: ProjectExchangeRateOutput;
}


