import { defineAsyncComponent, defineComponent } from 'vue';
import { Component, h } from '@vue/runtime-core';

import { ANTDVX_ICON_NAMES, ANTDVX_ICONS_REGISTERED } from './config';
import { IconfontProps } from './types';

export const Iconfont = defineComponent({
  name: 'Iconfont',
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
          comp = <span title={props.title} data-name={props.name} />;
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
