/**
 * constants
 * 全局常量（大写和_连字符命名）
 */

import { convertModelArrToEnum } from '@fatesigner/utils';

import { IENV } from '@/app/types/env';
import { CommonStatus } from '@/api/models';

/**
 * environment 环境变量
 * 读取 .env 文件
 */
export const ENV: IENV = {
  APP_DEBUG: process.env.APP_DEBUG,
  APP_LANG: process.env.APP_LANG,
  APP_NAME: process.env.APP_NAME,
  APP_TITLE: process.env.APP_TITLE,
  APP_WEBHOST: process.env.APP_WEBHOST,
  APP_APIHOST: process.env.APP_APIHOST
};

// 定义可用的 ApiHost 集合，用于动态切换服务端环境
export const API_HOSTS = convertModelArrToEnum([
  // 开发环境
  {
    name: 'development',
    value: `${ENV.APP_APIHOST}`,
    text: '开发'
  },
  // 测试环境
  {
    name: 'test',
    value: `${ENV.APP_APIHOST}`,
    text: '测试'
  },
  // 生产环境
  {
    name: 'production',
    value: `${ENV.APP_APIHOST}`,
    text: '生产'
  }
] as const);

// 用户角色
export const ROLES = convertModelArrToEnum([
  {
    value: 0,
    text: 'None',
    name: 'None'
  },
  {
    value: 1,
    text: 'Admin',
    name: 'Admin'
  },
  {
    value: 2,
    text: 'SuperAdmin',
    name: 'SuperAdmin'
  }
] as const);

// 定义排序方式
export const SORTORDS = convertModelArrToEnum([
  {
    value: 'latest',
    text: '最新排序',
    name: 'latest'
  },
  {
    value: 'ASC',
    text: '从低到高',
    name: 'ASC'
  },
  {
    value: 'DESC',
    text: '从高到底',
    name: 'DESC'
  }
] as const);

export const MASTER_DATA_STATUS = convertModelArrToEnum([
  {
    value: 0,
    text: '正常',
    name: 'enable'
  },
  {
    value: 1,
    text: '停用',
    name: 'disabled'
  }
] as const);

/**
 * 定义通用状态
 */
export const COMMON_STATUS = convertModelArrToEnum([
  {
    value: CommonStatus.NUMBER_0,
    text: 'Enabled',
    name: 'enabled'
  },
  {
    value: CommonStatus.NUMBER_1,
    text: 'Disabled',
    name: 'disabled'
  }
] as const);

/**
 * 定义用户性别
 */
export const SEX_STATUS = convertModelArrToEnum([
  {
    value: 1,
    text: 'Male',
    name: 'Male'
  },
  {
    value: 2,
    text: 'Female',
    name: 'Female'
  },
  {
    value: 3,
    text: 'Unknown',
    name: 'Unknown'
  }
] as const);

/**
 * 定义权限类别
 */
export const PERMISSIONS_TYPE = convertModelArrToEnum([
  {
    value: 'System',
    text: 'System',
    name: 'System',
    description: ''
  },
  {
    value: 'Custom',
    text: 'Custom',
    name: 'Custom',
    description: ''
  }
] as const);

/**
 * 定义权限集合
 */
