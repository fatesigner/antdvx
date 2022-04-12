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


import { ProjectScheduleOutput } from './project-schedule-output';

/**
 * 分页输出类
 * @export
 * @interface PageResultProjectScheduleOutput
 */
export interface PageResultProjectScheduleOutput {
    /**
     * 页码
     * @type {number}
     * @memberof PageResultProjectScheduleOutput
     */
    PageNo?: number;
    /**
     * 页容量
     * @type {number}
     * @memberof PageResultProjectScheduleOutput
     */
    PageSize?: number;
    /**
     * 总页数
     * @type {number}
     * @memberof PageResultProjectScheduleOutput
     */
    TotalPage?: number;
    /**
     * 总条数
     * @type {number}
     * @memberof PageResultProjectScheduleOutput
     */
    TotalRows?: number;
    /**
     * 当页数据
     * @type {Array<ProjectScheduleOutput>}
     * @memberof PageResultProjectScheduleOutput
     */
    Rows?: Array<ProjectScheduleOutput> | null;
}


