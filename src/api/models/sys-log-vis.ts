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


import { LoginType } from './login-type';
import { YesOrNot } from './yes-or-not';

/**
 * 访问日志表
 * @export
 * @interface SysLogVis
 */
export interface SysLogVis {
    /**
     * 主键Id
     * @type {number}
     * @memberof SysLogVis
     */
    ID?: number;
    /**
     * 名称
     * @type {string}
     * @memberof SysLogVis
     */
    Name?: string | null;
    /**
     * 
     * @type {YesOrNot}
     * @memberof SysLogVis
     */
    Success?: YesOrNot;
    /**
     * 具体消息
     * @type {string}
     * @memberof SysLogVis
     */
    Message?: string | null;
    /**
     * IP
     * @type {string}
     * @memberof SysLogVis
     */
    Ip?: string | null;
    /**
     * 地址
     * @type {string}
     * @memberof SysLogVis
     */
    Location?: string | null;
    /**
     * 浏览器
     * @type {string}
     * @memberof SysLogVis
     */
    Browser?: string | null;
    /**
     * 操作系统
     * @type {string}
     * @memberof SysLogVis
     */
    Os?: string | null;
    /**
     * 
     * @type {LoginType}
     * @memberof SysLogVis
     */
    VisType?: LoginType;
    /**
     * 访问时间
     * @type {string}
     * @memberof SysLogVis
     */
    VisTime?: string | null;
    /**
     * 访问人
     * @type {string}
     * @memberof SysLogVis
     */
    Account?: string | null;
    /**
     * 访问人
     * @type {string}
     * @memberof SysLogVis
     */
    UserName?: string | null;
}


