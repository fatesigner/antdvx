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


import { ExLogOutput } from './ex-log-output';

/**
 * 分页输出类
 * @export
 * @interface PageResultExLogOutput
 */
export interface PageResultExLogOutput {
    /**
     * 页码
     * @type {number}
     * @memberof PageResultExLogOutput
     */
    PageNo?: number;
    /**
     * 页容量
     * @type {number}
     * @memberof PageResultExLogOutput
     */
    PageSize?: number;
    /**
     * 总页数
     * @type {number}
     * @memberof PageResultExLogOutput
     */
    TotalPage?: number;
    /**
     * 总条数
     * @type {number}
     * @memberof PageResultExLogOutput
     */
    TotalRows?: number;
    /**
     * 当页数据
     * @type {Array<ExLogOutput>}
     * @memberof PageResultExLogOutput
     */
    Rows?: Array<ExLogOutput> | null;
}


