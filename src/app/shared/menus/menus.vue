<template>
  <AMenu class="sidebar-menu" mode="inline" :theme="theme" v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys">
    <template v-for="item in menus" :key="item.name">
      <MenuItem :data="item" :inline-indent="16" />
    </template>
  </AMenu>
</template>

<script lang="ts">
import { Menu } from 'ant-design-vue';
import { useRoute } from 'vue-router';
import { StructureTree } from '@fatesigner/utils/structure-tree';
import { computed, defineComponent, nextTick, ref, watch } from 'vue';

import { i18nMessages } from '@/app/i18n';
import { IMenu } from '@/app/types/menu';
import { AppStore } from '@/app/core/store';

import MenuItem from './menu-item.vue';

export default defineComponent({
  components: {
    MenuItem,
    [Menu.name]: Menu
  },
  setup() {
    const currentRoute = useRoute();

    const strutree = new StructureTree<IMenu>({
      idKey: 'id',
      labelKey: 'path',
      childrenKey: 'children'
    });

    const menus = ref<IMenu[]>(require('@/assets/auth/menus.json'));

    const collapsed = computed({
      get: () => AppStore.state.collapsed,
      set(val) {
        AppStore.setCollapsed(val);
      }
    });

    let preOpenKeys = [];
    const openKeys = ref([]);
    const selectedKeys = ref([]);

    const theme = computed({
      get: () => AppStore.state.theme,
      set(val) {
        AppStore.setTheme(val);
      }
    });

    // 获取指定 name 的菜单
    const getMenu = (name: string) => {
      return strutree.find(menus.value, (x) => x.name === name);
    };

    // 监听菜单收缩状态
    watch(collapsed, (newVal) => {
      if (newVal) {
        preOpenKeys = openKeys.value.map((x) => x);
        nextTick(() => {
          openKeys.value = [];
          // openKeys.value.splice(0, openKeys.value.length);
        });
      } else {
        nextTick(() => {
          openKeys.value = preOpenKeys;
          // openKeys.value.splice(0, openKeys.value.length, ...preOpenKeys);
        });
      }
    });

    // 跟随页面路由变化，切换菜单选中状态
    watch(
      () => currentRoute.fullPath,
      () => {
        let menu = getMenu(currentRoute.name as string);

        // 将父级菜单添加至 openKeys
        if (menu) {
          menu.parentNodes
            .map((x) => x.id)
            .forEach((x) => {
              if (collapsed.value) {
                if (!preOpenKeys.includes(x)) {
                  preOpenKeys.push(x);
                }
              } else {
                if (!openKeys.value.includes(x)) {
                  openKeys.value.push(x);
                }
              }
            });
        }

        selectedKeys.value = [currentRoute.name];
      },
      {
        immediate: true
      }
    );

    return {
      i18nMessages,
      menus,
      theme,
      collapsed,
      openKeys,
      selectedKeys
    };
  }
});
</script>

<style lang="less">
.sidebar-menu {
  &.ant-menu-inline.ant-menu-root .ant-menu-item,
  &.ant-menu-inline.ant-menu-root .ant-menu-submenu-title {
    transition: color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), border-color 0.3s, background 0.3s, padding 0.1s cubic-bezier(0.215, 0.61, 0.355, 1);
  }
}
</style>
