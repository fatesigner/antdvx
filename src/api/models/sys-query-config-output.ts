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


import { QueryInput } from './query-input';
import { QueryOutput } from './query-output';

/**
 * 查询配置输出模型
 * @export
 * @interface SysQueryConfigOutput
 */
export interface SysQueryConfigOutput {
    /**
     * 备用字段1
     * @type {number}
     * @memberof SysQueryConfigOutput
     */
    ID?: number;
    /**
     * 备用字段1
     * @type {string}
     * @memberof SysQueryConfigOutput
     */
    Reserved1?: string | null;
    /**
     * 更新时间
     * @type {string}
     * @memberof SysQueryConfigOutput
     */
    UpdatedTime?: string | null;
    /**
     * 修改者Id
     * @type {string}
     * @memberof SysQueryConfigOutput
     */
    UpdatorCode?: string | null;
    /**
     * 修改者名称
     * @type {string}
     * @memberof SysQueryConfigOutput
     */
    UpdatorName?: string | null;
    /**
     * 创建时间
     * @type {string}
     * @memberof SysQueryConfigOutput
     */
    CreatedTime?: string | null;
    /**
     * 创建者Id
     * @type {string}
     * @memberof SysQueryConfigOutput
     */
    CreatorCode?: string | null;
    /**
     * 创建者名称
     * @type {string}
     * @memberof SysQueryConfigOutput
     */
    CreatorName?: string | null;
    /**
     * 名称
     * @type {string}
     * @memberof SysQueryConfigOutput
     */
    Name?: string | null;
    /**
     * 编码
     * @type {string}
     * @memberof SysQueryConfigOutput
     */
    Code?: string | null;
    /**
     * 描述
     * @type {string}
     * @memberof SysQueryConfigOutput
     */
    Text?: string | null;
    /**
     * 是否启用病区权限
     * @type {boolean}
     * @memberof SysQueryConfigOutput
     */
    IsEnableWardPermission?: boolean;
    /**
     * 是否显示
     * @type {boolean}
     * @memberof SysQueryConfigOutput
     */
    IsShow?: boolean;
    /**
     * 来源表
     * @type {string}
     * @memberof SysQueryConfigOutput
     */
    SourceTable?: string | null;
    /**
     * 查询字段配置
     * @type {string}
     * @memberof SysQueryConfigOutput
     */
    InputJson?: string | null;
    /**
     * 查询字段配置
     * @type {Array<QueryInput>}
     * @memberof SysQueryConfigOutput
     */
    InputList?: Array<QueryInput> | null;
    /**
     * 输出字段配置
     * @type {string}
     * @memberof SysQueryConfigOutput
     */
    OutputJson?: string | null;
    /**
     * 查询字段配置
     * @type {Array<QueryOutput>}
     * @memberof SysQueryConfigOutput
     */
    OutputList?: Array<QueryOutput> | null;
}


