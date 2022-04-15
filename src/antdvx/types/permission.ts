/**
 * 操作权限
 */
export interface IPermission {
  /**
   * 权限 ID（主键，需保证唯一性）
   */
  id: number | string;
  /**
   * 权限名称（需保证唯一性）
   */
  name: string;
  /**
   * 权限标签，用于界面显示
   */
  label: string;
  /**
   * 权限描述
   */
  description?: string;
}
