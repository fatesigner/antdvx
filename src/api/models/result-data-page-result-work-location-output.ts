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


import { PageResultWorkLocationOutput } from './page-result-work-location-output';

/**
 * 
 * @export
 * @interface ResultDataPageResultWorkLocationOutput
 */
export interface ResultDataPageResultWorkLocationOutput {
    /**
     * 状态码
     * @type {number}
     * @memberof ResultDataPageResultWorkLocationOutput
     */
    Code?: number | null;
    /**
     * 是否执行成功
     * @type {boolean}
     * @memberof ResultDataPageResultWorkLocationOutput
     */
    Succeeded?: boolean;
    /**
     * 提示信息或异常信息
     * @type {string}
     * @memberof ResultDataPageResultWorkLocationOutput
     */
    Message?: string | null;
    /**
     * 扩展Message
     * @type {string}
     * @memberof ResultDataPageResultWorkLocationOutput
     */
    Description?: string | null;
    /**
     * 附加数据
     * @type {any}
     * @memberof ResultDataPageResultWorkLocationOutput
     */
    Extras?: any | null;
    /**
     * 时间戳
     * @type {number}
     * @memberof ResultDataPageResultWorkLocationOutput
     */
    Timestamp?: number;
    /**
     * 
     * @type {PageResultWorkLocationOutput}
     * @memberof ResultDataPageResultWorkLocationOutput
     */
    Result?: PageResultWorkLocationOutput;
}

