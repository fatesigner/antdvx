import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Modal } from 'ant-design-vue';
import { XModal } from 'antdvx';

import { authService, sessionService } from '@/app/core/services';
import PassportSso from '@/app/shared/passport/sso';
import { AvatarImage } from '@/assets';

/**
 * SSO 授权入口
 */
export default defineComponent({
  setup() {
    const router = useRouter();

    const updatePasswordPopupRef = ref();

    const onCompleted = ({ url }) => {
      // 获取 User
      let user: any;
      const matchs = url.match(/user=(\S*)$/);
      if (matchs?.[1]) {
        try {
          user = JSON.parse(decodeURI(matchs[1]).replace(/[\d.]{18,}/g, (val) => `"${val}"`));
        } catch (e) {}
      }

      if (!user) {
        return Modal.error({
          title: 'This is an error message',
          content: 'SSO login failed, Please contact the administrator...',
          onOk() {
            router.replace({ name: authService.config.authPage });
          }
        });
      }

      sessionService.login({
        username: user?.USER_NAME,
        // password: user?.password,
        userid: user?.USER_ID,
        realname: user?.realname,
        // 用户头像
        avatar: user?.avatar || AvatarImage,
        // accessToken 有效时间 24 天
        tokenExpirationTime: new Date().getTime() + 24 * 60 * 60 * 1000,
        accessToken: `Bearer ${user?.ApiToken}`,
        roles: []
      });

      // 跳转至 redirect 或者 主页
      router.replace({ name: authService.config.homePage });
    };

    return {
      onCompleted,
      updatePasswordPopupRef
    };
  },
  render(ctx) {
    return (
      <div>
        <PassportSso onCompleted={ctx.onCompleted} />
        <XModal {...ctx.updatePasswordPopupRef} />
      </div>
    );
  }
});
