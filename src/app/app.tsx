import { RouterView } from 'vue-router';
import { XDrawer, createXDrawer } from '@/antdvx';
import { defineComponent, onMounted, ref } from 'vue';
import { BackTop, ConfigProvider } from 'ant-design-vue';

import { i18n } from '@/app/i18n';
import { AppStore } from '@/app/core/store';

/**
 * App
 */
export const App = defineComponent({
  name: 'app',
  components: { [ConfigProvider.name]: ConfigProvider },
  setup() {
    const locale = ref();
    const popupRefs = AppStore.getPopupRefs();

    // 个性化设置弹出层
    popupRefs.individuationDrawer = createXDrawer(
      {
        width: 300,
        title: '个性化设置'
      },
      () => import('@/app/shared/individuation').then((res) => ({ default: res.IndividuationDrawer })),
      {}
    );

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
      locale,
      individuationDrawer: popupRefs.individuationDrawer
    };
  },
  render(ctx) {
    return (
      <ConfigProvider locale={ctx.locale}>
        <RouterView />
        <BackTop>
          <div class='ant-back-top-inner'>UP</div>
        </BackTop>
        <XDrawer {...ctx.individuationDrawer} />
      </ConfigProvider>
    );
  }
});
