import { VXETable } from 'vxe-table';

// 创建一个超链接渲染器
VXETable.renderer.add('MyLink', {
  // 默认显示模板
  renderDefault(opts, params) {
    const { row, column } = params;
    return [<span>{row[column.property]}zzz</span>];
  }
});
