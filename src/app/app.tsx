import { RouterView } from 'vue-router';
import { ConfigProvider } from 'ant-design-vue';
import { getMatchedRoute } from '@/antdvx/helpers';
import { KeepAlive, defineComponent, onMounted, ref } from 'vue';
import { TransitionSlide, XDrawer, XModal, createXDrawer, createXModal } from '@/antdvx';

import { Api } from '@/mocks';
import { i18n } from '@/app/i18n';
import { AppStore } from '@/app/core/store';
import { ProgressBar } from '@/app/shared/progress-bar';

/**
 * App
 */
export const App = defineComponent({
  name: 'App',
  components: { [ConfigProvider.name]: ConfigProvider },
  setup() {
    const locale = ref();
    const popupRefs = AppStore.getPopupRefs();

    AppStore.setPopupRefs({
      updatePassword: createXModal(
        {
          width: 380,
          footer: null,
          title: 'Update password',
          destroyOnClose: true
        },
        () =>
          import('@/app/shared/passport/forms/update-password').then(({ UpdatePassword }) => {
            return {
              default: defineComponent({
                props: {
                  username: String,
                  readonly: {
                    type: Boolean,
                    default: false
                  }
                },
                render(ctx) {
                  return (
                    <div class='tw-pt-4 tw-pb-8 tw-px-12'>
                      <UpdatePassword
                        class='tw-w-full'
                        readonly={ctx.readonly}
                        username={ctx.username}
                        updatePasswordSubmit={(values) => {
                          return Api.updatePassword(values);
                        }}
                      />
                    </div>
                  );
                }
              })
            };
          })
      ),
      individuation: createXDrawer(
        {
          width: 300,
          title: '个性化设置'
        },
        () => import('@/app/layout/shared/individuation').then(({ IndividuationDrawer }) => ({ default: IndividuationDrawer })),
        {}
      )
    });

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
      popupRefs
    };
  },
  render(ctx) {
    return (
      <ConfigProvider locale={ctx.locale}>
        <RouterView
          v-slots={{
            default({ Component, route }) {
              const { key, matchedRoute } = getMatchedRoute(Component, route);
              return Component ? (
                <TransitionSlide>
                  {matchedRoute?.meta?.keepAlive ? (
                    <KeepAlive>
                      <Component key={key} />
                    </KeepAlive>
                  ) : (
                    <Component />
                  )}
                </TransitionSlide>
              ) : undefined;
            }
          }}
        />
        <ProgressBar />
        <XDrawer {...ctx.popupRefs.individuation} />
        <XModal {...ctx.popupRefs.updatePassword} />
      </ConfigProvider>
    );
  }
});
