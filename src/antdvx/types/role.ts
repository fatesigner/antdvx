import { IMenu } from './menu';

/**
 * 用户角色
 */
export interface IRole<TRoleName extends string = string, TPermission extends string = string> {
  /**
   * 角色 ID
   */
  id: number | string;
  /**
   * 角色名称（需保证唯一性）
   */
  name: TRoleName;
  /**
   * 角色标签，用于界面显示
   */
  label: string;
  /**
   * 角色描述
   */
  description?: string;
  /**
   * 该用户拥有的菜单列表
   */
  menus?: IMenu[];
  /**
   * 该角色拥有的权限列表
   */
  permissions?: TPermission[];
}

/**
 * 获取角色类型中的名称类型
 */
export type NamesTypeOfRole<TRole> = TRole extends IRole<infer A> ? A : string;

/**
 * 获取角色类型中的权限集合类型
 */
export type PermissionTypeOfRole<TRole> = TRole extends IRole<infer A, infer B> ? B : string;
