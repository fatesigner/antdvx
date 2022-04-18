/**
 * en-US
 */

import { I18nMessagesType } from '../messages';

export default {
  app: {
    sidebar: {
      shrink: 'Shrink',
      unfold: 'Unfold'
    },
    route: {
      exception: {
        refresh: 'Refresh',
        notFound: {
          name: 'Notfound',
          title: 'Page Not Found',
          description: 'Please check that the URL you entered is correct, or click the button below to return to the homepage.',
          back: 'Back'
        },
        unauthorized: {
          name: 'Unauthorized',
          title: 'You do not have permission to go to this page',
          title2: 'Please contact your leader if you are dissatisfied',
          title3: 'Or you can go',
          back: 'Back',
          gotoLogin: 'Login',
          gotoHome: 'Home'
        }
      },
      passport: {
        login: 'Login',
        register: 'Register',
        findPwd: 'FindPwd',
        logout: 'You have logged out.'
      },
      system: {
        menus: 'Menus Auth'
      },
      portal: 'Portal'
    },
    navbar: {
      exitOut: 'Exit out',
      updatePassword: 'Update password',
      logOut: 'Log out',
      portal: 'Portal',
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
      login: {
        title: 'Sign In',
        username: 'Enter user name',
        password: 'Enter password',
        rememberMe: 'Remember me',
        submit: 'Sign In',
        any: 'Any',
        thirdParty: 'Or connect with',
        thirdPartyTips: 'Can not be simulated on i18n, so please combine you own business simulation! ! !',
        message: 'Login successfully'
      },
      updatePassword: {
        title: 'Update password',
        forget: 'Forget password?',
        username: 'Enter user name',
        oldPassword: 'Enter old password',
        newPassword: 'Enter new password',
        confirmPassword: 'Confirm new password',
        backToLogin: 'Back to login',
        submit: 'Submit',
        message: {
          submitSuccess: 'Password updated successfully',
          inconsistent: 'Passwords are inconsistent'
        }
      }
    },
    systemSettings: {
      menu: {
        add: 'Add',
        edit: 'Edit',
        delete: 'Delete',
        upload: 'Upload',
        export: 'Export',
        save: 'Save',
        cancel: 'Cancel',
        root: 'Root',
        title: `Update Role's Menu`,
        titleAdd: 'Add Menu',
        titleUpdate: 'Update Menu',
        duplicatedNameExist: 'A menu with the same name already exists at the same level',
        form: {
          name: 'Name',
          route: 'Route',
          label: 'label',
          url: 'Url',
          icon: 'Icon',
          target: 'Target'
        },
        placeholder: {
          route: 'Match a app route'
        }
      }
    }
  }
} as I18nMessagesType;
