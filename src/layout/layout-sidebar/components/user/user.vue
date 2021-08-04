<template>
  <div class="tw-flex tw-h-full" v-if="user">
    <ADropdown>
      <div :class="$style.dropdown">
        <img :class="$style.avatar" :src="user.avatar" alt="" title="" />
        <div :class="$style.username">{{ user.username }}</div>
      </div>
      <template #overlay>
        <AMenu>
          <AMenuItem>
            <IconCog />
            <span>{{ $t(i18nMessages.app.navbar.individuation) }}</span>
          </AMenuItem>
          <AMenuDivider />
          <AMenuItem @click="logout">
            <IconLogout />
            <span>{{ $t(i18nMessages.app.navbar.logOut) }}</span>
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
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { IconCog, IconLogout } from 'antdvx/components/iconfont';

import { env } from '@/env';
import { IUser } from '@/types/user';
import { i18nMessages } from '@/i18n';
import { ROLES } from '@/app/constants';
import { login$, logout$ } from '@/app/events';
import { sessionService } from '@/app/services';

export default defineComponent({
  components: {
    // Antd
    [Dropdown.name]: Dropdown,
    [Menu.name]: Menu,
    [Menu.Item.name]: Menu.Item,
    [Menu.Divider.name]: Menu.Divider,
    IconLogout,
    IconCog
  },
  setup() {
    const { t } = useI18n();

    const title = env.APP_TITLE;

    let loginUn: Subscription;
    let lougoutUn: Subscription;

    const user = ref<IUser<typeof ROLES.keys>>();

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
      title,
      user,
      logout
    };
  }
});
</script>

<style lang="scss" module>
@import '@/theme/default.theme';

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

.logout {
  float: right;
  margin-right: 10px;
  color: map-get($colors, primary);

  &:hover {
    color: map-get($colors, primary);
  }
}
</style>
