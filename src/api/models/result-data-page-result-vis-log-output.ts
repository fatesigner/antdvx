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


import { PageResultVisLogOutput } from './page-result-vis-log-output';

/**
 * 
 * @export
 * @interface ResultDataPageResultVisLogOutput
 */
export interface ResultDataPageResultVisLogOutput {
    /**
     * 状态码
     * @type {number}
     * @memberof ResultDataPageResultVisLogOutput
     */
    Code?: number | null;
    /**
     * 是否执行成功
     * @type {boolean}
     * @memberof ResultDataPageResultVisLogOutput
     */
    Succeeded?: boolean;
    /**
     * 提示信息或异常信息
     * @type {string}
     * @memberof ResultDataPageResultVisLogOutput
     */
    Message?: string | null;
    /**
     * 扩展Message
     * @type {string}
     * @memberof ResultDataPageResultVisLogOutput
     */
    Description?: string | null;
    /**
     * 附加数据
     * @type {any}
     * @memberof ResultDataPageResultVisLogOutput
     */
    Extras?: any | null;
    /**
     * 时间戳
     * @type {number}
     * @memberof ResultDataPageResultVisLogOutput
     */
    Timestamp?: number;
    /**
     * 
     * @type {PageResultVisLogOutput}
     * @memberof ResultDataPageResultVisLogOutput
     */
    Result?: PageResultVisLogOutput;
}


