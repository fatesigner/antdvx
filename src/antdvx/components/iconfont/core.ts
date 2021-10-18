/**
 * Icon
 */

import Icon from '@ant-design/icons-vue';
import { defineComponent, h } from 'vue';
import { Component } from '@vue/runtime-core';
import { isNullOrUndefined } from '@fatesigner/utils/type-check';

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
      fill?: 'currentColor' | string;
      pid?: string;
    }[];
  }
) {
  return defineComponent({
    name: 'icon-' + name,
    props: IconfontProps,
    render(ctx) {
      return h(
        Icon,
        {
          class: ['antdvx-icon', ctx.color ? `antdvx-color-${ctx.color}` : undefined]
          //style: ctx.style
          //spin: ctx.spin,
          //rotate: ctx.rotate
          //twoToneColor: ctx.twoToneColor,
          //viewBox: options.viewBox
          // class: 'fa-icon'
        },
        {
          component() {
            return h(
              'svg',
              {
                class: [ctx.spin ? 'anticon-spin' : undefined],
                name: name,
                'aria-hidden': 'true',
                focusable: 'false',
                /* fill: 'currentColor',
                width: '1em',
                height: '1em', */
                viewBox: options.viewBox,
                style: {
                  fontSize: !isNullOrUndefined(ctx.scale) ? ctx.scale + 'em' : undefined,
                  transform: !isNullOrUndefined(ctx.rotate) ? `rotate(${ctx.rotate}deg)` : undefined
                }
              },
              {
                default() {
                  if (options?.paths?.length) {
                    return options.paths.map((x, index) => {
                      return h('path', {
                        d: x.d,
                        fill: ctx?.colors?.[index] ?? x.fill ?? 'currentColor',
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
          /*default() {
            if (options?.paths?.length) {
              return options.paths.map((x, index) => {
                return h('path', {
                  d: x.d,
                  fill: ctx?.colors?.[index] ?? x.fill ?? 'currentColor',
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
          }*/
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
