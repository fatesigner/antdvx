<template>
  <div class="spinner-loading" :class="[size ? 'spinner-loading-' + size : '']" :style="styles" />
</template>

<script lang="ts">
import { PropType, computed, defineComponent } from 'vue';

import { ANTDVX_SIZES } from '../../constants';

export default defineComponent({
  props: {
    color: String,
    width: Number,
    height: Number,
    size: {
      type: String as PropType<typeof ANTDVX_SIZES[number]>
    }
  },
  setup(props) {
    const styles = computed(() => {
      return {
        width: props.width ? props.width + 'px' : null,
        height: props.height ? props.height + 'px' : null
      };
    });

    return {
      styles
    };
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
  display: inline-block;
  width: 64px;
  height: 64px;
  border: 3px solid;
  border-color: #3498db transparent transparent transparent;
  border-radius: 50%;
  animation: spin 2s linear infinite;

  &::before,
  &::after {
    position: absolute;
    content: '';
    border: 3px solid;
    border-radius: 50%;
  }

  &::before {
    top: 6px;
    right: 6px;
    bottom: 6px;
    left: 6px;
    border-color: transparent transparent #e74c3c transparent;
    animation: spin 3s linear infinite;
  }

  &::after {
    top: 14px;
    right: 14px;
    bottom: 14px;
    left: 14px;
    border-color: transparent transparent transparent #f9c922;
    animation: spin 1.5s linear infinite;
  }

  &.spinner-loading-small {
    width: 42px;
    height: 42px;
    border-width: 2px;

    &::before {
      top: 4px;
      right: 4px;
      bottom: 4px;
      left: 4px;
      border-width: 2px;
    }

    &::after {
      top: 10px;
      right: 10px;
      bottom: 10px;
      left: 10px;
      border-width: 2px;
    }
  }

  &.spinner-loading-mini {
    width: 24px;
    height: 24px;
    border-width: 2px;

    &::before {
      top: 2px;
      right: 2px;
      bottom: 2px;
      left: 2px;
      border-width: 2px;
    }

    &::after {
      top: 6px;
      right: 6px;
      bottom: 6px;
      left: 6px;
      border-width: 2px;
    }
  }

  &.spinner-loading-large {
    width: 92px;
    height: 92px;
    border-width: 3px;

    &::before {
      top: 10px;
      right: 10px;
      bottom: 10px;
      left: 10px;
      border-width: 3px;
    }

    &::after {
      top: 24px;
      right: 24px;
      bottom: 24px;
      left: 24px;
      border-width: 3px;
    }
  }
}
</style>
