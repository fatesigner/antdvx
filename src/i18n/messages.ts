/**
 * messages
 */

import { createLocaleMessages } from '@fatesigner/i18n';

export const i18nMessages = createLocaleMessages({
  app: {
    route: {
      error: {
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
        login: ''
      },
      button: '',
      menus: '',
      dashboard: '',
      table: '',
      grid: '',
      pc2is: '',
      pc2i: ''
    },
    navbar: {
      logOut: '',
      dashboard: '',
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
      unauthorized: '',
      requestFailed: '',
      requestTimeout: '',
      connectionAbort: ''
    },
    passport: {
      title: '',
      logIn: '',
      username: '',
      password: '',
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
