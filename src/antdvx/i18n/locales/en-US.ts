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
        cancelText: 'Cancel',
        confirmText: 'Are you sure to delete it ?',
        title: 'Delete',
        success: 'Delete success.'
      },
      download: 'Download',
      filter: 'Filter',
      fullscreen: 'Fullscreen',
      fullscreenExit: 'Exit Fullscreen',
      save: 'Save',
      cancel: 'Cancel',
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
      imageFailed: 'The system has been updated, please press F5 to refresh the browser',
      loading: 'Loading the captcha',
      slider: 'Drag the left slider to complete the top puzzle',
      validText: 'Passed the verification',
      result: {
        failed: 'Drag the slider to stitch the hover image together correctly',
        successful: 'Complete picture matching and verification'
      }
    },
    table: {
      controlPanel: {
        title: 'Settings',
        description: "Table Settings Panel（Update column's visible、width、fixed、order）",
        columnName: 'Column Name',
        visible: 'Visible',
        width: 'Width',
        fixed: 'Fixed',
        actions: 'Actions',
        up: 'Move to the previous column',
        down: 'Move to the next column'
      }
    }
  }
} as I18nMessagesType;
