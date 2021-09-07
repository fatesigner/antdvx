<template>
  <div :class="$style['sticky-section-top']" ref="topRef" />
  <div v-bind="$attrs" @click="goto" ref="targetRef">
    <slot v-bind="{ sticky }" />
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { getOffsetAwayFromDocument, scrollTo } from '@fatesigner/utils/document';

export default defineComponent({
  props: {
    className: {
      type: Array as PropType<string[]>
    }
  },
  setup(props) {
    const topRef = ref();
    const targetRef = ref();

    const sticky = ref(false);
    let parentEl;

    let observer: IntersectionObserver;

    const goto = () => {
      if (sticky.value && parentEl) {
        let top = getOffsetAwayFromDocument(topRef.value).top - getOffsetAwayFromDocument(parentEl).top + parentEl.scrollTop;
        scrollTo(parentEl, 0, top, 100);
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
            targetRef.value.classList.add(...props.className);
          } else {
            // fully intersects
            sticky.value = false;
            targetRef.value.classList.remove(...props.className);
          }
          //e.target.classList.toggle(props.stickyClassName, e.intersectionRatio < 1);
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

    return { topRef, targetRef, sticky, goto };
  }
});
</script>

<style lang="less" module>
.sticky-section-top {
  min-width: 1px;
  min-height: 1px;
  background-color: transparent;
}
</style>
