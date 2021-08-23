<template>
  <header class="tw-relative tw-flex tw-pr-4 tw-pl-4" :class="$style.header">
    <div class="tw-flex-initial tw-self-center tw-pt-2 tw-pb-2">
      <div :class="$style.folder" @click="toggleCollapsed">
        <IconMenuLine color="primary" />
      </div>
    </div>
    <div class="tw-flex-1 tw-self-center"></div>
    <div class="tw-flex-initial">
      <User />
    </div>
    <div class="tw-flex-initial">
      <Language />
    </div>
  </header>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { IconMenuLine } from 'antdvx';

import { Language } from '@/shared/language';
import { LayoutSidebarStore } from '@/layout/layout-sidebar/store';

import { User } from '../user';

export default defineComponent({
  components: {
    User,
    Language,
    IconMenuLine
  },
  setup() {
    const collapsed = computed(() => LayoutSidebarStore.state.collapsed);

    const theme = computed({
      get: () => LayoutSidebarStore.state.theme,
      set(val) {
        LayoutSidebarStore.setTheme(val);
      }
    });

    const toggleCollapsed = () => {
      LayoutSidebarStore.setCollapsed(!collapsed.value);
    };

    return {
      collapsed,
      theme,
      toggleCollapsed
    };
  }
});
</script>

<style lang="scss" module>
@import '@/theme/default.theme';

.header {
  &::after {
    position: absolute;
    right: 0;
    bottom: -3px;
    left: 0;
    z-index: 3;
    height: 3px;
    pointer-events: none;
    content: '';
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0, rgba(0, 0, 0, 0.2) 1px, rgba(0, 0, 0, 0.1) 0, transparent);
    opacity: 0.6;
    transition-timing-function: cubic-bezier(0.2, 0, 0, 1);
    transition-duration: 0.22s;
    transition-property: left, opacity, width;
  }
}

.icon {
  font-size: 20px;
}

.title {
  margin-bottom: 0;
  font-size: 14px;
  color: inherit;
}

.logo {
  padding: 8px 8px;
  margin: 6px 0;
  color: #096dd9;
  border-radius: 16px;
  transition: background-color 100ms ease-in;

  &:hover {
    color: #333;
    background-color: #c5dcfa;
  }
}

.folder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  cursor: pointer;
  background: rgba(197, 220, 250, 0.3);
  border: 1px solid rgba(197, 220, 250, 0.3);
  border-radius: 18px 18px 18px 4px;
  transition-timing-function: ease-in;
  transition-duration: 100ms;
  transition-property: background-color, color;

  &:hover {
    color: #1672ec;
    background: rgba(197, 220, 250, 0.6);
  }

  &:active {
    background: rgba(197, 220, 250, 0.9);
  }
}
</style>
