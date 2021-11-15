/**
 * window.d
 */

interface Window {
  APP_SETTINGS: {
    Name: string;
    ASPNETCORE_PATHBASE: string;
    ApiHost: string;
    RequestVerificationToken: string;
    ENV_DEBUG: boolean;
    ENV_DEV: boolean;
  };
  ActiveXObject: any;
  module: any;
  navigator: any;
  webkitURL: any;
  imagePicker: any;
  resolveLocalFileSystemURL: any;
  requestIdleCallback: any;
  __INITIAL_ENV__: any;
  __INITIAL_STATE__: any;
  process: {
    BROWSER: boolean;
    NODE_ENV: boolean;
    VUE_ENV: boolean;
  };
}

interface Navigator {
  camera: any;
  connection: any;
  notification: any;
  webkitGetUserMedia: any;
  mozGetUserMedia: any;
}

declare let require: any;

declare let System: any;

declare const window: Window;

declare const module: any;

declare const ActiveXObject: Window.ActiveXObject;

declare const navigator: Window.navigator;

declare const webkitURL: Window.webkitURL;

declare const imagePicker: Window.imagePicker;

declare const resolveLocalFileSystemURL: Window.resolveLocalFileSystemURL;

declare const requestIdleCallback: Window.requestIdleCallback;

declare const __INITIAL_ENV__: Window.__INITIAL_ENV__;

declare const __INITIAL_STATE__: Window.__INITIAL_STATE__;

declare const process: Window.process;

declare const global: any;
