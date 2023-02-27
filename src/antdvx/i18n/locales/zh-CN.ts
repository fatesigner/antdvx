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
      download: '下载',
      filter: '筛选',
      fullscreen: '全屏',
      fullscreenExit: '退出全屏',
      save: '保存',
      cancel: '取消',
      refresh: '刷新',
      upload: '上传',
      search: '搜索',
      export: '导出',
      exporting: '正在导出',
      exportToJSON: '导出到JSON',
      exportToPDF: '导出到PDF',
      exportToImage: '导出到图片',
      exportToExcel: '导出到Excel',
      expand: '展开',
      fold: '收起',
      reset: '重置'
    },
    asyncAction: {
      error: '错误'
    },
    backTop: {
      title: '回到顶部'
    },
    pagination: {
      of: '',
      items: '项'
    },
    slideCaptcha: {
      tip: '点击按钮进行验证',
      handingTip: '请移动滑块，完成验证',
      imageFailed: '系统已更新,请按F5刷新浏览器。',
      loading: '正在加载验证码',
      slider: '拖动左边滑块完成上方拼图',
      validText: '已通过验证',
      result: {
        failed: '拖动滑块将悬浮图像正确拼合',
        successful: '完成图片拼合验证'
      }
    },
    table: {
      controlPanel: {
        title: '设置',
        description: '表格设置面板（列的可见性、宽度、是否固定、顺序）',
        columnName: '列名',
        visible: '是否可见',
        width: '宽度',
        fixed: '固定列',
        actions: '操作',
        up: '移至前一列',
        down: '移至后一列'
      }
    }
  }
} as I18nMessagesType;
