<template>
  <VeeForm :initialValues="form.state" :validation-schema="form.schema" v-slot="{ handleSubmit, isSubmitting }">
    <AForm layout="vertical">
      <AFormItem>
        <VeeField name="username" v-slot="{ field, handleChange, meta }">
          <a-input :class="{ invalid: !meta.valid }" type="text" size="large" :value="field.value" @change="handleChange" placeholder="Enter user name" />
        </VeeField>
        <VeeErrorMessage class="invalid-message" name="username" as="div" v-slot="{ message }" />
      </AFormItem>
      <AFormItem>
        <VeeField name="password" v-slot="{ field, handleChange, meta }">
          <AInput
            :class="{ invalid: !meta.valid }"
            type="password"
            size="large"
            :value="field.value"
            @change="handleChange"
            @keyup.enter="$refs.submitBtnRef.trigger()"
            placeholder="Enter user password"
          />
        </VeeField>
        <VeeErrorMessage class="invalid-message" name="password" as="div" v-slot="{ message }" />
      </AFormItem>
      <AFormItem>
        <SlideCaptcha v-model:presented="captcha.presented" v-model:valid="captcha.valid" />
      </AFormItem>
      <AFormItem>
        <XBbutton ref="submitBtnRef" block size="large" type="primary" :handler="handleSubmit.bind(null, onSubmit)">
          {{ $t(i18nMessages.app.login.logIn) }}
        </XBbutton>
      </AFormItem>
    </AForm>
  </VeeForm>
</template>

<script lang="ts">
import to from 'await-to-js';
import { defineComponent } from 'vue';
import { SlideCaptcha, XButton } from '@/antdvx';
import { Alert, Button, Form, Input, message, notification } from 'ant-design-vue';

import { Api } from '@/mocks';
import { i18nMessages } from '@/i18n';

export default defineComponent({
  components: {
    XButton,
    SlideCaptcha,
    // Antd
    [Form.name]: Form,
    [Form.Item.name]: Form.Item,
    [Input.name]: Input,
    [Input.name]: Input,
    [Alert.name]: Alert,
    [Button.name]: Button
  },
  setup() {
    // form validate
    const form = {
      state: {
        username: 'Tom',
        password: '1234'
      },
      schema: {
        username: 'required',
        password: 'required'
      }
    };

    // On submit
    const onSubmit = async (values) => {
      const [err] = await to(Api.addUser(values));

      if (err) {
        notification.error({ message: '', description: err.message, duration: 1 });
      } else {
        message.success('新增成功');
      }
    };

    return {
      i18nMessages,
      form,
      onSubmit
    };
  }
});
</script>

<style lang="scss" module>
@import '@/theme/default.theme';
</style>
