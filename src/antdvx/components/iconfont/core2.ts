/**
 * Icon
 */

import { Component } from '@vue/runtime-core';
import { defineComponent, h } from 'vue';

import { IconfontProps } from './types';
import { ANTDVX_ICONS_REGISTERED, IAntdvxIconNames } from './config';

/**
 * 创建 icon
 * @param name
 * @param options
 */
export function createIcon(
  name: string,
  options: {
    viewBox: string;
    d?: string;
    paths?: {
      d: string;
      color?: 'currentColor' | string;
      pid?: string;
    }[];
  }
) {
  return defineComponent({
    name: 'icon-' + name,
    props: IconfontProps,
    render(ctx) {
      return h(
        'span',
        {
          class: ['antdvx-icon', ctx.color ? `antdvx-color-${ctx.color}` : null, ctx.spin ? `antdvx-icon-spin` : null],
          style: Object.assign(
            {},
            ctx.scale
              ? {
                  fontSize: ctx.scale + 'em'
                }
              : null,
            ctx.rotate
              ? {
                  transform: `rotate(${ctx.rotate}deg)`
                }
              : null,
            ctx.style
          )
        },
        {
          default() {
            if (options?.paths?.length) {
              return options.paths.map((x, index) => {
                return h('path', {
                  d: x.d,
                  fill: ctx?.colors?.[index] ?? x.color ?? 'currentColor',
                  'p-id': x.pid
                });
              });
            } else {
              return [
                h('path', {
                  d: options.d
                })
              ];
            }
          }
        }
      );
    }
  });
}

/**
 * 注册 icon，相同的 name 会被覆盖
 * @param name
 * @param comp
 */
export function registerIcon(name: IAntdvxIconNames, comp: Component) {
  const cur = ANTDVX_ICONS_REGISTERED.find((x) => x.name === name);

  if (cur) {
    cur.comp = comp;
  } else {
    ANTDVX_ICONS_REGISTERED.push({
      name,
      comp
    });
  }

  return comp;
}