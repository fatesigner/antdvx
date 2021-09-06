/**
 * zh-CN
 */

import { I18nMessagesType } from '../messages';

export default {
  antd: {
    action: {
      add: '添加',
      edit: '编辑',
      delete: {
        oktext: '确定',
        cancelText: '取消',
        confirmText: '确定删除？',
        title: '删除',
        success: '删除成功.'
      },
      save: '保存',
      refresh: '刷新',
      upload: '上传',
      search: '搜索',
      export: '导出',
      exporting: '正在导出',
      exportToJSON: '导出到JSON',
      exportToPDF: '导出到PDF',
      exportToImage: '导出到图片',
      exportToExcel: '导出到Excel'
    },
    asyncAction: {
      error: '错误'
    },
    pagination: {
      of: '',
      items: '项'
    },
    slideCaptcha: {
      tip: '点击按钮进行验证',
      handingTip: '请移动滑块，完成验证',
      loading: '正在加载验证码',
      slider: '拖动左边滑块完成上方拼图',
      validText: '已通过验证',
      result: {
        failed: '拖动滑块将悬浮图像正确拼合',
        successful: '完成图片拼合验证'
      }
    }
  }
} as I18nMessagesType;
