/**
 * env，定义环境变量参数
 */

export interface IENV {
  // 调试模式
  APP_DEBUG: string;
  // 语言
  APP_LANG: string;
  // 应用名称，唯一 key
  APP_NAME: string;
  // 应用标题（描述）
  APP_TITLE: string;
  // 外网地址
  APP_WEBHOST: string;
  // API 地址
  APP_APIHOST: string;
}
