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


import { DisciplineOutput } from './discipline-output';

/**
 * 
 * @export
 * @interface ResultDataListDisciplineOutput
 */
export interface ResultDataListDisciplineOutput {
    /**
     * 状态码
     * @type {number}
     * @memberof ResultDataListDisciplineOutput
     */
    Code?: number | null;
    /**
     * 是否执行成功
     * @type {boolean}
     * @memberof ResultDataListDisciplineOutput
     */
    Succeeded?: boolean;
    /**
     * 提示信息或异常信息
     * @type {string}
     * @memberof ResultDataListDisciplineOutput
     */
    Message?: string | null;
    /**
     * 扩展Message
     * @type {string}
     * @memberof ResultDataListDisciplineOutput
     */
    Description?: string | null;
    /**
     * 附加数据
     * @type {any}
     * @memberof ResultDataListDisciplineOutput
     */
    Extras?: any | null;
    /**
     * 时间戳
     * @type {number}
     * @memberof ResultDataListDisciplineOutput
     */
    Timestamp?: number;
    /**
     * 
     * @type {Array<DisciplineOutput>}
     * @memberof ResultDataListDisciplineOutput
     */
    Result?: Array<DisciplineOutput> | null;
}


