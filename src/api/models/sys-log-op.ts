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


import { YesOrNot } from './yes-or-not';

/**
 * 操作日志表
 * @export
 * @interface SysLogOp
 */
export interface SysLogOp {
    /**
     * 主键Id
     * @type {number}
     * @memberof SysLogOp
     */
    ID?: number;
    /**
     * 名称
     * @type {string}
     * @memberof SysLogOp
     */
    Name?: string | null;
    /**
     * 
     * @type {YesOrNot}
     * @memberof SysLogOp
     */
    Success?: YesOrNot;
    /**
     * 具体消息
     * @type {string}
     * @memberof SysLogOp
     */
    Message?: string | null;
    /**
     * IP
     * @type {string}
     * @memberof SysLogOp
     */
    Ip?: string | null;
    /**
     * 地址
     * @type {string}
     * @memberof SysLogOp
     */
    Location?: string | null;
    /**
     * 浏览器
     * @type {string}
     * @memberof SysLogOp
     */
    Browser?: string | null;
    /**
     * 操作系统
     * @type {string}
     * @memberof SysLogOp
     */
    Os?: string | null;
    /**
     * 请求地址
     * @type {string}
     * @memberof SysLogOp
     */
    Url?: string | null;
    /**
     * 类名称
     * @type {string}
     * @memberof SysLogOp
     */
    ClassName?: string | null;
    /**
     * 方法名称
     * @type {string}
     * @memberof SysLogOp
     */
    MethodName?: string | null;
    /**
     * 请求方式（GET POST PUT DELETE)
     * @type {string}
     * @memberof SysLogOp
     */
    ReqMethod?: string | null;
    /**
     * 请求参数
     * @type {string}
     * @memberof SysLogOp
     */
    Param?: string | null;
    /**
     * 返回结果
     * @type {string}
     * @memberof SysLogOp
     */
    Result?: string | null;
    /**
     * 耗时（毫秒）
     * @type {number}
     * @memberof SysLogOp
     */
    ElapsedTime?: number;
    /**
     * 操作时间
     * @type {string}
     * @memberof SysLogOp
     */
    OpTime?: string | null;
    /**
     * 操作人
     * @type {string}
     * @memberof SysLogOp
     */
    Account?: string | null;
    /**
     * 操作人
     * @type {string}
     * @memberof SysLogOp
     */
    UserName?: string | null;
}


