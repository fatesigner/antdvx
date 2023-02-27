/**
 * router
 */

import { createRouter, createWebHashHistory } from 'vue-router';
import { getAccessPermission } from 'antdvx/helpers';

import { login$, logout$, roleChanged$ } from '@/app/core/events';
import { authService } from '@/app/core/services';
import { RoleNamesType, RouteRecordRawType } from '@/app/core/types';
import { i18n, i18nMessages } from '@/app/i18n';
import { addExceptionRoute } from '@/app/layout/shared/exception';
import routesConfig from '@/app/router/config';

const LayoutEmpty = () => import('@/app/layout/layout-empty');
const LayoutSidebar = () => import('@/app/layout/layout-sidebar');

/**
 * 创建 App Router 实例
 * @constructor
 */
export async function createAppRouter() {
  const router = createRouter({
    history: createWebHashHistory(),
    linkActiveClass: 'activated',
    linkExactActiveClass: 'exact-activated',
    // 路由表
    routes: [
      {
        path: '/',
        component: LayoutSidebar,
        meta: {
          keepAlive: true
        },
        children: [{ path: '', redirect: 'portal' }, ...routesConfig]
      },
      {
        path: '/passport',
        component: LayoutEmpty,
        children: [
          {
            name: 'Login',
            path: 'login',
            component: () => import('../views/passport/passport-generic'),
            meta: {
              label: 'Login',
              allowAnonymous: true,
              keepAlive: true
            }
          },
          {
            name: 'sso',
            path: 'sso',
            component: () => import('../views/passport/passport-sso'),
            meta: {
              allowAnonymous: true
            }
          }
        ]
      }
    ] as RouteRecordRawType[]
  });

  // 监听用户登录事件
  login$.on((user) => {
    if (user) {
      // 动态注册当前用户可访问的路由
      // router.addRoutes(authService.config.getAuthorizedRoutes(RichRoutes));
    }
  });

  // 监听用户注销事件
  logout$.on((event) => {
    // 重定向至授权界面
    const error = event?.expired
      ? event?.message || i18n._.global.tc(i18nMessages.app.http.unauthenticated)
      : undefined;
    if (router.currentRoute?.value.name === authService.config.homePage) {
      router.replace({ name: authService.config.authPage });
    } else {
      // 非 portal 路由，添加 redirect 参数
      if (authService.config.redirectEnable) {
        router.replace({
          name: authService.config.authPage,
          query: { redirect: router.currentRoute?.value.fullPath ?? '' },
          params: {
            error: error ?? ''
          }
        });
      } else {
        router.replace({
          name: authService.config.authPage,
          params: {
            error: error ?? ''
          }
        });
      }
    }
  });

  // 监听用户角色切换事件，设置不同的主页
  roleChanged$.on((role) => {
    if (role.name === 'MAdmin') {
      authService.config.homePage = 'Portal';
    } else if (role.name === 'PAdmin') {
      authService.config.homePage = 'Portal';
    } else {
      // 匿名用户，设置主页为空
      authService.config.homePage = null;
    }
  });

  // 注册全局前置守卫
  router.beforeEach((to, from, next) => {
    // 获取待跳转的路由可访问的权限
    const status = getAccessPermission<RoleNamesType>(
      to,
      () => authService.isAuthenticated(),
      (x) => authService.isAuthorized(x)
    );

    if (status === 401) {
      // 无访问权限，通常是未登录状态，将重定向至授权界面
      console.warn(`[App Router warn]: ${status} => The request page '${to.path}' is not allowed`);
      return next({
        name: authService.config.authPage,
        query: { redirect: authService.config.redirectEnable ? to.fullPath : undefined }
      });
    } else if (status === 403) {
      // 最终确认当前用户没有该路由的访问授权，动态添加 403 路由，该界面将提示用户未获得对应的访问权限
      console.warn(`[App Router warn]: ${status} => The request page '${to.path}' is not allowed`);
      return next({
        name: addExceptionRoute(router, status, to, LayoutEmpty)
      });
    } else if (status === 404) {
      // 该路由不存在，动态添加 404 路由，该界面将提示用户当前页面 not found
      console.warn(`[App Router warn]: ${status} => The request page '${to.path}' is not defined`);
      return next({
        name: addExceptionRoute(router, status, to, LayoutEmpty)
      });
    }

    // 添加 router key 以取消默认的视图共享逻辑
    const matched = to.matched.find((x) => x?.meta?.routerKey);
    if (matched) {
      to.meta.key = (matched.name as string) + '_' + (matched.meta as any)?.routerKey(to);
    }

    return next();
  });

  return router;
}
