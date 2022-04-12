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
 * ProjectTravelMasterData
 * @export
 * @interface ProjectTravelMasterData
 */
export interface ProjectTravelMasterData {
    /**
     * 备用字段1
     * @type {string}
     * @memberof ProjectTravelMasterData
     */
    Reserved1?: string | null;
    /**
     * 更新时间
     * @type {string}
     * @memberof ProjectTravelMasterData
     */
    UpdatedTime?: string | null;
    /**
     * 修改者Id
     * @type {string}
     * @memberof ProjectTravelMasterData
     */
    UpdatorCode?: string | null;
    /**
     * 修改者名称
     * @type {string}
     * @memberof ProjectTravelMasterData
     */
    UpdatorName?: string | null;
    /**
     * 创建时间
     * @type {string}
     * @memberof ProjectTravelMasterData
     */
    CreatedTime?: string | null;
    /**
     * 创建者Id
     * @type {string}
     * @memberof ProjectTravelMasterData
     */
    CreatorCode?: string | null;
    /**
     * 创建者名称
     * @type {string}
     * @memberof ProjectTravelMasterData
     */
    CreatorName?: string | null;
    /**
     * 主键Id
     * @type {number}
     * @memberof ProjectTravelMasterData
     */
    ID?: number;
    /**
     * 项目编号
     * @type {string}
     * @memberof ProjectTravelMasterData
     */
    ProjectNo?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ProjectTravelMasterData
     */
    Description?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ProjectTravelMasterData
     */
    TravelCategory?: string | null;
    /**
     * 来源于Tool Master 里CompanyInformation
     * @type {string}
     * @memberof ProjectTravelMasterData
     */
    CompanyCode?: string | null;
    /**
     * Location Departure   差旅出发地
     * @type {string}
     * @memberof ProjectTravelMasterData
     */
    LocationDeparture?: string | null;
    /**
     * Location Arrival   差旅目的地
     * @type {string}
     * @memberof ProjectTravelMasterData
     */
    LocationArrival?: string | null;
    /**
     * Nr of Trips    机票数
     * @type {number}
     * @memberof ProjectTravelMasterData
     */
    NrOfTrips?: number;
    /**
     * 小数2位精度   每张机票钱
     * @type {number}
     * @memberof ProjectTravelMasterData
     */
    CostPerTrip?: number;
    /**
     * Nr of days   出差天数
     * @type {number}
     * @memberof ProjectTravelMasterData
     */
    NrOfDays?: number;
    /**
     * Daily expenses (e.g. accomodation / allowance)     日常补助
     * @type {number}
     * @memberof ProjectTravelMasterData
     */
    DailyExpenses?: number;
    /**
     * Others (e.g. visa)  其他报销开支
     * @type {number}
     * @memberof ProjectTravelMasterData
     */
    Others?: number;
    /**
     * LC/sum roundtrip   差旅总费用
     * @type {number}
     * @memberof ProjectTravelMasterData
     */
    LcSum?: number;
    /**
     * 公司币种  从Companyinfo从取 local Currency
     * @type {string}
     * @memberof ProjectTravelMasterData
     */
    CompanyCurrency?: string | null;
    /**
     * 汇率   项目币种:公司币种
     * @type {number}
     * @memberof ProjectTravelMasterData
     */
    ExchangeRate?: number;
    /**
     * PC/LC   项目币种/公司币种
     * @type {string}
     * @memberof ProjectTravelMasterData
     */
    PcLc?: string | null;
    /**
     * 差旅总费用
     * @type {number}
     * @memberof ProjectTravelMasterData
     */
    ProjectTripCost?: number;
}


