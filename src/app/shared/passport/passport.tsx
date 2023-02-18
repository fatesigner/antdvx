import { XButton } from 'antdvx';
import { useI18n } from 'vue-i18n';
import { PropType, defineComponent, shallowReactive } from 'vue';

import { i18nMessages } from '@/app/i18n';
import { ENV } from '@/app/core/constants';
import { ISubviewsOptions, Subviews } from 'antdvx/components/subviews';

import LoginUsername from './forms/login-username';
import UpdatePassword from './forms/update-password';

import $styles from './passport.module.less';

export interface IPassportOptions {
  notify?: boolean;
  showCaptcha?: boolean;
  loginSubmit: (values: Record<string, any>) => Promise<void>;
  updatePasswordSubmit: (values: Record<string, any>) => Promise<void>;
  account?: {
    username: string;
    password: string;
  };
}

/**
 * 通用授权表单
 */
export default defineComponent({
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
    loginSubmit: Function as PropType<(values: Record<string, any>) => Promise<void>>,
    updatePasswordSubmit: Function as PropType<(values: Record<string, any>) => Promise<void>>
  },
  setup(props) {
    const { t } = useI18n();

    const subviews = shallowReactive<ISubviewsOptions>({
      value: 'login-username',
      data: [
        {
          name: 'login',
          component: defineComponent({
            render() {
              return (
                <LoginUsername
                  v-slots={{
                    extra() {
                      return (
                        <XButton
                          class={[$styles.submit, 'tw-mt-4']}
                          block
                          size='large'
                          type='outline'
                          title={t(i18nMessages.app.passport.login.sso)}
                          onClick={() => {
                            // window.location.href = 'https://federation.basf.com/nidp/saml2/idpsend?PID=https://pcplatform.basf.com';
                            window.location.href = ENV.APP_APIHOST + '/home/samllogin';
                          }}
                        >
                          {t(i18nMessages.app.passport.login.sso)}
                        </XButton>
                      );
                    }
                  }}
                />
              );
            }
          }),
          props: {
            notify: props.notify,
            account: props.account,
            rememberMe: props.rememberMe,
            showCaptcha: props.showCaptcha,
            loginSubmit: props.loginSubmit,
            onForgetPasswordClick() {
              subviews.value = 'updatePassword';
            }
          }
        },
        {
          name: 'updatePassword',
          component: defineComponent({
            render() {
              return (
                <UpdatePassword
                  v-slots={{
                    extra() {
                      return (
                        <div class='tw-flex tw-items-center tw-justify-center tw-mt-4'>
                          <div class='tw-flex-initial'>
                            <a
                              class={$styles.link}
                              onClick={() => {
                                subviews.value = 'login';
                              }}
                            >
                              {t(i18nMessages.app.passport.updatePassword.backToLogin)}
                            </a>
                          </div>
                          {/* <div class='tw-flex-initial'>
        <XButton color='primary' size='mini' type='link'>
          {ctx.$t(i18nMessages.app.passport.register)}
        </XButton>
      </div> */}
                        </div>
                      );
                    }
                  }}
                />
              );
            }
          }),
          props: {
            notify: props.notify,
            showCaptcha: props.showCaptcha,
            updatePasswordSubmit: props.updatePasswordSubmit,
            onBack() {
              subviews.value = 'login';
            }
          }
        }
      ]
    });

    return {
      subviews
    };
  },
  render(ctx) {
    return (
      <div class={$styles.passport}>
        <Subviews keepAlive animation='slide' data={ctx.subviews.data} value={ctx.subviews.value} />
      </div>
    );
  }
});
