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


import { NoticeUserStatus } from './notice-user-status';

/**
 * 通知到的用户阅读信息
 * @export
 * @interface NoticeUserRead
 */
export interface NoticeUserRead {
    /**
     * 用户Code
     * @type {string}
     * @memberof NoticeUserRead
     */
    UserCode?: string | null;
    /**
     * 用户名称
     * @type {string}
     * @memberof NoticeUserRead
     */
    UserName?: string | null;
    /**
     * 
     * @type {NoticeUserStatus}
     * @memberof NoticeUserRead
     */
    ReadStatus?: NoticeUserStatus;
    /**
     * 阅读时间
     * @type {string}
     * @memberof NoticeUserRead
     */
    ReadTime?: string | null;
}


