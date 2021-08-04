<template>
  <AConfigProvider :locale="locale">
    <RouterView />
  </AConfigProvider>
</template>

<script lang="ts">
import { ConfigProvider } from 'ant-design-vue';
import { defineComponent, onMounted, ref } from 'vue';

import { i18n } from '@/i18n';
import { AppStore } from '@/app/store';

export default defineComponent({
  components: { [ConfigProvider.name]: ConfigProvider },
  setup() {
    const locale = ref(null);

    const loadLang = async (lang: string) => {
      // 导入 language，非中文环境统一使用英文
      if (lang === 'zh-CN') {
        import('ant-design-vue/es/locale/zh_CN').then((res) => {
          locale.value = res.default;
        });
      } else {
        return import('ant-design-vue/es/locale/default').then((res) => {
          locale.value = res.default;
        });
      }
    };

    loadLang(AppStore.state.lang);

    onMounted(() => {
      // 注册 i18n 勾子，每当切换语言之后，将会执行
      i18n.hooks.afterSet.tapAsync(loadLang);
    });

    return {
      locale
    };
  }
});
</script>
