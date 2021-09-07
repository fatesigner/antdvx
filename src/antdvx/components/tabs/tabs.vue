<template>
  <ScrollView @scroll="onScroll" ref="scrollViewRef">
    <!--<view class="tabs-border-top-shadow" v-if="border === 'top'" />-->
    <ul
      ref="tabsEl"
      :class="[
        $style.tabs,
        border ? $style['tabs-border-' + border] : null,
        scollable ? $style['tabs-scollable'] : null,
        bold ? $style['tabs-bold'] : null,
        scalable ? $style['tabs-scalable'] : null,
        transitional ? $style['tabs-transitional'] : null
      ]"
    >
      <li v-for="item in options" :key="item.name" :class="activated === item.name ? $style.activated : ''" @click="itemClick(item)">
        <div :id="viewId + '_' + item.name" :class="$style['tab-item']">
          <slot name="item" v-bind="{ item, activated: activated === item.name }">
            <div :style="activated === item.name ? { color: color } : null">{{ item.label }}</div>
          </slot>
        </div>
      </li>
      <li
        v-if="underline"
        :class="$style['tab-underline']"
        :style="{ background: color, opacity: lineOpacity, left: lineLeft + 'px', width: lineWidth + 'px' }"
      />
    </ul>
    <!--<view class="tabs-border-bottom-shadow" v-if="border === 'bottom'" />-->
  </ScrollView>
</template>

<script lang="ts">
import { getGUID } from '@fatesigner/utils/random';
import { defineComponent, nextTick, onMounted, ref, watch } from 'vue';

import { ScrollView } from '../scroll-view';

export default defineComponent({
  components: {
    ScrollView
  },
  props: {
    scollable: {
      type: Boolean,
      default: false
    },
    bold: {
      type: Boolean,
      default: false
    },
    border: {
      type: String,
      default: null
    },
    underline: {
      type: Boolean,
      default: false
    },
    scalable: {
      type: Boolean,
      default: false
    },
    transitional: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: null
    },
    options: {
      type: Array,
      default() {
        return [];
      }
    },
    value: {
      type: String,
      default: null
    }
  },
  setup(props: any, { emit }) {
    const viewId = 'tabs_' + getGUID(7);
    const scrollViewRef = ref<any>(null);
    const tabsEl = ref<HTMLElement>(null);

    const activated = ref(null);
    const lineOpacity = ref(0);
    const lineLeft = ref(0);
    const lineWidth = ref(0);

    let wrapWidth = 0;
    let tabsWidth = 0;
    let scrollLeft = 0;
    let scrollLeftOld = 0;

    const onScroll = (e) => {
      //scrollLeftOld = e.detail.scrollLeft;
    };

    const itemClick = (item) => {
      if (activated !== item.name) {
        activated.value = item.name;
      }
    };

    // 获取控件宽度
    const updateRect = () => {
      wrapWidth = scrollViewRef?.value?.$el?.offsetWidth ?? 0;
      tabsWidth = tabsEl?.value?.offsetWidth ?? 0;
    };

    // 滚动可视区域
    const scrollToCenter = async (initial?: boolean) => {
      if (!props.underline) {
        return;
      }

      if (!wrapWidth) {
        updateRect();
      }

      if (initial) {
        lineOpacity.value = 0;
      }

      await nextTick(() => {
        const $activatedTab: HTMLElement = document.querySelector(`#${viewId}_${activated.value}`);
        if (!$activatedTab) {
          return;
        }

        // 当前 tab 中心点距视窗左侧的距离
        const left = $activatedTab.offsetLeft + $activatedTab.offsetWidth / 2;

        // 距容器中心点的距离
        const diff = left - wrapWidth / 2;

        if (tabsWidth > wrapWidth) {
          scrollLeft = scrollLeftOld + diff;
        }

        lineLeft.value = scrollLeftOld + $activatedTab.offsetLeft;
        lineWidth.value = $activatedTab.offsetWidth;

        setTimeout(() => {
          lineOpacity.value = 1;
        }, 300);
      });
    };

    watch(
      () => props.value,
      (val) => {
        scrollToCenter();
        activated.value = val;
      },
      {
        immediate: true
      }
    );

    watch(activated, (val) => {
      emit('update:value', val);
    });

    onMounted(() => {
      scrollToCenter(true);
    });

    return { viewId, scrollViewRef, tabsEl, activated, wrapWidth, tabsWidth, scrollLeft, scrollLeftOld, lineOpacity, lineLeft, lineWidth, onScroll, itemClick };
  }
});
</script>

<style lang="less" module>
@import '../../themes/default.less';

.tabs-scollable {
  width: max-content;
}

.tab-item {
  text-align: center;
  cursor: pointer;
}

.tabs {
  position: relative;
  padding: 0;
  margin-bottom: 0;
  list-style: none;
  background-color: #fff;

  &:not(.tabs-scollable) {
    display: flex;
    justify-content: center;
    width: 100%;

    > li {
      flex: 1;
    }
  }

  > li:not(.tab-underline) {
    display: inline-block;
    padding: 0 20px;
    vertical-align: middle;
  }
}

.tab-underline {
  position: absolute;
  bottom: 0;
  z-index: 1;
  width: 0;
  height: 2px;
  background-color: @primary-color;
  border-radius: 2px;
}

.tabs-scalable {
  .tab-item {
    transition: transform 0.3s;
  }

  > li:not(.tab-underline) {
    &.activated {
      .tab-item {
        transform: scale(1.1);
      }
    }
  }
}

.tabs-bold {
  > li:not(.tab-underline) {
    &.activated {
      .tab-item {
        font-weight: bold;
      }
    }
  }
}

.tabs-transitional {
  .tab-underline {
    transition: opacity 0.2s, left 0.3s, width 0.3s;
  }
}

.tabs-border-top {
  border-top: 1px solid #ddd;
  box-shadow: 0 -1px 3px rgb(0 0 0 / 10%);
}

.tabs-border-bottom {
  border-bottom: 1px solid #ddd;
  box-shadow: 0 1px 2px rgba(97, 97, 97, 0.2), 0 2px 4px rgba(97, 97, 97, 0.2);
}

.tabs-border-top-shadow {
  height: 6px;
  pointer-events: none;
  content: '';
  background: linear-gradient(to top, rgba(0, 0, 0, 0.2) 0, rgba(0, 0, 0, 0.1) 2px, rgba(0, 0, 0, 0) 0, transparent);
  opacity: 0.6;
  transition-timing-function: cubic-bezier(0.2, 0, 0, 1);
  transition-duration: 0.22s;
  transition-property: left, opacity, width;
}

.tabs-border-bottom-shadow {
  height: 6px;
  pointer-events: none;
  content: '';
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0, rgba(0, 0, 0, 0.2) 1px, rgba(0, 0, 0, 0.1) 0, transparent);
  opacity: 0.6;
  transition-timing-function: cubic-bezier(0.2, 0, 0, 1);
  transition-duration: 0.22s;
  transition-property: left, opacity, width;
}
</style>
