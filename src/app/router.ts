/**
 * router
 */

import { getAccessPermission } from '@/antdvx';
import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router';

import { authService } from './core/services';
import { addExceptionRoute } from './shared/exception';
import { login$, logout$, roleChanged$ } from './core/events';
import { i18nMessages } from '@/app/i18n';

/**
 * 定义路由表
 */
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('./layout/layout-sidebar.vue'),
    children: [
      { path: '', redirect: 'portal' },
      {
        name: 'async-section',
        path: 'async-section',
        component: () => import('./views/async-section/async-section.vue')
      },
      {
        name: 'users',
        path: 'auth/users',
        component: () => import('./views/auth/users/users.vue')
      },
      {
        name: 'roles',
        path: 'auth/roles',
        component: () => import('./views/auth/roles/roles.vue')
      },
      {
        name: 'button',
        path: 'button',
        component: () => import('./views/button/button.vue')
      },
      {
        name: 'combobox',
        path: 'combobox',
        component: () => import('./views/combobox/combobox.vue')
      },
      {
        name: 'echarts',
        path: 'echarts',
        component: () => import('./views/echarts/echarts.vue')
      },
      {
        name: 'grid-dragable',
        path: 'grid-dragable',
        component: () => import('./views/grid-dragable/grid-dragable.vue')
      },
      {
        name: 'iconfont',
        path: 'iconfont',
        component: () => import('./views/iconfont/iconfont.vue')
      },
      {
        name: 'icons',
        path: 'icons',
        component: () => import('./views/icons/icons.vue')
      },
      {
        name: 'input',
        path: 'input',
        component: () => import('./views/input/input.vue')
      },
      {
        name: 'lazy',
        path: 'lazy',
        component: () => import('./views/lazy/lazy.vue')
      },
      {
        name: 'pipes',
        path: 'pipes',
        component: () => import('./views/pipes/pipes.vue')
      },
      {
        name: 'popup',
        path: 'popup',
        component: () => import('./views/popup/popup.vue')
      },
      {
        name: 'scroll-view',
        path: 'scroll-view',
        component: () => import('./views/scroll-view/scroll-view.vue')
      },
      {
        name: 'sticky-section',
        path: 'sticky-section',
        component: () => import('./views/sticky-section/sticky-section.vue')
      },
      {
        name: 'table',
        path: 'table',
        component: () => import('./views/table/table.vue')
      },
      {
        name: 'tabs',
        path: 'tabs',
        component: () => import('./views/tabs/tabs.vue')
      },
      {
        name: 'transitions',
        path: 'transitions',
        component: () => import('./views/transitions/transitions.vue')
      },
      {
        name: 'portal',
        path: 'portal',
        component: () => import('./views/portal/portal.vue'),
        meta: {
          label: i18nMessages.app.route.portal,
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/passport',
    component: () => import('./layout/layout-empty.vue'),
    children: [
      {
        name: 'login',
        path: 'login',
        component: () => import('./views/passport/login-generic.vue'),
        meta: {
          label: i18nMessages.app.route.passport.login,
          keepAlive: true,
          allowAnonymous: true
        }
      }
    ]
  }
];

/**
 * 创建路由实例
 * @constructor
 */
export async function createAppRouter() {
  const router = createRouter({
    history: createWebHashHistory(),
    linkActiveClass: 'activated',
    linkExactActiveClass: 'exact-activated',
    routes: routes
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
      authService.config.homePage = 'portal';
    } else if (val === 'normal') {
      authService.config.homePage = 'portal';
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
      console.warn(`[App Router warn]: ${status} => The request page '${to.path}' is not allowed`);
      return next({
        name: authService.config.authPage,
        query: { redirect: authService.config.redirectEnable ? to.fullPath : undefined }
      });
    } else if (status === 403) {
      // 最终确认当前用户没有该路由的访问授权，动态添加 403 路由，该界面将提示用户未获得对应的访问权限
      console.warn(`[App Router warn]: ${status} => The request page '${to.path}' is not allowed`);
      return next({ name: addExceptionRoute(router, status, to, () => import('@/app/layout/layout-empty.vue')) });
    } else if (status === 404) {
      // 该路由不存在，动态添加 404 路由，该界面将提示用户当前页面 not found
      console.warn(`[App Router warn]: ${status} => The request page '${to.path}' is not defined`);
      return next({ name: addExceptionRoute(router, status, to, () => import('@/app/layout/layout-empty.vue')) });
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
