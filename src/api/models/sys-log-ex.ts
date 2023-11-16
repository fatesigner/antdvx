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



/**
 * 异常日志
 * @export
 * @interface SysLogEx
 */
export interface SysLogEx {
    /**
     * 主键Id
     * @type {number}
     * @memberof SysLogEx
     */
    ID?: number;
    /**
     * 操作人
     * @type {string}
     * @memberof SysLogEx
     */
    Account?: string | null;
    /**
     * 操作人
     * @type {string}
     * @memberof SysLogEx
     */
    UserName?: string | null;
    /**
     * 名称
     * @type {string}
     * @memberof SysLogEx
     */
    Name?: string | null;
    /**
     * 类名
     * @type {string}
     * @memberof SysLogEx
     */
    ClassName?: string | null;
    /**
     * 方法名
     * @type {string}
     * @memberof SysLogEx
     */
    MethodName?: string | null;
    /**
     * 异常名称
     * @type {string}
     * @memberof SysLogEx
     */
    ExceptionName?: string | null;
    /**
     * 异常信息
     * @type {string}
     * @memberof SysLogEx
     */
    ExceptionMsg?: string | null;
    /**
     * 异常源
     * @type {string}
     * @memberof SysLogEx
     */
    ExceptionSource?: string | null;
    /**
     * 堆栈信息
     * @type {string}
     * @memberof SysLogEx
     */
    StackTrace?: string | null;
    /**
     * 参数对象
     * @type {string}
     * @memberof SysLogEx
     */
    ParamsObj?: string | null;
    /**
     * 异常时间
     * @type {string}
     * @memberof SysLogEx
     */
    ExceptionTime?: string | null;
}

