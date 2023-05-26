import { defineComponent, KeepAlive, onMounted, ref } from 'vue';
import { RouterView } from 'vue-router';
import { ConfigProvider } from 'ant-design-vue';
import { createXModal, TransitionSlide, XModal } from 'antdvx';
import { getMatchedRoute } from 'antdvx/helpers';

import { AppStore } from '@/app/core/store';
import { i18n } from '@/app/i18n';
import { ProgressBar } from '@/app/shared/progress-bar';
import { Api } from '@/mocks';

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
          import('@/app/shared/passport/forms/update-password').then(({ default: UpdatePassword }) => {
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
                    <div class='tw-px-12 tw-pb-8 tw-pt-4'>
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
        <XModal {...ctx.popupRefs.updatePassword} />
      </ConfigProvider>
    );
  }
});
