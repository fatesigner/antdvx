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



/**
 * 输入模型
 * @export
 * @interface ExchangeRateInput
 */
export interface ExchangeRateInput {
    /**
     * Id主键
     * @type {number}
     * @memberof ExchangeRateInput
     */
    ID?: number | null;
    /**
     * 
     * @type {string}
     * @memberof ExchangeRateInput
     */
    ProjectNo?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ExchangeRateInput
     */
    OriginCurrency?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ExchangeRateInput
     */
    DestCurrency?: string | null;
    /**
     * 
     * @type {number}
     * @memberof ExchangeRateInput
     */
    CurrencyRate?: number | null;
    /**
     * 
     * @type {string}
     * @memberof ExchangeRateInput
     */
    CurrencyRateStart?: string;
    /**
     * 
     * @type {string}
     * @memberof ExchangeRateInput
     */
    CurrencyRateEnd?: string | null;
    /**
     * 备用字段1
     * @type {string}
     * @memberof ExchangeRateInput
     */
    Reserved1?: string | null;
}


