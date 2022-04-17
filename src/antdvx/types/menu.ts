import { UnknownType } from '@fatesigner/utils/types';

/**
 * 子菜单类型
 */
export interface IMenu<TMeta extends UnknownType = never> {
  /**
   * 菜单 ID（主键，需保证唯一性）
   */
  id: number | string;
  /**
   * 路由名称，与 App Route 关联，需保证唯一性
   */
  name?: string;
  /**
   * 菜单标签，用于界面显示
   */
  label: string;
  /**
   * 链接地址
   */
  url?: string;
  /**
   * 图标
   */
  icon?: string;
  /**
   * 规定在何处打开链接，_blank、_self、_parent、_top
   */
  target?: '_blank' | '_self' | '_parent' | '_top';
  /**
   * 禁用
   */
  disabled?: boolean;
  /**
   * 只读
   */
  readonly?: boolean;
  /**
   * 是否隐藏
   */
  hidden?: boolean;
  /**
   * 子菜单
   */
  children?: IMenu[];
  /**
   * 附加的任意数据
   */
  meta?: TMeta;
}
