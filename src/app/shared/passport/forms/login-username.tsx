import to from 'await-to-js';
import { Field as VeeField } from 'vee-validate';
import { isNullOrUndefined } from '@fatesigner/utils/type-check';
import { PropType, defineComponent, onDeactivated, reactive, ref, watch } from 'vue';
import { Checkbox, Form, FormItem, Input, InputPassword, notification } from 'ant-design-vue';
import { IconLockLine, IconUserLine, SlideCaptcha, TransitionCollapse, XButton } from '@/antdvx';

import { i18nMessages } from '@/app/i18n';
import { createForm } from '@/app/plugins/vee-validate';
import { localStorageService } from '@/app/core/services';

import $styles from '../passport.module.less';

const PASSPORT_REMEMBERME = 'PASSPORT_REMEMBERME';
const PASSPORT_REMEMBERME_CHECKED = 'PASSPORT_REMEMBERME_CHECKED';

/**
 * 用户名、密码登录
 */
export const LoginUsername = defineComponent({
  name: 'LoginUsername',
  props: {
    rememberMe: {
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
    account: Object,
    captchaImages: Array,
    loginSubmit: Function as PropType<(values: Record<string, any>) => Promise<void>>
  },
  emits: ['forgetPasswordClick', 'update:rememberMe'],
  setup(props, { emit }) {
    const submitBtnRef = ref<any>();

    // 启用自动登录
    const rememberMe_ = ref(false);

    // 从缓存中 获取 AutoLogin 选项是否为选中状态
    const autoLoginChecked = localStorageService.get(PASSPORT_REMEMBERME_CHECKED) as boolean;
    if (isNullOrUndefined(autoLoginChecked)) {
      rememberMe_.value = props.rememberMe;
    } else {
      rememberMe_.value = autoLoginChecked;
    }

    // 验证码
    const captcha = reactive({
      valid: false,
      presented: false
    });

    // 定义表单
    const form = createForm(
      {
        validateOnMount: false,
        initialValues: {
          username: '',
          password: ''
        },
        validationSchema: {
          username: 'required',
          password: 'required'
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

        if (props.loginSubmit) {
          const [err] = await to(props.loginSubmit(values));
          if (err) {
            if (props.notify) {
              notification.error({ message: err.message, duration: 1 });
            }
          } else {
            // 登录成功后，保存用户名、密码信息至本地存储
            if (rememberMe_.value) {
              localStorageService.set(PASSPORT_REMEMBERME, {
                username: values.username,
                password: values.password
              });
            }
          }
        }
      }
    );

    // 自动登录
    const storageData = localStorageService.get(PASSPORT_REMEMBERME) as any;
    if (rememberMe_.value && storageData) {
      form.context.resetForm({
        values: {
          username: storageData?.username ?? '',
          password: storageData?.password ?? ''
        }
      });
    } else {
      if (process.env.APP_DEBUG === 'true') {
        // 开发模式下，自动填写一个默认账户，当启用自动登录后，跳过
        if (!form.context.values?.username && props.account) {
          form.context.resetForm({
            values: {
              username: props.account?.username,
              password: props.account?.password
            }
          });
        }
      }
    }

    watch(
      () => props.rememberMe,
      (val) => {
        if (rememberMe_.value !== val) {
          rememberMe_.value = val;
        }
      }
    );

    watch(
      rememberMe_,
      (val) => {
        if (props.rememberMe !== val) {
          emit('update:rememberMe', val);
        }
        if (val) {
          localStorageService.set(PASSPORT_REMEMBERME_CHECKED, true);
        } else {
          localStorageService.set(PASSPORT_REMEMBERME_CHECKED, false);
        }
      },
      {
        immediate: true
      }
    );

    onDeactivated(() => {
      captcha.valid = false;
    });

    return {
      rememberMe_,
      captcha,
      form,
      submitBtnRef
    };
  },
  render(ctx) {
    return (
      <Form class={$styles.form} layout='horizontal' labelCol={{ style: { width: '80px' } }}>
        <FormItem>
          <VeeField
            name='username'
            label='Username'
            v-slots={{
              default({ field, handleChange, meta }) {
                return [
                  <Input
                    class='tw-w-full'
                    allowClear
                    size='large'
                    value={field.value}
                    placeholder={ctx.$t(i18nMessages.app.passport.login.username)}
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
                    {meta.touched && !meta.valid ? <div class='invalid-message'>{ctx.$t(i18nMessages.app.passport.login.username)}</div> : ''}
                  </TransitionCollapse>
                ];
              }
            }}
          />
        </FormItem>
        <FormItem>
          <VeeField
            name='password'
            label='Password'
            v-slots={{
              default({ field, handleChange, meta }) {
                return [
                  <InputPassword
                    class='tw-w-full'
                    allowClear
                    size='large'
                    value={field.value}
                    placeholder={ctx.$t(i18nMessages.app.passport.login.password)}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    v-slots={{
                      prefix() {
                        return <IconLockLine />;
                      }
                    }}
                  />,
                  <TransitionCollapse>
                    {meta.touched && !meta.valid ? <div class='invalid-message'>{ctx.$t(i18nMessages.app.passport.login.password)}</div> : ''}
                  </TransitionCollapse>
                ];
              }
            }}
          />
        </FormItem>
        <FormItem>
          {ctx.showCaptcha ? (
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
          ) : (
            ''
          )}
        </FormItem>
        <FormItem>
          <div class='tw-flex tw-items-center tw-justify-between'>
            <div class='tw-flex-initial'>
              <Checkbox v-model={[ctx.rememberMe_, 'checked']}>{ctx.$t(i18nMessages.app.passport.login.rememberMe)}</Checkbox>
            </div>
            <div class='tw-flex-initial'>
              <a
                class={$styles.link}
                onClick={() => {
                  ctx.$emit('forgetPasswordClick');
                }}>
                {ctx.$t(i18nMessages.app.passport.updatePassword.title)}
              </a>
            </div>
          </div>
        </FormItem>
        <FormItem>
          <XButton class={$styles.submit} ref='submitBtnRef' block size='large' type='primary' loading={ctx.form.isSubmitting} onClick={ctx.form.submit}>
            {ctx.$t(i18nMessages.app.passport.login.submit)}
          </XButton>
          {ctx.$slots?.extra?.()}
        </FormItem>
      </Form>
    );
  }
});
