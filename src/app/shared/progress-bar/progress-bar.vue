<template>
  <div
    :class="$style.progress"
    :style="{
      width: percent + '%',
      height: height,
      opacity: show ? 1 : 0,
      'background-color': color
    }"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { ProgressBarStore } from './store';

export default defineComponent({
  computed: {
    percent() {
      return ProgressBarStore.state.percent;
    },
    show() {
      return ProgressBarStore.state.show;
    },
    height() {
      return ProgressBarStore.state.height;
    },
    color() {
      return ProgressBarStore.state.color;
    }
  }
});
</script>

<style lang="less" module>
.progress {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 999999;
  width: 0;
  height: 2px;
  background-color: orangered;
  border-radius: 2px;
  opacity: 1;
  transition: width 0.2s, opacity 0.4s;
}
</style>
