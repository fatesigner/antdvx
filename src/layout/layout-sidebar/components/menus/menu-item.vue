<template>
  <template v-if="visible">
    <ASubMenu v-if="data.children?.length" :key="data.id" v-bind="$attrs">
      <template v-slot:title>
        <Iconfont v-if="data.icon" :name="data.icon" />
        <span>{{ data.label }}</span>
      </template>
      <template v-for="item in data.children" :key="item.id">
        <template v-if="!item.children">
          <AMenuItem :key="item.name || item.id" @click="clickMenuItem(item)">
            <Iconfont v-if="item.icon" :name="item.icon" />
            <span>{{ item.label }}</span>
          </AMenuItem>
        </template>
        <template v-else>
          <MenuItem :key="item.id" :data="item" />
        </template>
      </template>
    </ASubMenu>
    <AMenuItem v-else :key="data.name || data.id" @click="clickMenuItem(data)">
      <Iconfont v-if="data.icon" :name="data.icon" />
      <span>{{ data.label }}</span>
    </AMenuItem>
  </template>
</template>

<script lang="ts">
import { Iconfont } from '@/antdvx';
import { Menu } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { PropType, defineComponent } from 'vue';

import { IMenu } from '@/types/menu';

export default defineComponent({
  name: 'menu-item',
  components: {
    Iconfont,
    [Menu.Item.name]: Menu.Item,
    [Menu.SubMenu.name]: Menu.SubMenu
  },
  props: {
    data: {
      type: Object as PropType<IMenu>,
      default: () => ({})
    }
  },
  computed: {
    visible() {
      return !this.data?.meta?.hidden;
    }
  },
  setup() {
    const router = useRouter();

    // 点击菜单
    const clickMenuItem = (item) => {
      router.push({ name: item.name });
    };

    return { clickMenuItem };
  }
});
</script>
