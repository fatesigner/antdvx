/**
 * inversify（IOC/DI）
 * IOC 容器，注入 APP 依赖
 */

import { ANTDVX_SYMBOLS } from '@/antdvx/symbols';
import { Container, ContainerModule } from 'inversify';
import { isString } from '@fatesigner/utils/type-check';
import { AuthServiceConfig, IHttpService, IStorageService } from '@/antdvx/types';
import { AuthService, HttpService, HttpServiceConfig, SessionService, SessionServiceConfig, StorageService } from '@/antdvx/services';

import { ENV } from '@/app/core/constants';
import { i18n, i18nMessages } from '@/app/i18n';
import { login$, logout$, roleChanged$ } from '@/app/core/events';
import { AuthServiceType, SessionServiceType, UserType } from '@/app/core/types';

// 新建 IOC 容器
const appDIC = new Container({ defaultScope: 'Singleton' });

// 定义 Antdvx 模块服务
const antdvxModule = new ContainerModule((bind) => {
  // StorageService
  bind(ANTDVX_SYMBOLS.STORAGE_SERVICE_IDENTIFICATION).toConstantValue(ENV.APP_NAME);
  bind<IStorageService>(ANTDVX_SYMBOLS.STORAGE_SERVICE).to(StorageService);

  // SessionService
  bind<SessionServiceConfig<UserType>>(ANTDVX_SYMBOLS.SESSION_SERVICE_CONFIG).toConstantValue({
    // 用户登录
    onLogin(user) {
      login$.emit(user);
    },
    onLogout(res) {
      logout$.emit(res);
    },
    onRoleChanged(role) {
      roleChanged$.emit(role);
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
  bind<AuthServiceConfig<UserType>>(ANTDVX_SYMBOLS.AUTH_SERVICE_CONFIG).toConstantValue({
    // 主页地址
    homePage: 'Portal',
    // 授权界面地址 name
    authPage: 'Login',
    // 授权认证模式
    authMode: 'server',
    // 是否开启重定向模式，登出后将暂存当前地址，登录后重定向至该地址
    redirectEnable: false,
    // 超级管理员角色，该角色将会跳过认证
    superRole: ['MAdmin']
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
              config.headers.ApiToken = ENV.APP_NAME;
              config.headers.authorization = 'Bearer ' + sessionService.user.accessToken;
              config.headers['X-Authorization'] = 'Bearer ' + sessionService.user.xAccessToken;
            }
            return config;
          },
          function (error: Error): Promise<any> {
            return Promise.reject(error);
          }
        );

        // 响应拦截
        interceptors.response.use(
          function (res: any) {
            // 更新 access-token
            sessionService.updateUser({
              accessToken: res?.headers?.['access-token'],
              xAccessToken: res?.headers?.['x-access-token']
            } as any);

            // 补丁：解决 JsonParse 大整数精度丢失的问题
            if (res?.headers?.['content-type']?.indexOf('application/json') > -1) {
              try {
                const str = res.data.replace(/[\d.]{18,}/g, (val) => `"${val}"`);
                const data = JSON.parse(str);
                if (data) {
                  res.data = data;
                }
              } catch (e) {
                res.data = JSON.parse(res.data);
              }
            }

            // 在此定义请求成功后的处理逻辑，需要与后端配合
            if (isString(res.data) || !res.data || res?.data?.code === undefined || res?.data?.code === 0 || res?.data?.Code === 200) {
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
                    if (err.Result) {
                      message = err.Result?.[Object.keys(err.Result)?.[0]];
                    } else {
                      message = err.msg || err.message || err.Message || i18n._.global.tc(i18nMessages.app.http.requestFailed);
                    }
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
