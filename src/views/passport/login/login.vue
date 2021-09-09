<template>
  <div class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-full tw-pt-12 tw-pr-4 tw-pb-12 tw-pl-4" :class="$style.bg">
    <div class="tw-min-w" :class="$style.container">
      <div class="tw-flex tw-justify-center tw-mb-4">
        <img width="80" height="80" src="@/assets/img/logo.png" :alt="title" :title="title" />
      </div>

      <div class="tw-mb-4 tw-text-center tw-text-xl">
        {{ title }}
      </div>

      <AAlert class="tw-mb-4" v-if="error" type="error" closable @close="closeError">
        <template #description>{{ error }}</template>
      </AAlert>

      <form ref="formRef" class="tw-max-w-2xl tw-m-auto" @submit="onSubmit">
        <AForm layout="vertical">
          <AFormItem>
            <VeeField name="username" v-slot="{ field, handleChange }">
              <AInput type="text" size="large" :value="field.value" @change="handleChange" placeholder="Enter user name" />
            </VeeField>
            <TransitionCollapse>
              <VeeErrorMessage class="invalid-message" name="username" />
            </TransitionCollapse>
          </AFormItem>
          <AFormItem>
            <VeeField name="password" v-slot="{ field, handleChange }">
              <InputPassword
                type="password"
                size="large"
                visibilityToggle
                :value="field.value"
                @change="handleChange"
                @keyup.enter="submit"
                placeholder="Enter user password"
              />
            </VeeField>
            <TransitionCollapse>
              <VeeErrorMessage class="invalid-message" name="password" />
            </TransitionCollapse>
          </AFormItem>
          <AFormItem>
            <SlideCaptcha v-model:presented="captcha.presented" v-model:valid="captcha.valid" @update:valid="onSlideCaptchaValid" />
          </AFormItem>
          <AFormItem>
            <XButton ref="submitBtnRef" block size="large" type="primary" :loading="isSubmitting" @click="submit">
              {{ $t(i18nMessages.app.passport.logIn) }}
            </XButton>
          </AFormItem>
        </AForm>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import to from 'await-to-js';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { SlideCaptcha, TransitionCollapse, XButton } from '@/antdvx';
import { computed, defineComponent, onDeactivated, reactive, ref } from 'vue';
import { Alert, Button, Form, Input, message, notification } from 'ant-design-vue';
import { ErrorMessage as VeeErrorMessage, Field as VeeField, useForm } from 'vee-validate';

import { Api } from '@/mocks';
import { i18nMessages } from '@/i18n';
import { ENV } from '@/app/constants';
import { authService, sessionService } from '@/app/services';

export default defineComponent({
  components: {
    VeeErrorMessage,
    VeeField,
    XButton,
    SlideCaptcha,
    TransitionCollapse,
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

    const formRef = ref<any>();
    const submitBtnRef = ref<any>();

    // get error message
    const error = computed(() => {
      return route.params.error;
    });

    // 验证码
    const captcha = reactive({
      valid: false,
      presented: false
    });

    // form
    const form = useForm({
      validateOnMount: false,
      initialValues: {
        username: '',
        password: ''
      },
      validationSchema: {
        username: 'required',
        password: 'required'
      }
    });

    if (process.env.APP_DEBUG === 'true') {
      form.resetForm({
        values: {
          username: 'admin',
          password: '12345678'
        }
      });
    }

    const onSlideCaptchaValid = (valid) => {
      if (valid) {
        // 自动提交
        submitBtnRef?.value?.$el?.click();
      }
    };

    // On submit
    const onSubmit = form.handleSubmit(async (values) => {
      if (process.env.APP_DEBUG !== 'true') {
        if (!captcha.valid) {
          // 弹出验证码控件
          captcha.presented = true;
          return;
        }
      }

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
          username: form.values.username,
          password: form.values.password,
          userid: form.values.username,
          realname: form.values.username,
          // 用户头像
          avatar: require('@/assets/img/avatar_default.png'),
          // accessToken 有效时间 24 天
          tokenExpirationTime: new Date().getTime() + 24 * 60 * 60 * 1000,
          accessToken: 'Bearer ' + (res.accessToken || ''),
          roles: roles as any,
          menus: menus as any,
          permissions: []
        });

        message.success(t(i18nMessages.app.notification.login));

        // 跳转至 redirect 或者 主页
        if (authService.config.redirectEnable && route.query.redirect) {
          router.replace({ path: route.query.redirect as string });
        } else {
          router.replace({ name: authService.config.homePage });
        }
      }
    });

    // 触发提交事件
    const submit = () => {
      formRef.value.dispatchEvent(new Event('submit'));
    };

    // Close error
    const closeError = () => {
      route.params.error = null;
    };

    onDeactivated(() => {
      captcha.valid = false;
    });

    return {
      i18nMessages,
      title: ENV.APP_TITLE,
      error,
      captcha,
      closeError,
      onSlideCaptchaValid,

      // form
      formRef,
      submitBtnRef,
      isSubmitting: form.isSubmitting,
      onSubmit,
      submit
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
