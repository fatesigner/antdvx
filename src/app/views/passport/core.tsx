import to from 'await-to-js';
import { useI18n } from 'vue-i18n';
import { defineComponent } from 'vue';
import { AxiosResponse } from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { message, notification } from 'ant-design-vue';

import { i18nMessages } from '@/app/i18n';
import { loginApi, sysUserApi } from '@/api';
import { PassportForm } from '@/app/shared/passport';
import { ResultDataLoginInEntity } from '@/api/models';
import { authService, sessionService } from '@/app/core/services';

/**
 * 授权表单
 */
export const PassportCore = defineComponent({
  setup() {
    const { t } = useI18n();
    const route = useRoute();
    const router = useRouter();

    // 登录表单 提交
    const loginSubmit = async (values) => {
      const [err, res] = await to<AxiosResponse<ResultDataLoginInEntity>>(
        loginApi.loginIn({
          loginInParm: {
            Account: values.username,
            Password: values.password
          }
        })
      );

      if (err) {
        notification.error({ message: '', description: err.message, duration: 1 });
      } else {
        const roles: typeof sessionService.user.roles =
          res?.data?.Result?.Roles?.map((x) => {
            let menus;
            if (x.MenuJson) {
              try {
                const str = x.MenuJson.replace(/[\d.]{18,}/g, (val) => `"${val}"`);
                const data = JSON.parse(str);
                if (data) {
                  menus = data ?? [];
                }
              } catch (e) {
                menus = [];
              }
            }
            return {
              id: x.ID,
              name: x.Code as any,
              label: x.Name,
              menus: menus,
              permissions: x.Permissions.map((y) => y.Name)
            };
          }) ?? [];

        sessionService.login({
          userid: res.data.Result.User?.ID,
          username: res.data.Result.User?.Account,
          // 用户头像
          avatar: require('@/assets/img/avatar_default.png'),
          // accessToken 有效时间 24 天
          tokenExpirationTime: new Date().getTime() + 24 * 60 * 60 * 1000,
          // accessToken: '',
          role: roles?.[0] as any,
          roles: roles
        });

        // 跳转至 redirect 或者 主页
        if (authService.config.redirectEnable && route.query.redirect) {
          await router.replace({ path: route.query.redirect as string });
        } else {
          await router.replace({ name: authService.config.homePage });
        }

        message.success(t(i18nMessages.app.passport.login.message));
      }
    };

    // 找回密码表单 提交
    const updatePasswordSubmit = async (values) => {
      const [err] = await to<any>(
        sysUserApi.systemManageUserUpdateUserPwd({
          changeOldUserPasswordParm: {
            Account: values.username,
            OldPassword: values.oldPassword,
            NewPassword: values.newPassword
          }
        })
      );

      if (err) {
        throw err;
      } else {
        message.success(t(i18nMessages.app.passport.updatePassword.message.submitSuccess));
      }
    };

    return {
      loginSubmit,
      updatePasswordSubmit
    };
  },
  render(ctx) {
    return (
      <PassportForm
        showCaptcha={true}
        rememberMe={true}
        notify={true}
        account={{
          username: 'sys',
          password: 'App@123!@#'
        }}
        loginSubmit={ctx.loginSubmit}
        updatePasswordSubmit={ctx.updatePasswordSubmit}
      />
    );
  }
});
