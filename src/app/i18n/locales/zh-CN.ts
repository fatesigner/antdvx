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
        refresh: '刷新',
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
          gotoLogin: '重新登录',
          gotoHome: '回到主页'
        }
      },
      passport: {
        login: '登录',
        register: '注册',
        findPwd: '找回密码',
        logout: '您已退出登录'
      },
      system: {
        menus: '菜单设置'
      },
      portal: '主页'
    },
    navbar: {
      exitOut: '退出',
      updatePassword: '修改密码',
      logOut: '退出登录',
      portal: '主页',
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
      login: {
        title: '登录',
        username: '请输入用户名',
        password: '请输入密码',
        rememberMe: '记住我',
        submit: '登录',
        any: '随便填',
        thirdParty: '第三方登录',
        thirdPartyTips: '本地不能模拟，请结合自己业务进行模拟！！！',
        message: '登录成功'
      },
      updatePassword: {
        title: '修改密码',
        forget: '忘记密码?',
        username: '请输入用户名',
        oldPassword: '请输入旧密码',
        newPassword: '请输入新密码',
        confirmPassword: '确认新密码',
        backToLogin: '返回登录',
        submit: '提交',
        message: {
          submitSuccess: '密码修改成功',
          inconsistent: '密码前后不一致'
        }
      }
    }
  }
} as I18nMessagesType;
