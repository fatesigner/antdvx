<template>
  <div class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-full tw-pt-12 tw-pr-4 tw-pb-12 tw-pl-4" :class="$style.bg">
    <div class="tw-min-w" :class="$style.container">
      <div class="tw-flex tw-justify-center tw-mb-4">
        <img width="80" height="80" src="@/assets/img/logo.png" :alt="title" :title="title" />
      </div>

      <div class="tw-mb-4 tw-text-center tw-text-xl">
        {{ title }}
      </div>

      <AAlert v-if="error" type="error" closable @close="closeError">
        <template #description>{{ error }}</template>
      </AAlert>

      <VeeForm :initialValues="form.state" :validation-schema="form.schema" v-slot="{ handleSubmit, isSubmitting }">
        <AForm layout="vertical">
          <AFormItem>
            <VeeField name="username" v-slot="{ field, handleChange }">
              <AInput type="text" size="large" :value="field.value" @change="handleChange" placeholder="Enter user name" />
            </VeeField>
            <VeeErrorMessage class="invalid-message" name="username" />
          </AFormItem>
          <AFormItem>
            <VeeField name="password" v-slot="{ field, handleChange }">
              <InputPassword
                type="password"
                size="large"
                visibilityToggle
                :value="field.value"
                @change="handleChange"
                @keyup.enter="handleSubmit(onSubmit)"
                placeholder="Enter user password"
              />
            </VeeField>
            <VeeErrorMessage class="invalid-message" name="password" />
          </AFormItem>
          <AFormItem>
            <SlideCaptcha v-model:presented="captcha.presented" v-model:valid="captcha.valid" @update:presented="onSlideCaptchaChange" />
          </AFormItem>
          <AFormItem>
            <AntdButton ref="submitBtnRef" block size="large" type="primary" :loading="isSubmitting" @click="handleSubmit(onSubmit)">
              {{ $t(i18nMessages.app.login.logIn) }}
            </AntdButton>
          </AFormItem>
        </AForm>
      </VeeForm>
    </div>
  </div>
</template>

<script lang="ts">
import to from 'await-to-js';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { AntdButton } from 'antdvx/components/button';
import { SlideCaptcha } from 'antdvx/components/slide-captcha';
import { computed, defineComponent, onDeactivated, reactive, ref } from 'vue';
import { Alert, Button, Form, Input, message, notification } from 'ant-design-vue';

import { env } from '@/env';
import { Api } from '@/mocks';
import { i18nMessages } from '@/i18n';
import { authService, sessionService } from '@/app/services';

export default defineComponent({
  components: {
    AntdButton,
    SlideCaptcha,
    [Input.name]: Input,
    [Input.name]: Input,
    [Alert.name]: Alert,
    [Button.name]: Button,
    [Form.name]: Form,
    [Form.Item.name]: Form.Item,
    InputPassword: Input.Password
  },
  setup() {
    const { t } = useI18n();
    const route = useRoute();
    const router = useRouter();

    const submitBtnRef = ref<any>();

    const title = env.APP_TITLE;

    // get error message
    const error = computed(() => {
      return route.params.error;
    });

    // 验证码
    const captcha = reactive({
      valid: false,
      presented: false
    });

    // form validate
    const form = {
      state: {
        username: 'admin',
        password: '12345678'
      },
      schema: {
        username: 'required',
        password: 'required'
      }
    };

    // Save response user info
    let loginResponse: any = null;

    const onSlideCaptchaChange = (visible) => {
      if (!visible) {
        // 自动提交
        submitBtnRef?.value?.$el?.click();
      }
    };

    // Login to session
    const login = () => {
      // 获取用户角色
      const roles = loginResponse?.roles?.map((x) => x.RoleCode) ?? ['admin'];

      // 菜单
      let menus = loginResponse.privileges;

      menus = authService.getAuthorizedMenus(menus, roles as any);

      sessionService.login({
        username: form.state.username,
        password: form.state.password,
        userid: form.state.username,
        realname: form.state.username,
        // 用户头像
        avatar: require('@/assets/img/avatar_default.png'),
        // accessToken 有效时间 24 天
        tokenExpirationTime: new Date().getTime() + 24 * 60 * 60 * 1000,
        accessToken: 'Bearer ' + (loginResponse.Token || ''),
        roles: roles as any,
        menus: menus as any,
        permissions: []
      });

      // 跳转至 redirect 或者 主页
      if (authService.config.redirectEnable && route.query.redirect) {
        return router.replace({ path: route.query.redirect as string });
      } else {
        return router.replace({ name: authService.config.homePage });
      }
    };

    // On submit
    const onSubmit = async (values) => {
      if (!captcha.valid) {
        // 弹出验证码控件
        captcha.presented = true;
        return;
      }

      const [err, data] = await to(Api.login(values));

      if (err) {
        notification.error({ message: '', description: err.message, duration: 1 });
      } else {
        loginResponse = data;
        await login();
        message.success(t(i18nMessages.app.notification.login));
      }
    };

    // Close error
    const closeError = () => {
      route.params.error = null;
    };

    onDeactivated(() => {
      captcha.valid = false;
    });

    return {
      submitBtnRef,
      i18nMessages,
      captcha,
      title,
      error,
      form,
      onSlideCaptchaChange,
      login,
      onSubmit,
      closeError
    };
  }
});
</script>

<style lang="scss" module>
@import '@/theme/default.theme';

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
    background-image: url(../../../assets/img/bg.svg);
    background-repeat: no-repeat, no-repeat;
    background-position: center center, center center;
    background-size: cover, cover;
  }

  .container {
    width: 360px;
    padding: 26px 46px;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: rgba(0, 0, 0, 0.1) 0 0 10px;
  }
}
</style>
