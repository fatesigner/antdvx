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


import { OrganizaitonOutput } from './organizaiton-output';

/**
 * 分页输出类
 * @export
 * @interface PageResultOrganizaitonOutput
 */
export interface PageResultOrganizaitonOutput {
    /**
     * 页码
     * @type {number}
     * @memberof PageResultOrganizaitonOutput
     */
    PageNo?: number;
    /**
     * 页容量
     * @type {number}
     * @memberof PageResultOrganizaitonOutput
     */
    PageSize?: number;
    /**
     * 总页数
     * @type {number}
     * @memberof PageResultOrganizaitonOutput
     */
    TotalPage?: number;
    /**
     * 总条数
     * @type {number}
     * @memberof PageResultOrganizaitonOutput
     */
    TotalRows?: number;
    /**
     * 当页数据
     * @type {Array<OrganizaitonOutput>}
     * @memberof PageResultOrganizaitonOutput
     */
    Rows?: Array<OrganizaitonOutput> | null;
}

