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
 * 组织医院机构表
 * @export
 * @interface SysOrg
 */
export interface SysOrg {
    /**
     * 主键Id
     * @type {number}
     * @memberof SysOrg
     */
    ID?: number;
    /**
     * 备用字段1
     * @type {string}
     * @memberof SysOrg
     */
    Reserved1?: string | null;
    /**
     * 更新时间
     * @type {string}
     * @memberof SysOrg
     */
    UpdatedTime?: string | null;
    /**
     * 修改者Id
     * @type {string}
     * @memberof SysOrg
     */
    UpdatorCode?: string | null;
    /**
     * 修改者名称
     * @type {string}
     * @memberof SysOrg
     */
    UpdatorName?: string | null;
    /**
     * 创建时间
     * @type {string}
     * @memberof SysOrg
     */
    CreatedTime?: string | null;
    /**
     * 创建者Id
     * @type {string}
     * @memberof SysOrg
     */
    CreatorCode?: string | null;
    /**
     * 创建者名称
     * @type {string}
     * @memberof SysOrg
     */
    CreatorName?: string | null;
    /**
     * 父Id
     * @type {number}
     * @memberof SysOrg
     */
    Pid?: number;
    /**
     * 名称
     * @type {string}
     * @memberof SysOrg
     */
    Name: string;
    /**
     * 编码
     * @type {string}
     * @memberof SysOrg
     */
    Code: string;
    /**
     * 联系人
     * @type {string}
     * @memberof SysOrg
     */
    Contacts?: string | null;
    /**
     * 电话
     * @type {string}
     * @memberof SysOrg
     */
    Tel?: string | null;
    /**
     * 排序
     * @type {number}
     * @memberof SysOrg
     */
    Sort?: number;
    /**
     * 备注
     * @type {string}
     * @memberof SysOrg
     */
    Remark?: string | null;
    /**
     * 
     * @type {CommonStatus}
     * @memberof SysOrg
     */
    Status?: CommonStatus;
}

