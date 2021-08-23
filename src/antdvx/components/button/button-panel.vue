<template>
  <div class="action-panel" @click="trigger" :title="title">
    <slot />
    <div class="loading" v-if="loading">
      <IconRefreshLine spin />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { IconRefreshLine } from '../iconfont';

export default defineComponent({
  components: { IconRefreshLine },
  props: {
    title: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    handler: {
      type: [Object, Promise, Function],
      default: null
    }
  },
  data() {
    return {
      loading: false
    };
  },
  methods: {
    trigger() {
      if (this.handler) {
        this.loading = true;
        this.handler()
          .catch((err) => {
            this.$notification.error({ message: '', description: err.message });
          })
          .finally(() => {
            this.loading = false;
          });
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.action-panel {
  position: relative;
  display: inline-block;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  border-radius: 2px;
  transition: background-color 340ms ease-out;

  .fa-icon {
    margin-bottom: 5px;
  }

  &:hover {
    background-color: #f3f2f2;
  }

  &:active {
    background-color: #d6d6d6;
  }

  .loading {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.2);

    .fa-icon {
      width: 30px;
      height: 30px;
      max-width: 50%;
      max-height: 50px;
      color: #f27272;
    }
  }
}
</style>
