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


import { PhaseObject } from './phase-object';

/**
 * ProjectScheduleExInput输入模型
 * @export
 * @interface ProjectScheduleExInput
 */
export interface ProjectScheduleExInput {
    /**
     * 
     * @type {string}
     * @memberof ProjectScheduleExInput
     */
    ProjectNO?: string | null;
    /**
     * 
     * @type {Array<PhaseObject>}
     * @memberof ProjectScheduleExInput
     */
    Phases?: Array<PhaseObject> | null;
}


