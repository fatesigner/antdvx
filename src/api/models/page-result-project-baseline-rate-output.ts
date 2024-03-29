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


import { ProjectBaselineRateOutput } from './project-baseline-rate-output';

/**
 * 分页输出类
 * @export
 * @interface PageResultProjectBaselineRateOutput
 */
export interface PageResultProjectBaselineRateOutput {
    /**
     * 页码
     * @type {number}
     * @memberof PageResultProjectBaselineRateOutput
     */
    PageNo?: number;
    /**
     * 页容量
     * @type {number}
     * @memberof PageResultProjectBaselineRateOutput
     */
    PageSize?: number;
    /**
     * 总页数
     * @type {number}
     * @memberof PageResultProjectBaselineRateOutput
     */
    TotalPage?: number;
    /**
     * 总条数
     * @type {number}
     * @memberof PageResultProjectBaselineRateOutput
     */
    TotalRows?: number;
    /**
     * 当页数据
     * @type {Array<ProjectBaselineRateOutput>}
     * @memberof PageResultProjectBaselineRateOutput
     */
    Rows?: Array<ProjectBaselineRateOutput> | null;
}


