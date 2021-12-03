/**
 * inversify（IOC/DI）
 * IOC 容器，注入 APP 依赖
 */

import { Container, ContainerModule } from 'inversify';
import { isString } from '@fatesigner/utils/type-check';
import {
  ANTDVX_SYMBOLS,
  AuthService,
  AuthServiceConfig,
  HttpService,
  HttpServiceConfig,
  IAuthService,
  IHttpService,
  ISessionService,
  IStorageService,
  SessionService,
  SessionServiceConfig,
  StorageService
} from '@/antdvx';

import { IUser } from '@/app/types/user';
import { RouteMeta } from '@/app/types/route';
import { i18n, i18nMessages } from '@/app/i18n';
import { ENV, ROLES } from '@/app/core/constants';
import { login$, logout$, roleChanged$ } from '@/app/core/events';

// 定义服务类型
export type SessionServiceType = ISessionService<IUser<typeof ROLES.keys>, typeof ROLES.keys>;
export type AuthServiceType = IAuthService<IUser<typeof ROLES.keys>, typeof ROLES.keys, RouteMeta<typeof ROLES.keys>>;

// 新建 IOC 容器
const appDIC = new Container({ defaultScope: 'Singleton' });

const antdvxModule = new ContainerModule((bind) => {
  // StorageService
  bind(ANTDVX_SYMBOLS.STORAGE_SERVICE_IDENTIFICATION).toConstantValue(ENV.APP_NAME);
  bind<IStorageService>(ANTDVX_SYMBOLS.STORAGE_SERVICE).to(StorageService);

  // SessionService
  bind<SessionServiceConfig<IUser<typeof ROLES.keys>, typeof ROLES.keys>>(ANTDVX_SYMBOLS.SESSION_SERVICE_CONFIG).toConstantValue({
    // 用户登录
    onLogin(user) {
      login$.emit(user);
    },
    onLogout(res) {
      logout$.emit(res);
    },
    onRoleChanged(roles) {
      roleChanged$.emit(roles);
    },
    getUserModel() {
      return {
        username: '',
        nickname: '',
        password: '',
        privileges: null,
        roles: [],
        avatar: '',
        usercode: '',
        realname: '',
        tokenType: '',
        accessToken: '',
        accessTokenFull: '',
        refreshToken: '',
        tokenExpirationTime: 0,
        menus: [],
        permissions: []
      };
    }
  });
  bind<SessionServiceType>(ANTDVX_SYMBOLS.SESSION_SERVICE).to(SessionService);

  // AuthService
  bind<AuthServiceConfig<typeof ROLES.keys>>(ANTDVX_SYMBOLS.AUTH_SERVICE_CONFIG).toConstantValue({
    // 主页地址
    homePage: 'portal',
    // 授权界面地址 name
    authPage: 'login',
    // 授权认证模式
    authMode: 'client',
    // 是否开启重定向模式，登出后将暂存当前地址，登录后重定向至该地址
    redirectEnable: false,
    // 超级管理员角色，该角色将会跳过认证
    superRole: ['admin']
  });
  bind<AuthServiceType>(ANTDVX_SYMBOLS.AUTH_SERVICE).to(AuthService);

  // HttpService
  bind<HttpServiceConfig>(ANTDVX_SYMBOLS.HTTP_SERVICE_CONFIG).toDynamicValue((context) => {
    const sessionService = context.container.get<SessionServiceType>(ANTDVX_SYMBOLS.SESSION_SERVICE);
    return {
      baseURL: ENV.APP_APIHOST,
      withCredentials: false,
      timeout: 60000,
      addXMLHttpRequestHeader: true,
      transformResponse(res) {
        // 如果需要，可在此解析 response
        return res;
      },
      configure(defaultConfig, interceptors) {
        // 为请求 添加 access-token
        interceptors.request.use(
          function (config) {
            // 可在此设置请求的默认 header
            if (sessionService.user.accessToken) {
              config.headers.authorization = sessionService.user.accessToken;
            }
            return config;
          },
          function (error: Error): Promise<any> {
            return Promise.reject(error);
          }
        );

        // 响应拦截
        interceptors.response.use(
          function (res) {
            // 在此定义请求成功后的处理逻辑，需要与后端配合
            if (isString(res.data) || !res.data || res?.data?.code === undefined || res?.data?.code === 0 || res?.data?.code === 200) {
              return res;
            } else if (res?.data?.code === 401 || res?.data?.code === 403) {
              // 判断返回状态为 unauthorized 未授权，则登出当前账户，并将错误消息传递过去
              sessionService.logout({
                expired: true,
                message: res?.data?.msg
              });
            }

            // 其余情况，均视为请求出错
            const err = {
              code: res?.data?.code,
              data: res?.data?.data,
              message: res?.data?.msg || res?.data?.message || i18n._.global.tc(i18nMessages.app.http.requestFailed)
            };

            return Promise.reject(err);
          },
          function (rejection): Promise<any> {
            // 在此定义请求错误的处理逻辑
            let message;
            let err = rejection?.response?.data ?? {};
            const status = rejection?.response?.status;

            try {
              const err_ = JSON.parse(err);
              if (err_) {
                err = err_;
              }
            } catch (e) {}

            switch (status) {
              case -1: {
                // 远程服务器无响应
                message = i18n._.global.tc(i18nMessages.app.http.noResponse);
                break;
              }
              case 401: {
                // unauthenticated 当前用户未认证，登出账户
                message = i18n._.global.tc(i18nMessages.app.http.unauthenticated);
                sessionService.logout();
                break;
              }
              case 403: {
                // unauthorized 未授权
                message = i18n._.global.tc(i18nMessages.app.http.unauthorized);
                sessionService.logout();
                break;
              }
              case 404: {
                // notfound
                message = i18n._.global.tc(i18nMessages.app.http.noResponse);
                break;
              }
              case 408: {
                message = i18n._.global.tc(i18nMessages.app.http.requestTimeout);
                break;
              }
              default: {
                if (rejection.err === 'ECONNABORTED') {
                  message = i18n._.global.tc(i18nMessages.app.http.connectionAbort);
                } else {
                  if (Object.prototype.toString.call(err) === '[object String]') {
                    message = err;
                  } else {
                    message = err.msg || err.message || err.Message || i18n._.global.tc(i18nMessages.app.http.requestFailed);
                  }
                }
              }
            }

            // 抛出一个错误
            return Promise.reject(new Error(message));
          }
        );
      }
    };
  });
  bind<IHttpService>(ANTDVX_SYMBOLS.HTTP_SERVICE).to(HttpService);
});

appDIC.load(antdvxModule);

export { appDIC };
