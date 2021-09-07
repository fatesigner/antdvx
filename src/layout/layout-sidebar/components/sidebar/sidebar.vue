<template>
  <ALayoutSider ref="wrapEl" :class="[$style.wrap, collapsed ? $style.collapsed : null]" :theme="theme" :width="width" v-model:collapsed="collapsed">
    <div class="tw-relative tw-flex tw-flex-col tw-h-full">
      <div class="tw-flex-initial">
        <div :class="$style.header" ref="headerEl">
          <RouterLink :to="{ name: 'dashboard' }" custom v-slot="{ href }">
            <a :class="$style.logo" :href="href">
              <img src="@/assets/img/logo.png" alt="" titlt="" />
            </a>
          </RouterLink>
          <h1 :class="$style.title" :title="title" v-show="!collapsed">{{ title }}</h1>
        </div>
      </div>
      <div class="tw-flex-1 tw-overflow-hidden tw-relative">
        <ScrollView fill-y scroll-y @scroll="onScroll">
          <Menus />
        </ScrollView>
      </div>

      <div :class="$style.border" ref="borderEl">
        <div :class="$style.septal" />
      </div>
    </div>
  </ALayoutSider>
</template>

<script lang="ts">
import { addClass, removeClass } from '@fatesigner/utils/document';
import { Subscription, animationFrameScheduler, fromEvent, merge } from 'rxjs';
import { filter, map, subscribeOn, switchMap, takeUntil, takeWhile, tap } from 'rxjs/operators';
import { computed, defineComponent, onBeforeUnmount, onMounted, reactive, ref, useCssModule, watch } from 'vue';
import { Iconfont, ScrollView, getEventArgs } from '@/antdvx';
import { Layout, Menu } from 'ant-design-vue';

import { i18nMessages } from '@/i18n';
import { ENV } from '@/app/constants';
import { LayoutSidebarStore } from '@/layout/layout-sidebar/store';

import { Menus } from '../menus';

export default defineComponent({
  components: {
    Menus,
    ScrollView,
    // Antd
    Iconfont,
    [Menu.name]: Menu,
    [Menu.Item.name]: Menu.Item,
    [Menu.SubMenu.name]: Menu.SubMenu,
    [Layout.Sider.name]: Layout.Sider
  },
  setup() {
    const $style = useCssModule();

    // 容器宽度
    const minWidth = 220;
    const maxWidth = 360;
    const width = ref(minWidth);
    let drag$: Subscription;

    const $wrap = ref<any>(null);
    const $header = ref<HTMLElement>(null);
    const $border = ref<HTMLElement>(null);

    let preOpenKeys = [];
    const openKeys = reactive([]);
    const selectedKeys = ref([]);

    const collapsed = computed({
      get: () => LayoutSidebarStore.state.collapsed,
      set(val) {
        LayoutSidebarStore.setCollapsed(val);
      }
    });

    const theme = computed({
      get: () => LayoutSidebarStore.state.theme,
      set(val) {
        LayoutSidebarStore.setTheme(val);
      }
    });

    const toggleCollapsed = (val?: boolean) => {
      LayoutSidebarStore.setCollapsed(val ?? !collapsed.value);
    };

    const onScroll = (e) => {
      if (e.target.scrollTop > 1) {
        addClass($header.value, $style.fixed);
      } else {
        removeClass($header.value, $style.fixed);
      }
    };

    const getDrag$ = (targetEl: HTMLElement) => {
      const dragArgs = {
        initialPos: {
          left: 0
        }
      };
      const mousedown$ = merge(fromEvent(targetEl, 'mousedown'), fromEvent(targetEl, 'touchstart'));
      const mousemove$ = merge(fromEvent(document.body, 'mousemove'), fromEvent(document.body, 'touchmove'));
      const mouseup$ = merge(fromEvent(document.body, 'mouseup'), fromEvent(document.body, 'touchend'));

      return mousedown$
        .pipe(
          filter(() => !collapsed.value),
          tap(() => {
            addClass($wrap.value.$el, $style.notransition);
            dragArgs.initialPos.left = $wrap.value.$el.offsetWidth;
          }),
          switchMap((start: any) =>
            mousemove$.pipe(
              map((move: any) => {
                move.preventDefault();

                const startArgs = getEventArgs(start);
                const moveArgs = getEventArgs(move);

                return dragArgs.initialPos.left + moveArgs.points[0][0] - startArgs.points[0][0];
              }),
              filter((left) => left <= maxWidth),
              takeWhile((left) => {
                if (left < minWidth) {
                  toggleCollapsed(true);
                  return false;
                } else {
                  return true;
                }
              }),
              takeUntil(
                mouseup$.pipe(
                  tap(() => {
                    width.value = $wrap.value.$el.offsetWidth;
                    removeClass($wrap.value.$el, $style.notransition);
                  })
                )
              )
            )
          )
        )
        .pipe(subscribeOn(animationFrameScheduler));
    };

    // 监听菜单收缩状态
    watch(collapsed, (newVal) => {
      if (newVal) {
        preOpenKeys = openKeys.map((x) => x);
        openKeys.splice(0, openKeys.length);
      } else {
        openKeys.splice(0, openKeys.length, ...preOpenKeys);
      }
    });

    onMounted(() => {
      setTimeout(() => {
        if ($border.value) {
          drag$ = getDrag$($border.value).subscribe((left) => {
            $wrap.value.$el.style.width = left + 'px';
          });
        }
      });
    });

    onBeforeUnmount(() => {
      if (drag$) {
        drag$.unsubscribe();
      }
    });

    return {
      i18nMessages,
      title: ENV.APP_TITLE,
      wrapEl: $wrap,
      headerEl: $header,
      borderEl: $border,
      width,
      openKeys,
      selectedKeys,
      collapsed,
      theme,
      toggleCollapsed,
      onScroll
    };
  }
});
</script>

