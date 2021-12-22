/**
 * en-US
 */

import { I18nMessagesType } from '../messages';

export default {
  antd: {
    action: {
      add: 'Add',
      edit: 'Edit',
      delete: {
        oktext: 'Confirm',
        cancelText: 'Cancele',
        confirmText: 'Are you sure to delete it ?',
        title: 'Delete',
        success: 'Delete success.'
      },
      fullscreen: 'Fullscreen',
      fullscreenExit: 'Exit Fullscreen',
      save: 'Save',
      refresh: 'Refresh',
      upload: 'Upload',
      search: 'Search',
      export: 'Export',
      exporting: 'Exporting',
      exportToJSON: 'Export to JSON',
      exportToPDF: 'Export to PDF',
      exportToImage: 'Export to Image',
      exportToExcel: 'Export to Excel',
      expand: 'Expand',
      fold: 'Fold',
      reset: 'Reset'
    },
    asyncAction: {
      error: 'Error'
    },
    backTop: {
      title: 'Back to Top'
    },
    pagination: {
      of: 'of',
      items: 'items'
    },
    slideCaptcha: {
      tip: 'Click the button to verify',
      handingTip: 'Please move the slider to complete the verification',
      loading: 'Loading the captcha',
      slider: 'Drag the left slider to complete the top puzzle',
      validText: 'Passed the verification',
      result: {
        failed: 'Drag the slider to stitch the hover image together correctly',
        successful: 'Complete picture matching and verification'
      }
    }
  }
} as I18nMessagesType;
