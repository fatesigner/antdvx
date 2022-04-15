import to from 'await-to-js';
import { Field as VeeField } from 'vee-validate';
import { PropType, defineComponent, onDeactivated, reactive, ref } from 'vue';
import { Alert, Form, FormItem, Input, InputPassword, notification } from 'ant-design-vue';
import { IconLockLine, IconLockUnlockLine, IconUserLine, SlideCaptcha, TransitionCollapse, XButton } from '@/antdvx';

import { i18nMessages } from '@/app/i18n';
import { createForm } from '@/app/plugins/vee-validate';
import { localStorageService } from '@/app/core/services';

import $styles from '../passport.module.less';

/**
 * 更新密码
 */
export const UpdatePassword = defineComponent({
  name: 'UpdatePassword',
  props: {
    username: String,
    readonly: {
      type: Boolean,
      default: false
    },
    notify: {
      type: Boolean,
      default: false
    },
    showCaptcha: {
      type: Boolean,
      default: false
    },
    captchaImages: Array,
    updatePasswordSubmit: Function as PropType<(values: Record<string, any>) => Promise<any>>
  },
  emits: ['back'],
  setup(props, { emit }) {
    const submitBtnRef = ref<any>();

    // 验证码
    const captcha = reactive({
      valid: false,
      presented: false
    });

    const back = () => {
      emit('back');
    };

    // 定义表单
    const form = createForm<any>(
      {
        validateOnMount: false,
        initialValues: {
          username: '',
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        },
        validationSchema: {
          username: 'required',
          oldPassword: 'required',
          newPassword: 'required|password:8,15',
          confirmPassword: 'required|confirmed:@newPassword'
        }
      },
      async (values) => {
        if (process.env.APP_DEBUG !== 'true') {
          if (props.showCaptcha && !captcha.valid) {
            // 弹出验证码控件
            captcha.presented = true;
            return;
          }
        }

        if (props.updatePasswordSubmit) {
          const [err] = await to(props.updatePasswordSubmit(values));
          if (err) {
            if (props.notify) {
              notification.error({ message: err.message, duration: 1 });
            }
          } else {
            back();
          }
        }
      }
    );

    form.context.resetForm({
      values: {
        username: (localStorageService.get('loginInfo') as any)?.Account ?? ''
      }
    });

    if (props.username) {
      form.context.resetForm({
        values: {
          username: props.username
        }
      });
    }

    onDeactivated(() => {
      captcha.valid = false;
    });

    return {
      captcha,
      form,
      submitBtnRef,
      back
    };
  },
  render(ctx) {
    return (
      <Form class={$styles.form} layout='horizontal' labelCol={{ style: { width: '90px' } }}>
        <FormItem>
          <Alert
            type='warning'
            v-slots={{
              description() {
                return (
                  <div>
                    The password must contains 8 to 15 characters and special characters, such as %, &, and #. The password must contain types of uppercase
                    letters, lowercase letters, and digits.
                  </div>
                );
              }
            }}
          />
        </FormItem>
        {!ctx.readonly ? (
          <FormItem>
            <VeeField
              name='username'
              label='User Name'
              v-slots={{
                default({ field, handleChange, meta, errors }) {
                  return [
                    <Input
                      class='tw-w-full'
                      allowClear
                      size='large'
                      value={field.value}
                      placeholder={ctx.$t(i18nMessages.app.passport.updatePassword.username)}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      v-slots={{
                        prefix() {
                          return <IconUserLine />;
                        }
                      }}
                    />,
                    <TransitionCollapse>
                      {meta.touched && !meta.valid && errors.length ? <div class='invalid-message'>{errors[0]}</div> : ''}
                    </TransitionCollapse>
                  ];
                }
              }}
            />
          </FormItem>
        ) : undefined}
        <FormItem>
          <VeeField
            name='oldPassword'
            label='Old Password'
            v-slots={{
              default({ field, handleChange, meta, errors }) {
                return [
                  <InputPassword
                    class='tw-w-full'
                    allowClear
                    size='large'
                    value={field.value}
                    placeholder={ctx.$t(i18nMessages.app.passport.updatePassword.oldPassword)}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    v-slots={{
                      prefix() {
                        return <IconLockLine />;
                      }
                    }}
                  />,
                  <TransitionCollapse>{meta.touched && !meta.valid && errors.length ? <div class='invalid-message'>{errors[0]}</div> : ''}</TransitionCollapse>
                ];
              }
            }}
          />
        </FormItem>
        <FormItem>
          <VeeField
            name='newPassword'
            label='New Password'
            v-slots={{
              default({ field, handleChange, meta, errors }) {
                return [
                  <InputPassword
                    class='tw-w-full'
                    allowClear
                    size='large'
                    value={field.value}
                    placeholder={ctx.$t(i18nMessages.app.passport.updatePassword.newPassword)}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    v-slots={{
                      prefix() {
                        return <IconLockUnlockLine />;
                      }
                    }}
                  />,
                  <TransitionCollapse>{meta.touched && !meta.valid && errors.length ? <div class='invalid-message'>{errors[0]}</div> : ''}</TransitionCollapse>
                ];
              }
            }}
          />
        </FormItem>
        <FormItem>
          <VeeField
            name='confirmPassword'
            label='Confirm Password'
            v-slots={{
              default({ field, handleChange, meta, errors }) {
                return [
                  <InputPassword
                    class='tw-w-full'
                    allowClear
                    size='large'
                    value={field.value}
                    placeholder={ctx.$t(i18nMessages.app.passport.updatePassword.confirmPassword)}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    v-slots={{
                      prefix() {
                        return <IconLockUnlockLine />;
                      }
                    }}
                  />,
                  <TransitionCollapse>{meta.touched && !meta.valid && errors.length ? <div class='invalid-message'>{errors[0]}</div> : ''}</TransitionCollapse>
                ];
              }
            }}
          />
        </FormItem>
        {ctx.showCaptcha ? (
          <FormItem>
            <SlideCaptcha
              images={ctx.captchaImages}
              v-models={[
                [ctx.captcha.presented, 'presented'],
                [ctx.captcha.valid, 'valid']
              ]}
              onUpdate:valid={(valid) => {
                if (valid) {
                  // 自动提交
                  ctx.submitBtnRef?.$el?.click();
                }
              }}
            />
          </FormItem>
        ) : undefined}
        <FormItem>
          <XButton
            class={$styles.submit}
            ref='submitBtnRef'
            block
            color='secondary'
            size='large'
            type='primary'
            loading={ctx.form.isSubmitting}
            onClick={ctx.form.submit}>
            {ctx.$t(i18nMessages.app.passport.updatePassword.submit)}
          </XButton>
          {ctx.$slots?.extra?.()}
        </FormItem>
      </Form>
    );
  }
});
