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


import { PageResultOrganizaitonOutput } from './page-result-organizaiton-output';

/**
 * 
 * @export
 * @interface ResultDataPageResultOrganizaitonOutput
 */
export interface ResultDataPageResultOrganizaitonOutput {
    /**
     * 状态码
     * @type {number}
     * @memberof ResultDataPageResultOrganizaitonOutput
     */
    Code?: number | null;
    /**
     * 是否执行成功
     * @type {boolean}
     * @memberof ResultDataPageResultOrganizaitonOutput
     */
    Succeeded?: boolean;
    /**
     * 提示信息或异常信息
     * @type {string}
     * @memberof ResultDataPageResultOrganizaitonOutput
     */
    Message?: string | null;
    /**
     * 扩展Message
     * @type {string}
     * @memberof ResultDataPageResultOrganizaitonOutput
     */
    Description?: string | null;
    /**
     * 附加数据
     * @type {any}
     * @memberof ResultDataPageResultOrganizaitonOutput
     */
    Extras?: any | null;
    /**
     * 时间戳
     * @type {number}
     * @memberof ResultDataPageResultOrganizaitonOutput
     */
    Timestamp?: number;
    /**
     * 
     * @type {PageResultOrganizaitonOutput}
     * @memberof ResultDataPageResultOrganizaitonOutput
     */
    Result?: PageResultOrganizaitonOutput;
}


