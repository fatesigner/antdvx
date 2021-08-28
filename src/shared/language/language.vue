<template>
  <ADropdown>
    <div :class="$style.dropdown">
      <IconGlobalLine class="tw-mr-1" /><span :class="$style.text">{{ currentLang }}</span>
    </div>
    <template #overlay>
      <AMenu v-model:selectedKeys="selectedKeys" @click="langSelected">
        <AMenuItem :key="item.value" v-for="item in langs"> {{ item.name }}&nbsp;&nbsp;{{ item.text }} </AMenuItem>
      </AMenu>
    </template>
  </ADropdown>
</template>

<script lang="ts">
import { IconGlobalLine } from '@/antdvx';
import { computed, defineComponent } from 'vue';
import { Dropdown, Menu } from 'ant-design-vue';

import { Languages } from '@/i18n';
import { AppStore } from '@/app/store';

export default defineComponent({
  components: { IconGlobalLine, [Dropdown.name]: Dropdown, [Menu.name]: Menu, [Menu.Item.name]: Menu.Item },
  setup() {
    const langs = Languages.arr;

    // Set current lang
    const selectedKeys = computed(() => {
      return [AppStore.state.lang];
    });

    // Get current lang name
    const currentLang = computed(() => {
      return Languages.arr.find((x) => x.value === selectedKeys.value?.[0])?.name;
    });

    // When user click item, update lang
    const langSelected = (item: any) => {
      if (item.key) {
        AppStore.setLang(item.key);
      }
    };

    return {
      langs,
      selectedKeys,
      currentLang,
      langSelected
    };
  }
});
</script>

<style lang="scss" module>
@import '@/theme/default.theme';

.dropdown {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 12px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.065);
  }
}

.text {
  width: 20px;
  margin-top: 1px;
  overflow: hidden;
  font-size: 12px;
  text-overflow: ellipsis;
}
</style>
