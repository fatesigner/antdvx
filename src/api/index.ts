import { httpService } from '@/app/core/services';
import { BasicDataApi, CompanyInformationApi, DictDataConfigApi, DisciplineApi, FileApi, ImApi, LogApi, LoginApi, OrganizaitonApi, ProjectBaselineRateApi, ProjectCompanyProfileApi, ProjectExchangeRateApi, ProjectOverviewApi, ProjectPositionApi, ProjectScheduleApi, ProjectTravelMasterDataApi, SendMessageApi, StaffingPlanApi, StaffingPlanDetailApi, StaffingPoolApi, SysConfigApi, SysDictDataApi, SysDictTypeApi, SysNoticeApi, SysOnlineUserApi, SysOrgApi, SysPermissionApi, SysQueryConfigApi, SysRoleApi, SysUserApi, SysUserProjectApi, WorkLocationApi } from './api';
export const basicDataApi = new BasicDataApi(null, '', httpService as any);
export const companyInformationApi = new CompanyInformationApi(null, '', httpService as any);
export const dictDataConfigApi = new DictDataConfigApi(null, '', httpService as any);
export const disciplineApi = new DisciplineApi(null, '', httpService as any);
export const fileApi = new FileApi(null, '', httpService as any);
export const imApi = new ImApi(null, '', httpService as any);
export const logApi = new LogApi(null, '', httpService as any);
export const loginApi = new LoginApi(null, '', httpService as any);
export const organizaitonApi = new OrganizaitonApi(null, '', httpService as any);
export const projectBaselineRateApi = new ProjectBaselineRateApi(null, '', httpService as any);
export const projectCompanyProfileApi = new ProjectCompanyProfileApi(null, '', httpService as any);
export const projectExchangeRateApi = new ProjectExchangeRateApi(null, '', httpService as any);
export const projectOverviewApi = new ProjectOverviewApi(null, '', httpService as any);
export const projectPositionApi = new ProjectPositionApi(null, '', httpService as any);
export const projectScheduleApi = new ProjectScheduleApi(null, '', httpService as any);
export const projectTravelMasterDataApi = new ProjectTravelMasterDataApi(null, '', httpService as any);
export const sendMessageApi = new SendMessageApi(null, '', httpService as any);
export const staffingPlanApi = new StaffingPlanApi(null, '', httpService as any);
export const staffingPlanDetailApi = new StaffingPlanDetailApi(null, '', httpService as any);
export const staffingPoolApi = new StaffingPoolApi(null, '', httpService as any);
export const sysConfigApi = new SysConfigApi(null, '', httpService as any);
export const sysDictDataApi = new SysDictDataApi(null, '', httpService as any);
export const sysDictTypeApi = new SysDictTypeApi(null, '', httpService as any);
export const sysNoticeApi = new SysNoticeApi(null, '', httpService as any);
export const sysOnlineUserApi = new SysOnlineUserApi(null, '', httpService as any);
export const sysOrgApi = new SysOrgApi(null, '', httpService as any);
export const sysPermissionApi = new SysPermissionApi(null, '', httpService as any);
export const sysQueryConfigApi = new SysQueryConfigApi(null, '', httpService as any);
export const sysRoleApi = new SysRoleApi(null, '', httpService as any);
export const sysUserApi = new SysUserApi(null, '', httpService as any);
export const sysUserProjectApi = new SysUserProjectApi(null, '', httpService as any);
export const workLocationApi = new WorkLocationApi(null, '', httpService as any);
