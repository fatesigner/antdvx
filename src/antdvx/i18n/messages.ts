/**
 * messages
 */

import { createLocaleMessages } from '@fatesigner/i18n';

export const i18nMessages = createLocaleMessages({
  antd: {
    action: {
      add: '',
      edit: '',
      delete: {
        oktext: '',
        cancelText: '',
        confirmText: '',
        title: '',
        success: ''
      },
      download: '',
      filter: '',
      fullscreen: '',
      fullscreenExit: '',
      save: '',
      cancel: '',
      refresh: '',
      upload: '',
      search: '',
      export: '',
      exporting: '',
      exportToJSON: '',
      exportToPDF: '',
      exportToImage: '',
      exportToExcel: '',
      expand: '',
      fold: '',
      reset: ''
    },
    asyncAction: {
      error: ''
    },
    backTop: {
      title: ''
    },
    pagination: {
      of: '',
      items: ''
    },
    slideCaptcha: {
      tip: '',
      handingTip: '',
      loading: '',
      slider: '',
      validText: '',
      result: {
        failed: '',
        successful: ''
      }
    },
    table: {
      controlPanel: {
        title: '',
        description: '',
        columnName: '',
        visible: '',
        width: '',
        fixed: '',
        actions: '',
        up: '',
        down: ''
      }
    }
  }
});

export type I18nMessagesType = typeof i18nMessages;
