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
 * 输入模型
 * @export
 * @interface DisciplineInput
 */
export interface DisciplineInput {
    /**
     * Id主键
     * @type {number}
     * @memberof DisciplineInput
     */
    ID?: number | null;
    /**
     * 
     * @type {string}
     * @memberof DisciplineInput
     */
    DisciplineCode?: string | null;
    /**
     * 
     * @type {string}
     * @memberof DisciplineInput
     */
    MainDicipline?: string | null;
    /**
     * 
     * @type {string}
     * @memberof DisciplineInput
     */
    DisciplineWbs?: string | null;
    /**
     * 
     * @type {string}
     * @memberof DisciplineInput
     */
    SubDiscipline?: string | null;
    /**
     * 备用字段1
     * @type {string}
     * @memberof DisciplineInput
     */
    Reserved1?: string | null;
}


