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
 * @interface SysQueryConditionCodeInput
 */
export interface SysQueryConditionCodeInput {
    /**
     * 查询界面编号
     * @type {string}
     * @memberof SysQueryConditionCodeInput
     */
    QueryConfigCode?: string | null;
    /**
     * 药师编号(不为空查询当前药师)
     * @type {string}
     * @memberof SysQueryConditionCodeInput
     */
    PharmacistCode?: string | null;
}


