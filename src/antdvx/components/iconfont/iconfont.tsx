import { Component, h } from '@vue/runtime-core';
import { defineAsyncComponent, defineComponent } from 'vue';

import { ANTDVX_ICONS_REGISTERED, AntdvxIconNames } from './config';

export const Iconfont = defineComponent({
  name: 'iconfont',
  props: {
    name: {
      type: String,
      default: null
    },
    color: {
      type: String,
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
  setup(props) {
    let comp: Component;

    if (props.name) {
      const exsitIcon = ANTDVX_ICONS_REGISTERED.find((x) => x.name === props.name);
      if (exsitIcon) {
        comp = exsitIcon.comp;
      } else {
        if (AntdvxIconNames.includes(props.name)) {
          comp = defineAsyncComponent(() =>
            import(`./icons/${props.name}`).then((res) => {
              return res.default;
            })
          );
        } else {
          throw new Error(`The iconfont name '${props.name}' is not registed.`);
        }
      }
    }

    return {
      comp
    };
  },
  render(ctx) {
    return h(ctx.comp, ctx.$props);
  }
});
