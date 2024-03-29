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


import { Condition } from './condition';
import { LoginType } from './login-type';
import { YesOrNot } from './yes-or-not';

/**
 * 访问日志参数
 * @export
 * @interface VisLogPageInput
 */
export interface VisLogPageInput {
    /**
     * 当前页码
     * @type {number}
     * @memberof VisLogPageInput
     */
    PageNo?: number;
    /**
     * 页码容量
     * @type {number}
     * @memberof VisLogPageInput
     */
    PageSize?: number;
    /**
     * 搜索值
     * @type {string}
     * @memberof VisLogPageInput
     */
    SearchValue?: string | null;
    /**
     * 搜索开始时间
     * @type {string}
     * @memberof VisLogPageInput
     */
    SearchBeginTime?: string | null;
    /**
     * 搜索结束时间
     * @type {string}
     * @memberof VisLogPageInput
     */
    SearchEndTime?: string | null;
    /**
     * 排序字段
     * @type {string}
     * @memberof VisLogPageInput
     */
    SortField?: string | null;
    /**
     * 排序方法,默认升序,否则降序(配合antd前端,约定参数为 Ascend,Dscend)
     * @type {string}
     * @memberof VisLogPageInput
     */
    SortOrder?: string | null;
    /**
     * 降序排序(约定参数 ascend,dscend)默认dscend
     * @type {string}
     * @memberof VisLogPageInput
     */
    DescStr?: string | null;
    /**
     * 复杂查询条件
     * @type {Array<Condition>}
     * @memberof VisLogPageInput
     */
    SearchParameters?: Array<Condition> | null;
    /**
     * 名称
     * @type {string}
     * @memberof VisLogPageInput
     */
    Name?: string | null;
    /**
     * 
     * @type {YesOrNot}
     * @memberof VisLogPageInput
     */
    Success?: YesOrNot;
    /**
     * 
     * @type {LoginType}
     * @memberof VisLogPageInput
     */
    VisType?: LoginType;
}


