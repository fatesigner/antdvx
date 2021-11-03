<template>
  <div class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-full tw-pt-12 tw-pr-4 tw-pb-12 tw-pl-4" :class="$style.bg">
    <div :class="$style.container">
      <div class="tw-flex tw-justify-center tw-mb-4">
        <img width="66" height="66" src="@/assets/img/logo.png" :alt="title" :title="title" />
      </div>

      <div class="tw-mb-4 tw-text-center tw-text-xl">
        {{ title }}
      </div>

      <AAlert class="tw-mb-4" v-if="error" type="error" closable @close="closeError">
        <template #description>{{ error }}</template>
      </AAlert>

      <ComponentView :comps="comps" :active-key="activated" />
    </div>
  </div>
</template>

<script lang="ts">
import to from 'await-to-js';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { computed, defineComponent, reactive, ref } from 'vue';
import { ErrorMessage as VeeErrorMessage, Field as VeeField } from 'vee-validate';
import { Alert, Button, Checkbox, Form, Input, message, notification } from 'ant-design-vue';
import { ComponentView, IComponentViewItem, IconLockLine, IconUserLine, SlideCaptcha, TransitionCollapse, TransitionSlide, XButton } from '@/antdvx';

import { Api } from '@/mocks';
import { i18nMessages } from '@/i18n';
import { ENV } from '@/app/constants';
import { authService, sessionService } from '@/app/services';

import LoginUsername from './components/login-username.vue';
import ForgetPassword from './components/forget-password.vue';

export default defineComponent({
  components: {
    VeeErrorMessage,
    VeeField,
    XButton,
    SlideCaptcha,
    ComponentView,
    TransitionSlide,
    IconUserLine,
    IconLockLine,
    TransitionCollapse,
    [Input.name]: Input,
    [Alert.name]: Alert,
    [Button.name]: Button,
    [Checkbox.name]: Checkbox,
    [Form.name]: Form,
    [Form.Item.name]: Form.Item,
    InputPassword: Input.Password
  },
  setup() {
    const { t } = useI18n();
    const route = useRoute();
    const router = useRouter();

    // get error message
    const error = computed(() => {
      return route.params.error;
    });

    const activated = ref('login-username');

    const comps = reactive<IComponentViewItem[]>([
      {
        name: 'login',
        component: LoginUsername,
        props: {
          onForgetPasswordClick() {
            activated.value = 'forget-password';
          },
          // On Login submit
          async submit(values) {
            const [err, res] = await to(Api.login(values));

            if (err) {
              notification.error({ message: '', description: err.message, duration: 1 });
            } else {
              // 获取用户角色
              const roles = res?.roles?.map((x) => x) ?? ['admin'];

              // 菜单
              let menus = res.menus ?? [];

              menus = authService.getAuthorizedMenus(menus, roles as any);

              sessionService.login({
                username: values.username,
                password: values.password,
                userid: values.username,
                realname: values.username,
                // 用户头像
                avatar: require('@/assets/img/avatar_default.png'),
                // accessToken 有效时间 24 天
                tokenExpirationTime: new Date().getTime() + 24 * 60 * 60 * 1000,
                accessToken: 'Bearer ' + (res.accessToken || ''),
                roles: roles as any,
                menus: menus as any,
                permissions: []
              });

              // 跳转至 redirect 或者 主页
              if (authService.config.redirectEnable && route.query.redirect) {
                await router.replace({ path: route.query.redirect as string });
              } else {
                await router.replace({ name: authService.config.homePage });
              }

              message.success(t(i18nMessages.app.notification.login));
            }
          }
        }
      },
      {
        name: 'forget-password',
        component: ForgetPassword,
        props: {
          onBack() {
            activated.value = 'login';
          }
        }
      }
    ]);

    // Close error
    const closeError = () => {
      route.params.error = null;
    };

    return {
      i18nMessages,
      title: ENV.APP_TITLE,
      activated,
      comps,
      error,
      closeError
    };
  }
});
</script>

<style lang="less" module>
.container {
  min-width: 260px;
}

@screen _sm {
  .bg {
    background-color: #fff;
  }
}

@screen sm {
  .bg {
    background-color: #f2f3f5;
    background-image: url(../../assets/img/bg.svg);
    background-repeat: no-repeat, no-repeat;
    background-position: center center, center center;
    background-size: cover, cover;
  }

  .container {
    width: 360px;
    padding: 26px 46px 36px;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: rgba(0, 0, 0, 0.1) 0 0 10px;
  }
}
</style>
