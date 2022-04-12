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


import { NoticeStatus } from './notice-status';
import { NoticeType } from './notice-type';

/**
 * 通知公告输入模型
 * @export
 * @interface SysNoticeInput
 */
export interface SysNoticeInput {
    /**
     * 主键
     * @type {number}
     * @memberof SysNoticeInput
     */
    ID?: number;
    /**
     * 标题
     * @type {string}
     * @memberof SysNoticeInput
     */
    Title: string;
    /**
     * 内容
     * @type {string}
     * @memberof SysNoticeInput
     */
    Content: string;
    /**
     * 
     * @type {NoticeType}
     * @memberof SysNoticeInput
     */
    Type: NoticeType;
    /**
     * 
     * @type {NoticeStatus}
     * @memberof SysNoticeInput
     */
    Status: NoticeStatus;
    /**
     * 通知到的人
     * @type {Array<string>}
     * @memberof SysNoticeInput
     */
    NoticeUserCodeList: Array<string>;
}


