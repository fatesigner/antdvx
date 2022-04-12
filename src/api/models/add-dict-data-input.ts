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
 * 
 * @export
 * @interface AddDictDataInput
 */
export interface AddDictDataInput {
    /**
     * 字典类型Id
     * @type {number}
     * @memberof AddDictDataInput
     */
    TypeId: number;
    /**
     * 值
     * @type {string}
     * @memberof AddDictDataInput
     */
    Value: string;
    /**
     * 编码
     * @type {string}
     * @memberof AddDictDataInput
     */
    Code: string;
    /**
     * 排序
     * @type {number}
     * @memberof AddDictDataInput
     */
    Sort?: number;
    /**
     * 备注
     * @type {string}
     * @memberof AddDictDataInput
     */
    Remark?: string | null;
    /**
     * 启用状态
     * @type {boolean}
     * @memberof AddDictDataInput
     */
    EnabledStatus?: boolean;
}


