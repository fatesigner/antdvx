declare module 'ant-design-vue/es/base' {
  class Base {
    static install(vue: typeof Vue): void;
  }
  export default Base;
}

declare module 'ant-design-vue/es/locale-provider/*' {
  const LocaleMessage: { [key: string]: any };
  export default LocaleMessage;
}
