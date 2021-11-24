<template>
  <div class="tw-flex tw-h-full" v-if="user">
    <ADropdown>
      <div :class="$style.dropdown">
        <img :class="$style.avatar" :src="user.avatar" alt="" title="" />
        <div :class="$style.username">{{ user.username }}</div>
      </div>
      <template #overlay>
        <AMenu>
          <AMenuItem @click="individuation">
            <div class="tw-flex tw-items-center tw-space-x-1">
              <IconTShirtLine />
              <span>{{ $t(i18nMessages.app.navbar.individuation) }}</span>
            </div>
          </AMenuItem>
          <AMenuDivider />
          <AMenuItem @click="logout">
            <div class="tw-flex tw-items-center tw-space-x-1">
              <IconLogoutBoxLine />
              <span>{{ $t(i18nMessages.app.navbar.logOut) }}</span>
            </div>
          </AMenuItem>
        </AMenu>
      </template>
    </ADropdown>
  </div>
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { Subscription } from 'rxjs';
import { Dropdown, Menu, message } from 'ant-design-vue';
import { IconLogoutBoxLine, IconTShirtLine } from '@/antdvx';
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';

import { IUser } from '@/app/types/user';
import { i18nMessages } from '@/app/i18n';
import { AppStore } from '@/app/core/store';
import { ENV, ROLES } from '@/app/core/constants';
import { login$, logout$ } from '@/app/core/events';
import { sessionService } from '@/app/core/services';

export default defineComponent({
  components: {
    IconTShirtLine,
    IconLogoutBoxLine,
    [Dropdown.name]: Dropdown,
    [Menu.name]: Menu,
    [Menu.Item.name]: Menu.Item,
    [Menu.Divider.name]: Menu.Divider
  },
  setup() {
    const { t } = useI18n();

    let loginUn: Subscription;
    let lougoutUn: Subscription;

    const user = ref<IUser<typeof ROLES.keys>>();

    // 个性化弹出层
    const individuation = () => {
      const popupRefs = AppStore.getPopupRefs();
      popupRefs.individuation.handler.present();
    };

    const logout = async () => {
      await sessionService.logout();
      message.warning(t(i18nMessages.app.notification.logout));
    };

    onMounted(() => {
      loginUn = login$.on((data) => {
        user.value = data;
      });
      lougoutUn = logout$.on(() => {
        // user.value = null;
      });
    });

    onUnmounted(() => {
      loginUn.unsubscribe();
      lougoutUn.unsubscribe();
    });

    return {
      i18nMessages,
      title: ENV.APP_TITLE,
      user,
      logout,
      individuation
    };
  }
});
</script>

<style lang="less" module>
.dropdown {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 12px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.065);
  }
}

.avatar {
  width: 26px;
  height: 26px;
  margin-right: 8px;
  border-radius: 50%;
}

.username {
  overflow: hidden;
  font-size: 12px;
  text-align: center;
  text-overflow: ellipsis;
  text-shadow: 1px 1px #ececec;
  white-space: nowrap;
}
</style>
