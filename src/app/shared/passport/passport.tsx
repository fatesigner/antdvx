import { useI18n } from 'vue-i18n';
import { ComponentView, IComponentViewItem } from '@/antdvx';
import { PropType, defineComponent, reactive, ref } from 'vue';

import { i18nMessages } from '@/app/i18n';

import { LoginUsername } from './forms/login-username';
import { UpdatePassword } from './forms/update-password';

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
 * 授权表单
 */
export const PassportForm = defineComponent({
  name: 'PassportForm',
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

    const activated = ref('login-username');

    const comps = reactive<IComponentViewItem[]>([
      {
        name: 'login',
        component: LoginUsername,
        props: {
          notify: props.notify,
          account: props.account,
          rememberMe: props.rememberMe,
          showCaptcha: props.showCaptcha,
          loginSubmit: props.loginSubmit,
          onForgetPasswordClick() {
            activated.value = 'updatePassword';
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
                              activated.value = 'login';
                            }}>
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
            activated.value = 'login';
          }
        }
      }
    ]);

    return {
      comps,
      activated
    };
  },
  render(ctx) {
    return (
      <div class={$styles.passport}>
        <ComponentView comps={ctx.comps} activeKey={ctx.activated} />
      </div>
    );
  }
});
