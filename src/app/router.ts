/**
 * router
 */

import { getAccessPermission } from '@/antdvx/helpers';
import { createRouter, createWebHashHistory } from 'vue-router';

import { i18nMessages } from '@/app/i18n';
import { authService } from '@/app/core/services';
import { addExceptionRoute } from '@/app/layout/shared/exception';
import { login$, logout$, roleChanged$ } from '@/app/core/events';
import { RoleNamesType, RouteRecordRawType } from '@/app/core/types';

const LayoutEmpty = () => import('@/app/layout/layout-empty').then(({ LayoutEmpty }) => LayoutEmpty);
const LayoutSidebar = () => import('@/app/layout/layout-sidebar').then(({ LayoutSidebar }) => LayoutSidebar);

/**
 * 为路由的 path 添加前缀
 * @param prefix
 * @param routes
 */
function prefixRoutes(prefix, routes) {
  return routes.map((route) => {
    route.path = prefix + '/' + route.path;
    return route;
  });
}

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
        children: [
          { path: '', redirect: 'portal' },
          {
            name: 'Portal',
            path: 'portal',
            component: () => import('./views/portal/portal').then(({ PortalView }) => PortalView),
            meta: {
              label: 'Portal'
            }
          },
          {
            name: 'AsyncSection',
            path: 'async-section',
            component: () => import('./views/async-section/async-section').then(({ AsyncSectionView }) => AsyncSectionView),
            meta: {
              label: 'AsyncSection',
              auth: ['SuperAdmin']
            }
          },
          {
            name: 'Button',
            path: 'button',
            component: () => import('./views/button/button').then(({ ButtonView }) => ButtonView),
            meta: {
              label: 'AsyncSection',
              auth: ['Admin']
            }
          },
          {
            name: 'Combobox',
            path: 'combobox',
            component: () => import('./views/combobox/combobox').then(({ ComboboxView }) => ComboboxView),
            meta: {
              label: 'Combobox'
            }
          },
          {
            name: 'Echarts',
            path: 'echarts',
            component: () => import('./views/echarts/echarts').then(({ EchartsView }) => EchartsView),
            meta: {
              label: 'Echarts'
            }
          },
          {
            name: 'GridDragable',
            path: 'grid-dragable',
            component: () => import('./views/grid-dragable/grid-dragable').then(({ GridDragableView }) => GridDragableView),
            meta: {
              label: 'GridDragable'
            }
          },
          {
            name: 'Iconfont',
            path: 'iconfont',
            component: () => import('./views/iconfont/iconfont').then(({ IconfontView }) => IconfontView),
            meta: {
              label: 'Iconfont'
            }
          },
          {
            name: 'Icons',
            path: 'icons',
            component: () => import('./views/icons/icons').then(({ IconsView }) => IconsView),
            meta: {
              label: 'Icons'
            }
          },
          {
            name: 'Input',
            path: 'input',
            component: () => import('./views/input/input').then(({ InputView }) => InputView),
            meta: {
              label: 'Input'
            }
          },
          {
            name: 'Lazy',
            path: 'lazy',
            component: () => import('./views/lazy/lazy').then(({ LazyView }) => LazyView),
            meta: {
              label: 'Lazy'
            }
          },
          {
            name: 'Pipes',
            path: 'pipes',
            component: () => import('./views/pipes/pipes').then(({ PipesView }) => PipesView),
            meta: {
              label: 'Pipes'
            }
          },
          {
            name: 'Popup',
            path: 'popup',
            component: () => import('./views/popup/popup').then(({ PopupView }) => PopupView),
            meta: {
              label: 'Popup'
            }
          },
          {
            name: 'Scrollview',
            path: 'scrollview',
            component: () => import('./views/scrollview/scrollview').then(({ Scrollview }) => Scrollview),
            meta: {
              label: 'Scrollview'
            }
          },
          {
            name: 'StickySection',
            path: 'sticky-section',
            component: () => import('./views/sticky-section/sticky-section').then(({ StickySectionView }) => StickySectionView),
            meta: {
              label: 'StickySection'
            }
          },
          {
            name: 'Table',
            path: 'table',
            component: () => import('./views/table/table').then(({ TableView }) => TableView),
            meta: {
              label: 'Table'
            }
          },
          {
            name: 'Tabs',
            path: 'tabs',
            component: () => import('./views/tabs/tabs').then(({ TabsView }) => TabsView),
            meta: {
              label: 'Tabs'
            }
          },
          {
            name: 'Transitions',
            path: 'transitions',
            component: () => import('./views/transitions/transitions').then(({ TransitionsView }) => TransitionsView),
            meta: {
              label: 'Transitions'
            }
          },
          ...prefixRoutes('system-settings', [
            {
              name: 'Permissions',
              path: 'permissions',
              component: () => import('./views/system-settings/permissions/permissions').then(({ PermissionsView }) => PermissionsView),
              meta: {
                label: 'Permissions'
              }
            },
            {
              name: 'Roles',
              path: 'roles',
              component: () => import('./views/system-settings/roles/roles').then(({ RolesView }) => RolesView),
              meta: {
                label: 'Roles'
              }
            },
            {
              name: 'Users',
              path: 'users',
              component: () => import('./views/system-settings/users/users').then(({ UsersView }) => UsersView),
              meta: {
                label: 'Users'
              }
            }
          ])
        ]
      },
      {
        path: '/passport',
        component: LayoutEmpty,
        children: [
          {
            name: 'Login',
            path: 'login',
            component: () => import('./views/passport/passport-generic').then(({ PassportGenericView }) => PassportGenericView),
            meta: {
              label: 'Login',
              allowAnonymous: true,
              keepAlive: true
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
      (to) => authService.isAuthorized(to)
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
