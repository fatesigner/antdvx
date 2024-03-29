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


import { QueryConditionTree } from './query-condition-tree';

/**
 * 
 * @export
 * @interface ResultDataQueryConditionTree
 */
export interface ResultDataQueryConditionTree {
    /**
     * 状态码
     * @type {number}
     * @memberof ResultDataQueryConditionTree
     */
    Code?: number | null;
    /**
     * 是否执行成功
     * @type {boolean}
     * @memberof ResultDataQueryConditionTree
     */
    Succeeded?: boolean;
    /**
     * 提示信息或异常信息
     * @type {string}
     * @memberof ResultDataQueryConditionTree
     */
    Message?: string | null;
    /**
     * 扩展Message
     * @type {string}
     * @memberof ResultDataQueryConditionTree
     */
    Description?: string | null;
    /**
     * 附加数据
     * @type {any}
     * @memberof ResultDataQueryConditionTree
     */
    Extras?: any | null;
    /**
     * 时间戳
     * @type {number}
     * @memberof ResultDataQueryConditionTree
     */
    Timestamp?: number;
    /**
     * 
     * @type {QueryConditionTree}
     * @memberof ResultDataQueryConditionTree
     */
    Result?: QueryConditionTree;
}


