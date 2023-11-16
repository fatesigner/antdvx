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


import { PageResultProjectCompanyProfileOutput } from './page-result-project-company-profile-output';

/**
 * 
 * @export
 * @interface ResultDataPageResultProjectCompanyProfileOutput
 */
export interface ResultDataPageResultProjectCompanyProfileOutput {
    /**
     * 状态码
     * @type {number}
     * @memberof ResultDataPageResultProjectCompanyProfileOutput
     */
    Code?: number | null;
    /**
     * 是否执行成功
     * @type {boolean}
     * @memberof ResultDataPageResultProjectCompanyProfileOutput
     */
    Succeeded?: boolean;
    /**
     * 提示信息或异常信息
     * @type {string}
     * @memberof ResultDataPageResultProjectCompanyProfileOutput
     */
    Message?: string | null;
    /**
     * 扩展Message
     * @type {string}
     * @memberof ResultDataPageResultProjectCompanyProfileOutput
     */
    Description?: string | null;
    /**
     * 附加数据
     * @type {any}
     * @memberof ResultDataPageResultProjectCompanyProfileOutput
     */
    Extras?: any | null;
    /**
     * 时间戳
     * @type {number}
     * @memberof ResultDataPageResultProjectCompanyProfileOutput
     */
    Timestamp?: number;
    /**
     * 
     * @type {PageResultProjectCompanyProfileOutput}
     * @memberof ResultDataPageResultProjectCompanyProfileOutput
     */
    Result?: PageResultProjectCompanyProfileOutput;
}

