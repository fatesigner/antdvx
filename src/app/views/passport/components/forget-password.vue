<template>
  <form ref="formRef" class="tw-max-w-2xl tw-m-auto" @submit="onSubmit">
    <AForm layout="vertical">
      <AFormItem>
        <VeeField name="username" v-slot="{ field, handleChange }">
          <AInput type="text" size="large" :value="field.value" @change="handleChange" placeholder="Enter user name">
            <template #prefix>
              <IconUserLine />
            </template>
          </AInput>
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
          >
            <template #prefix>
              <IconLockLine />
            </template>
          </InputPassword>
        </VeeField>
        <TransitionCollapse>
          <VeeErrorMessage class="invalid-message" name="password" />
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
          >
            <template #prefix>
              <IconLockLine />
            </template>
          </InputPassword>
        </VeeField>
        <TransitionCollapse>
          <VeeErrorMessage class="invalid-message" name="password" />
        </TransitionCollapse>
      </AFormItem>
      <AFormItem>
        <SlideCaptcha v-model:presented="captcha.presented" v-model:valid="captcha.valid" @update:valid="onSlideCaptchaValid" />
        <div class="tw-flex tw-items-center tw-justify-between tw-mt-4">
          <div class="tw-flex-initial">
            <XButton color="primary" size="mini" type="link" @click="onBack">{{ $t(i18nMessages.app.passport.backToLogin) }}</XButton>
          </div>
          <div class="tw-flex-initial">
            <XButton color="primary" size="mini" type="link">{{ $t(i18nMessages.app.passport.register) }}</XButton>
          </div>
        </div>
        <XButton class="tw-mt-4" ref="submitBtnRef" block color="secondary" size="large" type="primary" :loading="isSubmitting" @click="submit">
          {{ $t(i18nMessages.app.passport.submit) }}
        </XButton>
      </AFormItem>
    </AForm>
  </form>
</template>

<script lang="ts">
import to from 'await-to-js';
import { PropType, defineComponent, onDeactivated, reactive, ref } from 'vue';
import { Alert, Button, Checkbox, Form, Input, notification } from 'ant-design-vue';
import { ErrorMessage as VeeErrorMessage, Field as VeeField, useForm } from 'vee-validate';
import { IconLockLine, IconUserLine, SlideCaptcha, TransitionCollapse, XButton } from '@/antdvx';

import { ENV } from '@/app/core/constants';
import { i18nMessages } from '@/app/i18n';

export default defineComponent({
  components: {
    VeeErrorMessage,
    VeeField,
    XButton,
    SlideCaptcha,
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
  props: {
    submit: Function as PropType<(values: Record<string, any>) => Promise<void>>,
    notify: {
      type: Boolean,
      default: false
    }
  },
  emits: ['back'],
  setup(props, { emit }) {
    const formRef = ref<any>();
    const submitBtnRef = ref<any>();

    // 验证码
    const captcha = reactive({
      valid: false,
      presented: false
    });

    // 自动登录
    const autoLogin = ref(true);

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
          password: 'admin'
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

      if (props.submit) {
        const [err] = await to(props.submit(values));

        if (err && props.notify) {
          notification.error({ message: '', description: err.message, duration: 1 });
        }
      }
    });

    // 触发提交事件
    const submit = () => {
      formRef.value.dispatchEvent(new Event('submit'));
    };

    const onBack = () => {
      emit('back');
    };

    onDeactivated(() => {
      captcha.valid = false;
    });

    return {
      i18nMessages,
      title: ENV.APP_TITLE,
      autoLogin,
      captcha,
      onBack,
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
