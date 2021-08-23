import { Component, h } from '@vue/runtime-core';
import { defineAsyncComponent, defineComponent } from 'vue';

import { IconfontProps } from './types';
import { ANTDVX_ICONS_REGISTERED, ANTDVX_ICON_NAMES } from './config';

import './iconfont.scss';

export const Iconfont = defineComponent({
  name: 'iconfont',
  props: IconfontProps,
  setup(props) {
    let comp: Component;

    if (props.name) {
      const exsitIcon = ANTDVX_ICONS_REGISTERED.find((x) => x.name === props.name);
      if (exsitIcon) {
        comp = exsitIcon.comp;
      } else {
        if (ANTDVX_ICON_NAMES.includes(props.name)) {
          comp = defineAsyncComponent(() =>
            import(`./remixicons/${props.name}`).then((res) => {
              return res.default;
            })
          );
        } else {
          comp = <span title={props.name} />;
          console.warn(`The iconfont name '${props.name}' is not registed.`);
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
