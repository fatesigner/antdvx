<template>
  <transition name="fade-transform" mode="out-in">
    <slot />
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    direction: {
      // 'up' | 'right' | 'down' | 'left'
      type: String,
      default: 'down'
    }
  }
});
</script>

<style lang="scss">
.fade-transform-leave-active {
  opacity: 1;
  transition-timing-function: ease-in;
  transition-duration: 0.1s;
  transition-property: opacity, transform;
  transform: translateY(0);
}

.fade-transform-enter-active {
  opacity: 0;
  transition-timing-function: ease-out;
  transition-duration: 0.2s;
  transition-property: opacity, transform;
  transform: translateY(10px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.fade-transform-enter-to {
  opacity: 1;
  transform: translateY(0);
}

/* router view transition */
.zoom-fade-enter-active,
.zoom-fade-leave-active {
  transition: transform 0.35s, opacity 0.28s ease-in-out;
}

.zoom-fade-enter-from {
  opacity: 0;
  transform: scale(0.97);
}

.zoom-fade-leave-to {
  opacity: 0;
  transform: scale(1.03);
}
</style>
