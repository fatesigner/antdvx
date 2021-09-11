/**
 * zh-CN
 */

import { I18nMessagesType } from '../messages';

export default {
  app: {
    sidebar: {
      shrink: '收缩',
      unfold: '展开'
    },
    route: {
      exception: {
        notFound: {
          name: '未找到页面',
          title: '页面丢失',
          description: '请检查您输入的网址是否正确，或点击下面的按钮返回主页.',
          back: '返回'
        },
        unauthorized: {
          name: '未授权',
          title: '你没有权限访问该页面',
          title2: '如有不满请联系你领导',
          title3: '或者你可以去',
          back: '回到主页',
          gotologin: '重新登录',
          gotohome: '回到主页'
        }
      },
      passport: {
        login: '登录',
        register: '注册',
        findPwd: '找回密码'
      },
      system: {
        menus: '菜单设置'
      },
      dashboard: '首页',
      table: '表格',
      grid: 'kendo grid'
    },
    navbar: {
      logOut: '退出登录',
      dashboard: '主页',
      github: '项目地址',
      theme: '换肤',
      size: '布局大小',
      profile: '个人中心',
      individuation: '个性化'
    },
    tabsView: {
      refresh: '刷新',
      close: '关闭',
      closeOthers: '关闭其它',
      closeAll: '关闭所有',
      openInNewTab: '在新窗口中打开'
    },
    settings: {
      title: '系统布局配置',
      theme: '主题色',
      showTagsView: '显示 Tags-View',
      showSidebarLogo: '显示侧边栏 Logo',
      fixedHeader: '固定 Header'
    },
    http: {
      noResponse: '服务器没有响应，请检查您的网络设置',
      unauthenticated: '您的会话已超时，请重新登录',
      unauthorized: '未经授权的请求',
      requestFailed: '请求失败，请联系管理员',
      requestTimeout: '您的会话已结束，请重新登录',
      connectionAbort: '连接服务器超时，检查您的网络设置'
    },
    passport: {
      title: '系统登录',
      logIn: '登录',
      username: '账号',
      password: '密码',
      any: '随便填',
      thirdparty: '第三方登录',
      thirdpartyTips: '本地不能模拟，请结合自己业务进行模拟！！！'
    },
    notification: {
      login: '登录成功',
      logout: '您已退出登录'
    }
  }
} as I18nMessagesType;
