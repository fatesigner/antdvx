import { Transition, defineComponent } from 'vue';

import { getContentHeight } from '../../utils';

import styles from './transition-collapse.module.less';

/**
 * 折叠/展开过渡
 */
export const TransitionCollapse = defineComponent({
  name: 'transition-collapse',
  setup() {
    const onBeforeEnter = (el: HTMLElement) => {
      el.dataset.oldHeight = el.style.height;
      el.dataset.oldPaddingTop = el.style.paddingTop;
      el.dataset.oldPaddingBottom = el.style.paddingBottom;
      el.dataset.oldOverflow = el.style.overflow;

      if (!el.dataset.oldHeight) {
        // 设置绝对定位, 获取实际高度
        const el_: any = el.cloneNode(true);
        el_.classList.add(styles.visibility);
        document.body.appendChild(el_);
        const style = getComputedStyle(el_);
        if (style.boxSizing === 'content-box') {
          el.dataset.height = getContentHeight(el_) + 'px';
        } else {
          el.dataset.height = el_.offsetHeight + 'px';
        }
        document.body.removeChild(el_);
      }

      el.style.height = '0';
      el.style.paddingTop = '0';
      el.style.paddingBottom = '0';
      el.style.overflow = 'hidden';
    };

    const onEnter = (el: HTMLElement) => {
      if (el.offsetHeight === 0) {
        el.classList.add(styles.collapse);

        if (el.dataset.oldHeight) {
          el.style.height = el.dataset.oldHeight;
        } else {
          if (el.dataset.height) {
            el.style.height = el.dataset.height;
          }
        }
        el.style.paddingTop = el.dataset.oldPaddingTop ?? '';
        el.style.paddingBottom = el.dataset.oldPaddingBottom ?? '';
      }
    };

    const onAfterEnter = (el: HTMLElement) => {
      el.classList.remove(styles.collapse);

      // 还原初始 style
      el.style.height = el.dataset.oldHeight ?? '';
      el.style.paddingTop = el.dataset.oldPaddingTop ?? '';
      el.style.paddingBottom = el.dataset.oldPaddingBottom ?? '';
      el.style.overflow = el.dataset.oldOverflow ?? '';

      Object.keys(el.dataset).forEach((dataKey) => {
        delete el.dataset[dataKey];
      });
    };

    const onBeforeLeave = (el: HTMLElement) => {
      el.dataset.oldHeight = el.style.height;
      el.dataset.oldPaddingTop = el.style.paddingTop;
      el.dataset.oldPaddingBottom = el.style.paddingBottom;
      el.dataset.oldOverflow = el.style.overflow;

      if (!el.dataset.oldHeight) {
        const style = getComputedStyle(el);
        if (style.boxSizing === 'content-box') {
          el.style.height = getContentHeight(el) + 'px';
        } else {
          el.style.height = el.offsetHeight + 'px';
        }
      }
    };

    const onLeave = (el: HTMLElement) => {
      if (el.offsetHeight !== 0) {
        // for safari: add class after set height, or it will jump to zero height suddenly, weired
        el.classList.add(styles.collapse);

        el.style.height = '0';
        el.style.paddingTop = '0';
        el.style.paddingBottom = '0';
        el.style.overflow = 'hidden';
      }
    };

    const onAfterLeave = (el: HTMLElement) => {
      el.classList.remove(styles.collapse);

      // 还原初始 style
      el.style.height = el.dataset.oldHeight ?? '';
      el.style.paddingTop = el.dataset.oldPaddingTop ?? '';
      el.style.paddingBottom = el.dataset.oldPaddingBottom ?? '';
      el.style.overflow = el.dataset.oldOverflow ?? '';

      Object.keys(el.dataset).forEach((dataKey) => {
        delete el.dataset[dataKey];
      });
    };

    return {
      onBeforeEnter,
      onEnter,
      onAfterEnter,
      onBeforeLeave,
      onLeave,
      onAfterLeave
    };
  },
  render(ctx) {
    return (
      <Transition
        onBeforeEnter={ctx.onBeforeEnter}
        onEnter={ctx.onEnter}
        onAfterEnter={ctx.onAfterEnter}
        onBeforeLeave={ctx.onBeforeLeave}
        onLeave={ctx.onLeave}
        onAfterLeave={ctx.onAfterLeave}
        v-slots={{
          default: () => (ctx.$slots?.default ? ctx.$slots?.default() : '')
        }}
      />
    );
  }
});
