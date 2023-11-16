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
 * 输出模型
 * @export
 * @interface ExchangeRateOutput
 */
export interface ExchangeRateOutput {
    /**
     * 备用字段1
     * @type {number}
     * @memberof ExchangeRateOutput
     */
    ID?: number;
    /**
     * 备用字段1
     * @type {string}
     * @memberof ExchangeRateOutput
     */
    Reserved1?: string | null;
    /**
     * 更新时间
     * @type {string}
     * @memberof ExchangeRateOutput
     */
    UpdatedTime?: string | null;
    /**
     * 修改者Id
     * @type {string}
     * @memberof ExchangeRateOutput
     */
    UpdatorCode?: string | null;
    /**
     * 修改者名称
     * @type {string}
     * @memberof ExchangeRateOutput
     */
    UpdatorName?: string | null;
    /**
     * 创建时间
     * @type {string}
     * @memberof ExchangeRateOutput
     */
    CreatedTime?: string;
    /**
     * 创建者Id
     * @type {string}
     * @memberof ExchangeRateOutput
     */
    CreatorCode?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ExchangeRateOutput
     */
    ProjectNo?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ExchangeRateOutput
     */
    OriginCurrency?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ExchangeRateOutput
     */
    DestCurrency?: string | null;
    /**
     * 
     * @type {number}
     * @memberof ExchangeRateOutput
     */
    CurrencyRate?: number;
    /**
     * 
     * @type {string}
     * @memberof ExchangeRateOutput
     */
    CurrencyRateStart?: string;
    /**
     * 
     * @type {string}
     * @memberof ExchangeRateOutput
     */
    CurrencyRateEnd?: string | null;
    /**
     * 创建者名称
     * @type {string}
     * @memberof ExchangeRateOutput
     */
    CreatorName?: string | null;
}

