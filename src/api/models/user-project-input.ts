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
 * 用户授权项目
 * @export
 * @interface UserProjectInput
 */
export interface UserProjectInput {
    /**
     * 用户Id
     * @type {number}
     * @memberof UserProjectInput
     */
    SysUserId?: number;
    /**
     * 集合Id,来源于ProjectOverview表
     * @type {Array<number>}
     * @memberof UserProjectInput
     */
    ProjectIds?: Array<number> | null;
}


