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
      save: '',
      refresh: '',
      upload: '',
      search: '',
      export: '',
      exporting: '',
      exportToPDF: '',
      exportToImage: '',
      exportToExcel: ''
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
    }
  }
});

export type I18nMessagesType = typeof i18nMessages;
