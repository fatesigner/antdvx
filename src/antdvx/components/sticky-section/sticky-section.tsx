import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { getOffsetAwayFromDocument, scrollTo } from '@fatesigner/utils/document';

import styles from './sticky-section.module.less';

/**
 * 粘性布局, position=sticky
 */
export const StickySection = defineComponent({
  name: 'StickySection',
  inheritAttrs: false,
  props: {
    title: String,
    className: String,
    shadowTop: {
      type: Boolean,
      default: false
    },
    shadowBottom: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    let parentEl;
    let observer: IntersectionObserver;

    const topRef = ref();
    const targetRef = ref();

    const sticky = ref(false);

    const scrollToLocation = (duration: number = 100) => {
      if (sticky.value && parentEl) {
        const top = getOffsetAwayFromDocument(topRef.value).top - getOffsetAwayFromDocument(parentEl).top + parentEl.scrollTop;
        scrollTo(parentEl, 0, top, duration);
      }
    };

    const REGEXP_SCROLL_PARENT = /^(visible|hidden)/;

    /**
     * 获取可滚动的父级元素
     * @param el
     */
    const getScrollParent = function (el: HTMLElement) {
      return !(el instanceof HTMLElement) || typeof window.getComputedStyle !== 'function'
        ? null
        : el.scrollHeight >= el.clientHeight && !REGEXP_SCROLL_PARENT.test(window.getComputedStyle(el).overflowY || 'visible')
        ? el
        : getScrollParent(el.parentElement) || document.body;
    };

    onMounted(() => {
      parentEl = getScrollParent(targetRef.value);
      observer = new IntersectionObserver(
        ([e]) => {
          if (e.intersectionRatio === 0) {
            sticky.value = true;
            if (props.className) {
              targetRef.value.classList.add(...props.className.split(' '));
            }
          } else {
            // fully intersects
            sticky.value = false;
            if (props.className) {
              targetRef.value.classList.remove(...props.className.split(' '));
            }
          }
          // e.target.classList.toggle(props.stickyClassName, e.intersectionRatio < 1);
        },
        { threshold: [0, 1] }
      );

      observer.observe(topRef.value);
    });

    onUnmounted(() => {
      if (observer) {
        observer.disconnect();
      }
    });

    return { topRef, targetRef, sticky, scrollToLocation };
  },
  render(ctx) {
    return [
      <div class={styles['sticky-section-top']} ref='topRef' />,
      <div
        class={[ctx.shadowTop ? styles['sticky-shadow-top'] : undefined, ctx.shadowBottom ? styles['sticky-shadow-bottom'] : undefined]}
        ref='targetRef'
        title={ctx.title}
        {...ctx.$attrs}
      >
        {ctx.$slots.default?.({ sticky: ctx.sticky, scrollToLocation: ctx.scrollToLocation })}
      </div>
    ];
  }
});
