<template>
  <div class="spinner-loading" :class="[size ? 'spinner-loading-' + size : '']" :style="styles" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    color: String,
    width: Number,
    height: Number,
    size: {
      type: String as () => 'small' | 'large',
      default: null
    }
  },
  computed: {
    styles() {
      return {
        width: this.width ? this.width + 'px' : null,
        height: this.height ? this.height + 'px' : null
      };
    }
  }
});
</script>

<style lang="scss" scoped>
@keyframes spin {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(1turn);
  }
}

.spinner-loading {
  position: relative;
  width: 32px;
  height: 32px;
  margin: auto;
  border: 2px solid;
  border-color: #3498db transparent transparent transparent;
  border-radius: 50%;
  animation: spin 2s linear infinite;

  &.spinner-loading-small {
    width: 24px;
    height: 24px;
  }

  &.spinner-loading-large {
    width: 64px;
    height: 64px;
    border-width: 3px;

    &::before {
      top: 5px;
      right: 5px;
      bottom: 5px;
      left: 5px;
      border-width: 3px;
    }

    &::after {
      top: 15px;
      right: 15px;
      bottom: 15px;
      left: 15px;
      border-width: 3px;
    }
  }

  &::before {
    position: absolute;
    top: 2px;
    right: 2px;
    bottom: 2px;
    left: 2px;
    content: '';
    border: 2px solid;
    border-color: transparent transparent #e74c3c transparent;
    border-radius: 50%;
    animation: spin 3s linear infinite;
  }

  &::after {
    position: absolute;
    top: 6px;
    right: 6px;
    bottom: 6px;
    left: 6px;
    content: '';
    border: 2px solid;
    border-color: transparent transparent transparent #f9c922;
    border-radius: 50%;
    animation: spin 1.5s linear infinite;
  }
}
</style>
