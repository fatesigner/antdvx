<template>
  <template v-if="visible">
    <ASubMenu v-if="data.children?.length" :key="data.id" v-bind="$attrs">
      <template v-slot:title>
        <Iconfont name="copy" />
        <span>{{ data.label }}</span>
      </template>
      <template v-for="item in data.children" :key="item.id">
        <template v-if="!item.children">
          <AMenuItem :key="item.name || item.id" @click="clickMenuItem(item)">
            <Iconfont name="copy" />
            <span>{{ $t(item.label) }}</span>
          </AMenuItem>
        </template>
        <template v-else>
          <MenuItem :key="item.id" :data="item" />
        </template>
      </template>
    </ASubMenu>
    <AMenuItem v-else :key="data.name || data.id" @click="clickMenuItem(data)">
      <Iconfont name="copy" />
      <span>{{ data.label }}</span>
    </AMenuItem>
  </template>
</template>

<script lang="ts">
import { Menu } from 'ant-design-vue';
import { PropType, defineComponent } from 'vue';
import { Iconfont } from 'antdvx/components/iconfont';

import { IMenu } from '@/types/menu';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'menu-item',
  components: {
    // Antd
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
