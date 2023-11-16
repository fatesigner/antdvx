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
 * 异常日志参数
 * @export
 * @interface ExLogOutput
 */
export interface ExLogOutput {
    /**
     * 操作人
     * @type {string}
     * @memberof ExLogOutput
     */
    Account?: string | null;
    /**
     * 名称
     * @type {string}
     * @memberof ExLogOutput
     */
    Name?: string | null;
    /**
     * 类名
     * @type {string}
     * @memberof ExLogOutput
     */
    ClassName?: string | null;
    /**
     * 方法名
     * @type {string}
     * @memberof ExLogOutput
     */
    MethodName?: string | null;
    /**
     * 异常名称
     * @type {string}
     * @memberof ExLogOutput
     */
    ExceptionName?: string | null;
    /**
     * 异常信息
     * @type {string}
     * @memberof ExLogOutput
     */
    ExceptionMsg?: string | null;
    /**
     * 异常时间
     * @type {string}
     * @memberof ExLogOutput
     */
    ExceptionTime?: string | null;
}

