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


import { CommonStatus } from './common-status';

/**
 * 参数配置表
 * @export
 * @interface SysConfig
 */
export interface SysConfig {
    /**
     * 备用字段1
     * @type {string}
     * @memberof SysConfig
     */
    Reserved1?: string | null;
    /**
     * 更新时间
     * @type {string}
     * @memberof SysConfig
     */
    UpdatedTime?: string | null;
    /**
     * 修改者Id
     * @type {string}
     * @memberof SysConfig
     */
    UpdatorCode?: string | null;
    /**
     * 修改者名称
     * @type {string}
     * @memberof SysConfig
     */
    UpdatorName?: string | null;
    /**
     * 创建时间
     * @type {string}
     * @memberof SysConfig
     */
    CreatedTime?: string | null;
    /**
     * 创建者Id
     * @type {string}
     * @memberof SysConfig
     */
    CreatorCode?: string | null;
    /**
     * 创建者名称
     * @type {string}
     * @memberof SysConfig
     */
    CreatorName?: string | null;
    /**
     * 主键Id
     * @type {number}
     * @memberof SysConfig
     */
    ID?: number;
    /**
     * 名称
     * @type {string}
     * @memberof SysConfig
     */
    Name: string;
    /**
     * 编码
     * @type {string}
     * @memberof SysConfig
     */
    Code: string;
    /**
     * 属性值
     * @type {string}
     * @memberof SysConfig
     */
    Value?: string | null;
    /**
     * 是否是系统参数（Y-是，N-否）
     * @type {string}
     * @memberof SysConfig
     */
    SysFlag?: string | null;
    /**
     * 备注
     * @type {string}
     * @memberof SysConfig
     */
    Remark?: string | null;
    /**
     * 
     * @type {CommonStatus}
     * @memberof SysConfig
     */
    Status?: CommonStatus;
    /**
     * 常量所属分类的编码，来自于“常量的分类”字典
     * @type {string}
     * @memberof SysConfig
     */
    GroupCode?: string | null;
}

