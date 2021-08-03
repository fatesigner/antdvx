/**
 * Icon
 */

import { PropType, defineComponent, h } from 'vue';
import Icon from '@ant-design/icons-vue';

export function createIcon(name: string, options: { viewBox: string; d: string }) {
  return defineComponent({
    name: 'icon-' + name,
    props: {
      color: {
        type: String as PropType<'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'light' | 'purple' | 'dark'>,
        default: null
      },
      style: {
        type: Object,
        default: null
      },
      scale: {
        type: [Number, String],
        default: null
      },
      spin: {
        type: Boolean,
        default: false
      },
      rotate: {
        type: Number,
        default: null
      },
      twoToneColor: {
        type: String,
        default: null
      }
    },
    render() {
      return h(
        Icon,
        {
          class: [this.color ? `anticon-color-${this.color}` : null],
          style: Object.assign(
            {},
            this.scale
              ? {
                  fontSize: this.scale + 'em'
                }
              : null,
            this.style
          ),
          spin: this.spin,
          rotate: this.rotate,
          twoToneColor: this.twoToneColor,
          viewBox: options.viewBox
          // class: 'fa-icon'
        },
        {
          default() {
            return [
              h('path', {
                d: options.d
              })
            ];
          }
        }
      );
    }
  });
}
