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
          gotoLogin: '',
          gotoHome: ''
        }
      },
      passport: {
        login: '',
        register: '',
        findPwd: '',
        logout: ''
      },
      system: {
        menus: ''
      },
      portal: ''
    },
    navbar: {
      exitOut: '',
      updatePassword: '',
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
      login: {
        title: '',
        username: '',
        password: '',
        rememberMe: '',
        submit: '',
        any: '',
        thirdParty: '',
        thirdPartyTips: '',
        message: ''
      },
      updatePassword: {
        title: '',
        forget: '',
        username: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        backToLogin: '',
        submit: '',
        message: {
          submitSuccess: '',
          inconsistent: ''
        }
      }
    }
  }
});

export type I18nMessagesType = typeof i18nMessages;
