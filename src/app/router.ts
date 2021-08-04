/**
 * router
 */

import { getAccessPermission } from 'antdvx/utils/router';
import { createRouter, createWebHashHistory } from 'vue-router';

import { authService } from '@/app/services';
import { login$, logout$, roleChanged$ } from '@/app/events';
import { AddNotFoundRoute, AddUnauthorizedRoute } from '@/shared/error';

// 基础路由表，可匿名访问
const baseRoutes = [];

// 业务路由表，导入 routes 目录下的 router，并分析 meta 为其添加指定的 layout
const richRoutes = [];
const requirePages = require.context('@/views', true, /router\.ts$/);
requirePages.keys().forEach((filename) => {
  let router: any = requirePages(filename).default;
  // 若该路由可被匿名访问，将其添加至基础路由表
  if (!router.length) {
    router = [router];
  }
  router.forEach((x) => {
    if (x?.meta?.allowAnonymous) {
      baseRoutes.push(x);
    } else {
      richRoutes.push(x);
    }
  });
});

export const BaseRoutes = baseRoutes;

export const RichRoutes = richRoutes;

/**
 * 创建 App Router 实例
 * @constructor
 */
export async function createAppRouter() {
  const router = createRouter({
    history: createWebHashHistory(),
    linkActiveClass: 'activated',
    linkExactActiveClass: 'exact-activated',
    routes: RichRoutes
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
    const error = event?.expired ? event?.message || '您当前的会话已过期，请重新登录' : undefined;
    if (router.currentRoute?.value.name === 'Dashboard') {
      router.replace({ name: authService.config.authPage });
    } else {
      // 非 Dashboard 路由，添加 redirect 参数
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
  roleChanged$.on((val) => {
    if (val === 'admin') {
      authService.config.homePage = 'dashboard';
    } else if (val === 'normal') {
      authService.config.homePage = 'dashboard';
    } else {
      // 匿名用户，设置主页为空
      authService.config.homePage = null;
    }
  });

  // 注册全局前置守卫
  router.beforeEach((to, from, next) => {
    // 获取待跳转的路由可访问的权限
    const status: any = getAccessPermission(
      to,
      () => authService.isAuthenticated(),
      (x) => authService.isAuthorized(x)
    );

    if (status === 401) {
      // 无访问权限，通常是未登录状态，将重定向至授权界面
      return next({
        name: authService.config.authPage,
        query: { redirect: authService.config.redirectEnable ? to.fullPath : undefined }
      });
    } else if (status === 403) {
      // 最终确认当前用户没有该路由的访问授权，动态添加 403 路由，该界面将提示用户未获得对应的访问权限
      AddUnauthorizedRoute(to, router, () => import('@/layout/layout-empty.vue'));
      return next({ path: to.path });
    } else if (status === 404) {
      // 该路由不存在，动态添加 404 路由，该界面将提示用户当前页面 not found
      AddNotFoundRoute(to, router, () => import('@/layout/layout-empty.vue'));
      return next({ path: to.path });
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
