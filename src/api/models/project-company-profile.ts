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
 * ProjectCompanyProfile
 * @export
 * @interface ProjectCompanyProfile
 */
export interface ProjectCompanyProfile {
    /**
     * 备用字段1
     * @type {string}
     * @memberof ProjectCompanyProfile
     */
    Reserved1?: string | null;
    /**
     * 更新时间
     * @type {string}
     * @memberof ProjectCompanyProfile
     */
    UpdatedTime?: string | null;
    /**
     * 修改者Id
     * @type {string}
     * @memberof ProjectCompanyProfile
     */
    UpdatorCode?: string | null;
    /**
     * 修改者名称
     * @type {string}
     * @memberof ProjectCompanyProfile
     */
    UpdatorName?: string | null;
    /**
     * 创建时间
     * @type {string}
     * @memberof ProjectCompanyProfile
     */
    CreatedTime?: string | null;
    /**
     * 创建者Id
     * @type {string}
     * @memberof ProjectCompanyProfile
     */
    CreatorCode?: string | null;
    /**
     * 创建者名称
     * @type {string}
     * @memberof ProjectCompanyProfile
     */
    CreatorName?: string | null;
    /**
     * 主键Id
     * @type {number}
     * @memberof ProjectCompanyProfile
     */
    ID?: number;
    /**
     * 项目编号
     * @type {string}
     * @memberof ProjectCompanyProfile
     */
    ProjectNo?: string | null;
    /**
     * 来源于Tool Master 里CompanyInformation
     * @type {string}
     * @memberof ProjectCompanyProfile
     */
    CompanyCode?: string | null;
    /**
     * 小数四位精度
     * @type {number}
     * @memberof ProjectCompanyProfile
     */
    MarkUpRate?: number;
    /**
     * DisciplineCode
     * @type {string}
     * @memberof ProjectCompanyProfile
     */
    DisciplineCode?: string | null;
    /**
     * 前台显示
     * @type {string}
     * @memberof ProjectCompanyProfile
     */
    MainDicipline?: string | null;
    /**
     * monthly working hours
     * @type {number}
     * @memberof ProjectCompanyProfile
     */
    MonthlyWorkingHours?: number;
    /**
     * 小数四位精度
     * @type {number}
     * @memberof ProjectCompanyProfile
     */
    Abs?: number;
    /**
     * abs. with Start
     * @type {string}
     * @memberof ProjectCompanyProfile
     */
    Start?: string;
    /**
     * 
     * @type {string}
     * @memberof ProjectCompanyProfile
     */
    End?: string;
    /**
     * 项目币种 ProjectCurrency/CompanyCurrency 来源于 Exchange Rates表中的Origin Currency/Dest Currency
     * @type {string}
     * @memberof ProjectCompanyProfile
     */
    ProjectCurrency?: string | null;
    /**
     * 币种汇率来源于Exchange Rates表中的Currency Rate
     * @type {number}
     * @memberof ProjectCompanyProfile
     */
    ExchangeRate?: number;
}


