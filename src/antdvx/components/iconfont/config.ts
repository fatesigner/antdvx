import { Component } from '@vue/runtime-core';

/**
 * Antdvx 图标库名称
 */
export const AntdvxIconNames = [
  'adn',
  'angle-double-right',
  'arrow-from-bottom',
  'arrows',
  'bars',
  'check-blod',
  'check',
  'cog',
  'copy',
  'external-link',
  'file-chart-line',
  'flag-alt',
  'home',
  'id-badge',
  'logout',
  'pen',
  'plus',
  'question-circle',
  'redo',
  'save',
  'sort-size-down-alt',
  'spinner-third',
  'sync',
  'table',
  'times',
  'trash-alt',
  'usd-circle'
];

/**
 * Antdvx 图标库名称类型
 */
export type IAntdvxIconNames = typeof AntdvxIconNames[number];

/**
 * Antdvx 已注册的 icons
 */
export const ANTDVX_ICONS_REGISTERED: { name: string; comp: Component }[] = [];
