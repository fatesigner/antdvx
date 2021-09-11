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
import { Layout } from 'ant-design-vue';
import { ScrollView, getEventArgs } from '@/antdvx';
import { addClass, removeClass } from '@fatesigner/utils/document';
import { Subscription, animationFrameScheduler, fromEvent, merge } from 'rxjs';
import { filter, map, subscribeOn, switchMap, takeUntil, takeWhile, tap } from 'rxjs/operators';
import { computed, defineComponent, onBeforeUnmount, onMounted, reactive, ref, useCssModule, watch } from 'vue';

import { i18nMessages } from '@/i18n';
import { ENV } from '@/app/constants';
import { LayoutSidebarStore } from '@/layout/layout-sidebar/store';

import { Menus } from '../menus';

export default defineComponent({
  components: {
    Menus,
    ScrollView,
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
