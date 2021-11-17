<template>
  <template v-if="visible">
    <ASubMenu v-if="data.children?.length" :key="data.id" v-bind="$attrs">
      <template #icon v-if="data.icon">
        <Iconfont :name="data.icon" scale="1.2" />
      </template>
      <template #title>{{ data.label }}</template>
      <template v-for="item in data.children" :key="item.id">
        <template v-if="!item.children">
          <AMenuItem :key="item.name || item.id" @click="clickMenuItem(item)">
            <template #icon v-if="item.icon">
              <Iconfont :name="item.icon" scale="1.2" />
            </template>
            <template #title>{{ item.label }}</template>
          </AMenuItem>
        </template>
        <template v-else>
          <MenuItem :key="item.id" :data="item" />
        </template>
      </template>
    </ASubMenu>
    <AMenuItem v-else :key="data.name || data.id" @click="clickMenuItem(data)">
      <template #icon v-if="data.icon">
        <Iconfont :name="data.icon" scale="1.2" />
      </template>
      {{ data.label }}
    </AMenuItem>
  </template>
</template>

<script lang="ts">
import { Iconfont } from '@/antdvx';
import { Menu } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { PropType, defineComponent, nextTick } from 'vue';

import { IMenu } from '@/app/types/menu';

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
      nextTick(function () {
        router.push({ name: item.name });
      });
    };

    return { clickMenuItem };
  }
});
</script>
