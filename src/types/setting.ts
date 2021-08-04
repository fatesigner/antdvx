/**
 *  setting
 *  用于系统风格的配置参数
 */

interface IColor {
  name: string;
  code: string;
}

export interface ISetting<Tlanguage extends string, Ttheme extends string> {
  language: Tlanguage;
  theme: Ttheme;
  color: string;
  colorWeak: boolean;
  colors: IColor[];
}
