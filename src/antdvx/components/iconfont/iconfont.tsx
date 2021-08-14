import { Component, h } from '@vue/runtime-core';
import { defineAsyncComponent, defineComponent } from 'vue';

import { IconfontProps } from './types';
import { ANTDVX_ICONS_REGISTERED, AntdvxIconNames } from './config';

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
