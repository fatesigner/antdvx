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


import { ProjectCompanyProfile } from './project-company-profile';

/**
 * 
 * @export
 * @interface ResultDataIQueryableProjectCompanyProfile
 */
export interface ResultDataIQueryableProjectCompanyProfile {
    /**
     * 状态码
     * @type {number}
     * @memberof ResultDataIQueryableProjectCompanyProfile
     */
    Code?: number | null;
    /**
     * 是否执行成功
     * @type {boolean}
     * @memberof ResultDataIQueryableProjectCompanyProfile
     */
    Succeeded?: boolean;
    /**
     * 提示信息或异常信息
     * @type {string}
     * @memberof ResultDataIQueryableProjectCompanyProfile
     */
    Message?: string | null;
    /**
     * 扩展Message
     * @type {string}
     * @memberof ResultDataIQueryableProjectCompanyProfile
     */
    Description?: string | null;
    /**
     * 附加数据
     * @type {any}
     * @memberof ResultDataIQueryableProjectCompanyProfile
     */
    Extras?: any | null;
    /**
     * 时间戳
     * @type {number}
     * @memberof ResultDataIQueryableProjectCompanyProfile
     */
    Timestamp?: number;
    /**
     * 
     * @type {Array<ProjectCompanyProfile>}
     * @memberof ResultDataIQueryableProjectCompanyProfile
     */
    Result?: Array<ProjectCompanyProfile> | null;
}


