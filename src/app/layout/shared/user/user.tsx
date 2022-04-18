import { Subscription } from 'rxjs';
import { useRoute, useRouter } from 'vue-router';
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { Dropdown, Menu, MenuDivider, MenuItem } from 'ant-design-vue';
import { IconArrowDownSLine, IconLockLine, IconLogoutBoxLine } from '@/antdvx';

import { i18nMessages } from '@/app/i18n';
import { AppStore } from '@/app/core/store';
import { UserType } from '@/app/core/types';
import { login$, logout$ } from '@/app/core/events';
import { authService, sessionService } from '@/app/core/services';

import $styles from './user.module.less';

/**
 * 用户信息状态栏
 */
export const NavUser = defineComponent({
  name: 'NavUser',
  setup() {
    const route = useRoute();
    const router = useRouter();

    let loginOn: Subscription;
    let lougoutOn: Subscription;

    const user = ref<UserType>();
    const currentRole = ref([]);

    // 个性化弹出层
    const individuation = () => {
      AppStore.getPopupRefs().individuation.handler.present();
    };

    // 切换角色
    const updateRole = (e) => {
      if (e.key) {
        currentRole.value = [e.key];
        sessionService.updateRole(e.key);
        if (route.name === authService.config.homePage) {
          window.location.reload();
        } else {
          const r = router.resolve({
            name: authService.config.homePage
          });
          if (r) {
            window.location.href = r.href;
          }
          window.location.reload();
        }
      }
    };

    // 修改密码
    const updatePassword = () => {
      const popup = AppStore.getPopupRefs().updatePassword;
      popup.compProps.username = sessionService.user.username;
      popup.compProps.readonly = true;
      popup.handler.present();
    };

    // 注销
    const logout = async () => {
      await sessionService.logout();
      // message.warning(t(i18nMessages.app.notification.logout));
    };

    onMounted(() => {
      loginOn = login$.on((data) => {
        user.value = data;
        currentRole.value = [data.role.name];
      });
      lougoutOn = logout$.on(() => {
        user.value = null;
      });
    });

    onUnmounted(() => {
      loginOn.unsubscribe();
      lougoutOn.unsubscribe();
    });

    return {
      user,
      currentRole,
      updateRole,
      individuation,
      updatePassword,
      logout
    };
  },
  render(ctx) {
    return ctx?.user ? (
      <div class='tw-flex tw-h-full tw-items-center'>
        <Dropdown
          trigger='click'
          v-slots={{
            overlay() {
              return ctx?.user?.roles ? (
                <Menu v-model={[ctx.currentRole, 'selectedKeys']} onClick={ctx.updateRole}>
                  {ctx.user.roles.map((x) => (
                    <MenuItem key={x.name}>
                      <span>{x.label}</span>
                    </MenuItem>
                  ))}
                </Menu>
              ) : undefined;
            }
          }}
        >
          <div class={$styles.dropdown}>
            <div class={$styles.username}>{ctx.currentRole?.[0]}</div>
            <IconArrowDownSLine />
          </div>
        </Dropdown>
        <Dropdown
          trigger='click'
          v-slots={{
            overlay() {
              return (
                <Menu>
                  {/* <MenuItem onClick={ctx.individuation}>
                    <div class='tw-flex tw-items-center tw-gap-1'>
                      <IconTShirtLine />
                      <span>{ctx.$t(i18nMessages.app.navbar.individuation)}</span>
                    </div>
                  </MenuItem>
                  <MenuDivider /> */}
                  <MenuItem onClick={ctx.updatePassword}>
                    <div class='tw-flex tw-items-center tw-gap-1'>
                      <IconLockLine />
                      <span>{ctx.$t(i18nMessages.app.navbar.updatePassword)}</span>
                    </div>
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={ctx.logout}>
                    <div class='tw-flex tw-items-center tw-gap-1'>
                      <IconLogoutBoxLine />
                      <span>{ctx.$t(i18nMessages.app.navbar.logOut)}</span>
                    </div>
                  </MenuItem>
                </Menu>
              );
            }
          }}
        >
          <div class={$styles.dropdown}>
            <div class={$styles.username}>{ctx.user.username}</div>
            <img class={$styles.avatar} src={ctx.user.avatar} alt='' title='' />
          </div>
        </Dropdown>
      </div>
    ) : undefined;
  }
});