<style lang="less" module>
.header {
  position: relative;
  display: flex;
  align-items: center;
  padding: 8px 24px 8px 24px;
  overflow: hidden;
  white-space: nowrap;

  &.fixed {
    border-bottom: 1px solid #ddd;
  }
}

.logo {
  display: block;
  padding: 6px;
  border-radius: 50%;
  transition: background-color 200ms;

  img {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background-color: rgba(197, 220, 250, 0.3);
  }
}

.title {
  margin: 0 0 0 8px;
  font-size: 14px;
  font-weight: bold;
  cursor: default;
  transition: opacity 300ms ease-in;
}

.border {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 100%;
  z-index: 1;
  width: 3px;
  cursor: ew-resize;
}

.septal {
  position: absolute;
  top: 0;
  bottom: 0;
  left: -3px;
  width: 3px;
  pointer-events: none;
  content: '';
  background: linear-gradient(to left, rgba(0, 0, 0, 0.2) 0, rgba(0, 0, 0, 0.2) 1px, rgba(0, 0, 0, 0.1) 0, transparent);
  opacity: 0.5;
  transition-timing-function: cubic-bezier(0.2, 0, 0, 1);
  transition-duration: 0.22s;
  transition-property: left, opacity, width;
}

.wrap {
  position: relative;
  height: 100%;

  &.notransition {
    flex: none !important;
    min-width: initial !important;
    max-width: initial !important;
    transition-property: none;
  }

  &.collapsed {
    .title {
      opacity: 0;
    }

    .border {
      width: 0;
    }
  }
}
</style>

<style lang="less">
.sidebar-menu {
  .ant-menu-item {
    height: 32px !important;
    line-height: 32px !important;
  }

  &.ant-menu-vertical .ant-menu-item,
  &.ant-menu-vertical-left .ant-menu-item,
  &.ant-menu-vertical-right .ant-menu-item,
  &.ant-menu-inline .ant-menu-item,
  &.ant-menu-vertical .ant-menu-submenu-title,
  &.ant-menu-vertical-left .ant-menu-submenu-title,
  &.ant-menu-vertical-right .ant-menu-submenu-title,
  &.ant-menu-inline .ant-menu-submenu-title {
    margin-top: 0;
    margin-bottom: 8px;
  }

  .ant-menu-item:last-child {
    margin-bottom: 0 !important;
  }

  &:not(.ant-menu-horizontal):not(.ant-menu-inline-collapsed) {
    padding: 0 16px 0 8px;
    border: none;

    .ant-menu-submenu-title {
      width: auto;
      border-radius: 4px;
    }

    .ant-menu-item {
      width: auto;
      padding-left: 8px !important;
      border-radius: 4px;
    }

    > .ant-menu-item,
    > .ant-menu-submenu > .ant-menu-submenu-title {
      padding-left: 16px !important;
    }

    .ant-menu-item:active,
    .ant-menu-submenu-title:active {
      background: transparent;
    }

    .ant-menu-item-selected {
      font-weight: bold;
      background-color: rgba(197, 220, 250, 0.5);
    }

    .ant-menu-inline {
      width: auto;
    }

    .ant-menu-submenu-open {
      > .ant-menu-submenu-title {
        background: #f6f6f6;
      }
    }

    .ant-menu-submenu-selected {
      > .ant-menu-submenu-title {
        font-weight: bold;
        color: #333;
        background-color: #f1f1f1;

        .ant-menu-submenu-arrow {
          color: #333;
        }
      }
    }

    .ant-menu-sub {
      position: relative;
      padding-left: 8px;
      margin-top: 8px;
      margin-bottom: 8px;
      margin-left: 16px;

      &::after {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 1px;
        height: 100%;
        content: '';
        background-color: #ddd;
      }

      > .ant-menu-item,
      > .ant-menu-submenu {
        > .ant-menu-submenu-title {
          padding-left: 8px !important;
        }
      }
    }

    &.ant-menu-vertical .ant-menu-item::after,
    &.ant-menu-vertical-left .ant-menu-item::after,
    &.ant-menu-vertical-right .ant-menu-item::after,
    &.ant-menu-inline .ant-menu-item::after {
      content: none;
    }
  }
}
</style>