export const PERMISSIONS = convertModelArrToEnum([
  {
    value: 'DiciplineFullAccess',
    text: 'DiciplineFullAccess',
    name: 'DiciplineFullAccess',
    description: ''
  },
  {
    value: 'DiciplineReadonlyAccess',
    text: 'DiciplineReadonlyAccess',
    name: 'DiciplineReadonlyAccess',
    description: ''
  },
  {
    value: 'CompanyInformationFullAccess',
    text: 'CompanyInformationFullAccess',
    name: 'CompanyInformationFullAccess',
    description: ''
  },
  {
    value: 'CompanyInformationReadonlyAccess',
    text: 'CompanyInformationReadonlyAccess',
    name: 'CompanyInformationReadonlyAccess',
    description: ''
  },
  {
    value: 'OrgnizaitonFullAccess',
    text: 'OrgnizaitonFullAccess',
    name: 'OrgnizaitonFullAccess',
    description: ''
  },
  {
    value: 'OrgnizaitonReadonlyAccess',
    text: 'OrgnizaitonReadonlyAccess',
    name: 'OrgnizaitonReadonlyAccess',
    description: ''
  },
  {
    value: 'ExchangeRatesFullAccess',
    text: 'ExchangeRatesFullAccess',
    name: 'ExchangeRatesFullAccess',
    description: ''
  },
  {
    value: 'ExchangeRatesReadonlyAccess',
    text: 'ExchangeRatesReadonlyAccess',
    name: 'ExchangeRatesReadonlyAccess',
    description: ''
  },
  {
    value: 'PositionFullAccess',
    text: 'PositionFullAccess',
    name: 'PositionFullAccess',
    description: ''
  },
  {
    value: 'PositionReadonlyAccess',
    text: 'PositionReadonlyAccess',
    name: 'PositionReadonlyAccess',
    description: ''
  },
  {
    value: 'RolesFullAccess',
    text: 'RolesFullAccess',
    name: 'RolesFullAccess',
    description: ''
  },
  {
    value: 'RolesReadonlyAccess',
    text: 'RolesReadonlyAccess',
    name: 'RolesReadonlyAccess',
    description: ''
  },
  {
    value: 'StaffingPoolFullAccess',
    text: 'StaffingPoolFullAccess',
    name: 'StaffingPoolFullAccess',
    description: ''
  },
  {
    value: 'StaffingPoolReadonlyAccess',
    text: 'StaffingPoolReadonlyAccess',
    name: 'StaffingPoolReadonlyAccess',
    description: ''
  },
  {
    value: 'UserInformationFullAccess',
    text: 'UserInformationFullAccess',
    name: 'UserInformationFullAccess',
    description: ''
  },
  {
    value: 'UserInformationReadonlyAccess',
    text: 'UserInformationReadonlyAccess',
    name: 'UserInformationReadonlyAccess',
    description: ''
  },
  {
    value: 'ProjectOverviewFullAccess',
    text: 'ProjectOverviewFullAccess',
    name: 'ProjectOverviewFullAccess',
    description: ''
  },
  {
    value: 'ProjectOverviewReadonlyAccess',
    text: 'ProjectOverviewReadonlyAccess',
    name: 'ProjectOverviewReadonlyAccess',
    description: ''
  },
  {
    value: 'ProjectMasterDataFullAccess',
    text: 'ProjectMasterDataFullAccess',
    name: 'ProjectMasterDataFullAccess',
    description: ''
  },
  {
    value: 'ProjectMasterDataReadonlyAccess',
    text: 'ProjectMasterDataReadonlyAccess',
    name: 'ProjectMasterDataReadonlyAccess',
    description: ''
  },
  {
    value: 'TravelMasterdataFullAccess',
    text: 'TravelMasterdataFullAccess',
    name: 'TravelMasterdataFullAccess',
    description: ''
  },
  {
    value: 'TravelMasterdataReadonlyAccess',
    text: 'TravelMasterdataReadonlyAccess',
    name: 'TravelMasterdataReadonlyAccess',
    description: ''
  },
  {
    value: 'StaffingPlanFullAccess',
    text: 'StaffingPlanFullAccess',
    name: 'StaffingPlanFullAccess',
    description: ''
  },
  {
    value: 'StaffingPlanReadonlyAccess',
    text: 'StaffingPlanReadonlyAccess',
    name: 'StaffingPlanReadonlyAccess',
    description: ''
  },
  {
    value: 'TravelPlanFullAccess',
    text: 'TravelPlanFullAccess',
    name: 'TravelPlanFullAccess',
    description: ''
  },
  {
    value: 'StaffingPlanReadonlyAccess',
    text: 'StaffingPlanReadonlyAccess',
    name: 'StaffingPlanReadonlyAccess',
    description: ''
  }
] as const);
