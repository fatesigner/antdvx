<template>
  <AMenu class="sidebar-menu" mode="inline" :theme="theme" v-model:open-keys="openKeys" v-model:selected-keys="selectedKeys">
    <template v-for="item in menus" :key="item.name">
      <MenuItem :data="item" :inline-indent="16" />
    </template>
  </AMenu>
</template>

<script lang="ts">
import { Menu } from 'ant-design-vue';
import { useRoute } from 'vue-router';
import { StructureTree } from '@fatesigner/utils/structure-tree';
import { computed, defineComponent, reactive, ref, watch } from 'vue';

import { i18nMessages } from '@/i18n';
import { IMenu } from '@/types/menu';
import { LayoutSidebarStore } from '@/layout/layout-sidebar/store';

import MenuItem from './menu-item.vue';

export default defineComponent({
  components: {
    MenuItem,
    [Menu.name]: Menu
  },
  setup() {
    // 当前路由
    const currentRoute = useRoute();

    const strutree = new StructureTree<IMenu>({
      idKey: 'id',
      labelKey: 'path',
      childrenKey: 'children'
    });

    const menus = ref<IMenu[]>(require('@/assets/auth/menus.json'));

    const openKeys = reactive([]);
    const selectedKeys = ref([]);

    const theme = computed({
      get: () => LayoutSidebarStore.state.theme,
      set(val) {
        LayoutSidebarStore.setTheme(val);
      }
    });

    // 获取指定 name 的菜单
    const getMenu = (name: string) => {
      return strutree.find(menus.value, (x) => x.name === name);
    };

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
              if (!openKeys.includes(x)) {
                openKeys.push(x);
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
      openKeys,
      selectedKeys,
      theme
    };
  }
});
</script>

<style lang="less">
.sidebar-menu {
  &.ant-menu-inline.ant-menu-root .ant-menu-item,
  &.ant-menu-inline.ant-menu-root .ant-menu-submenu-title {
    transition: color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), border-color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
      background 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), padding 0.15s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
}
</style>
