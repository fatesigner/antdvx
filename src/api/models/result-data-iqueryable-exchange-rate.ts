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


import { ExchangeRate } from './exchange-rate';

/**
 * 
 * @export
 * @interface ResultDataIQueryableExchangeRate
 */
export interface ResultDataIQueryableExchangeRate {
    /**
     * 状态码
     * @type {number}
     * @memberof ResultDataIQueryableExchangeRate
     */
    Code?: number | null;
    /**
     * 是否执行成功
     * @type {boolean}
     * @memberof ResultDataIQueryableExchangeRate
     */
    Succeeded?: boolean;
    /**
     * 提示信息或异常信息
     * @type {string}
     * @memberof ResultDataIQueryableExchangeRate
     */
    Message?: string | null;
    /**
     * 扩展Message
     * @type {string}
     * @memberof ResultDataIQueryableExchangeRate
     */
    Description?: string | null;
    /**
     * 附加数据
     * @type {any}
     * @memberof ResultDataIQueryableExchangeRate
     */
    Extras?: any | null;
    /**
     * 时间戳
     * @type {number}
     * @memberof ResultDataIQueryableExchangeRate
     */
    Timestamp?: number;
    /**
     * 
     * @type {Array<ExchangeRate>}
     * @memberof ResultDataIQueryableExchangeRate
     */
    Result?: Array<ExchangeRate> | null;
}


