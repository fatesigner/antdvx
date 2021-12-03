/**
 * messages
 */

import { createLocaleMessages } from '@fatesigner/i18n';

export const i18nMessages = createLocaleMessages({
  app: {
    sidebar: {
      shrink: '',
      unfold: ''
    },
    route: {
      exception: {
        refresh: '',
        notFound: {
          name: '',
          title: '',
          description: '',
          back: ''
        },
        unauthorized: {
          name: '',
          title: '',
          title2: '',
          title3: '',
          back: '',
          gotologin: '',
          gotohome: ''
        }
      },
      passport: {
        login: '',
        register: '',
        findPwd: ''
      },
      system: {
        menus: ''
      },
      portal: '',
      table: '',
      grid: ''
    },
    navbar: {
      logOut: '',
      portal: '',
      github: '',
      theme: '',
      size: '',
      profile: '',
      individuation: ''
    },
    tabsView: {
      refresh: '',
      close: '',
      closeOthers: '',
      closeAll: '',
      openInNewTab: ''
    },
    settings: {
      title: '',
      theme: '',
      showTagsView: '',
      showSidebarLogo: '',
      fixedHeader: ''
    },
    http: {
      noResponse: '',
      unauthenticated: '',
      unauthorized: '',
      requestFailed: '',
      requestTimeout: '',
      connectionAbort: ''
    },
    passport: {
      title: '',
      username: '',
      password: '',
      logIn: '',
      autoLogin: '',
      forgetPassword: '',
      register: '',
      backToLogin: '',
      submit: '',
      any: '',
      thirdparty: '',
      thirdpartyTips: ''
    },
    notification: {
      login: '',
      logout: ''
    }
  }
});

export type I18nMessagesType = typeof i18nMessages;
