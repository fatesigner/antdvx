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
 * 查询配置输入模型
 * @export
 * @interface QueryConditionInput
 */
export interface QueryConditionInput {
    /**
     * 当前页码
     * @type {number}
     * @memberof QueryConditionInput
     */
    PageNo?: number;
    /**
     * 页码容量
     * @type {number}
     * @memberof QueryConditionInput
     */
    PageSize?: number;
    /**
     * where配置条件json字符串
     * @type {string}
     * @memberof QueryConditionInput
     */
    Content?: string | null;
}

