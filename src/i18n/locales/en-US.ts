/**
 * en-US
 */

import { I18nMessagesType } from '../messages';

export default {
  app: {
    sidebar: {
      shrink: 'shrink',
      unfold: 'unfold'
    },
    route: {
      exception: {
        notFound: {
          name: 'notfound',
          title: 'Page Not Found',
          description: 'Please check that the URL you entered is correct, or click the button below to return to the homepage.',
          back: 'back'
        },
        unauthorized: {
          name: 'unauthorized',
          title: 'You do not have permission to go to this page',
          title2: 'Please contact your leader if you are dissatisfied',
          title3: 'Or you can go',
          back: 'back',
          gotologin: 'login',
          gotohome: 'home'
        }
      },
      passport: {
        login: 'login',
        register: 'register',
        findPwd: 'findPwd'
      },
      system: {
        menus: 'menus auth'
      },
      dashboard: 'dashboard',
      table: 'table',
      grid: 'kendo grid'
    },
    navbar: {
      logOut: 'Log Out',
      dashboard: 'Dashboard',
      github: 'Github',
      theme: 'Theme',
      size: 'Global Size',
      profile: 'Profile',
      individuation: 'Individuation'
    },
    tabsView: {
      refresh: 'Refresh',
      close: 'Close',
      closeOthers: 'Close others',
      closeAll: 'Close all',
      openInNewTab: 'Open in new tab'
    },
    settings: {
      title: 'Page style setting',
      theme: 'Theme Color',
      showTagsView: 'Open Tags-View',
      showSidebarLogo: 'Sidebar Logo',
      fixedHeader: 'Fixed Header'
    },
    http: {
      noResponse: 'The server does not respond, please check your network Settings',
      unauthenticated: 'Your session has timed out. Please log in again',
      unauthorized: 'Unauthorized request',
      requestFailed: 'Request failed, please contact administrator',
      requestTimeout: 'Your session has timed out. Please log in again',
      connectionAbort: 'Connect the server timeout, check your network Settings'
    },
    passport: {
      title: 'Login Form',
      username: 'Username',
      password: 'Password',
      logIn: 'Login',
      autoLogin: 'Auth Login',
      forgetPassword: 'Forget Password',
      register: 'Register',
      backToLogin: 'Back To Login',
      submit: 'Submit',
      any: 'Any',
      thirdparty: 'Or connect with',
      thirdpartyTips: 'Can not be simulated on i18n, so please combine you own business simulation! ! !'
    },
    notification: {
      login: 'Login successfully',
      logout: 'You have logged out.'
    }
  }
} as I18nMessagesType;
