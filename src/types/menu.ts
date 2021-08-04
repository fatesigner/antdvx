/**
 * menu 菜单接口
 */

export interface IMenuLink {
  id: string;
  label: string;
  name?: string;
  url?: string;
  icon?: string;
  level?: number;
  target?: '_blank' | '_system';
  comp?: boolean;
  meta?: {
    hidden?: boolean;
  };
}

export interface IMenu extends IMenuLink {
  disabled?: boolean;
  readonly?: boolean;
  children?: IMenu[] | IMenuLink[];
}
