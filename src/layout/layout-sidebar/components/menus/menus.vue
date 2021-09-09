<template>
  <AMenu class="sidebar-menu" mode="inline" :theme="theme" :inlineIndent="0" v-model:open-keys="openKeys" v-model:selected-keys="selectedKeys">
    <template v-for="item in menus" :key="item.name">
      <MenuItem :data="item" :inline-indent="16" />
    </template>
  </AMenu>
</template>

<script lang="ts">
import { Menu } from 'ant-design-vue';
import { StructureTree } from '@fatesigner/utils/structure-tree';
import { computed, defineComponent, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

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
  .ant-menu-item {
    height: 32px !important;
    line-height: 32px !important;
  }

  .anticon {
    margin-right: 4px;
    font-size: 18px;
  }

  .ant-menu-title-content {
    display: flex;
    align-items: center;
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
    margin-bottom: 0 !important;
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

      &.ant-menu-inline {
        background-color: transparent;
      }

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
