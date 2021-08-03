/**
 * global.d
 */

declare namespace NodeJS {
  interface Global {
    document: Document;
    window: Window;
    navigator: Navigator;
    session: any;
    appSettings: any;
    __VUE_SSR_CONTEXT__: any;
  }
  interface Process {
    __CACHE__: any;
  }
}
