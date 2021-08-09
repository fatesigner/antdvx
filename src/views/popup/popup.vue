<template>
  <ScrollView>
    <div class="tw-p-4 tw-space-x-4">
      <ActionButton outline :handler="openModal()">打开 Modal</ActionButton>
      <ActionButton outline :handler="openModal(true)">打开 Modal（全屏）</ActionButton>
      <ActionButton outline :handler="openDrawer()">打开 Drawer</ActionButton>
      <ActionButton outline :handler="openDrawer(true)">打开 Drawer（全屏）</ActionButton>
    </div>
  </ScrollView>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ScrollView } from 'antdvx/components/scroll-view';
import { ActionButton } from 'antdvx/components/action-bars';
import { createXModal } from '@/antdvx';
import { createXDrawer } from '@/antdvx/components/drawer';

export default defineComponent({
  components: {
    ScrollView,
    ActionButton
  },
  setup() {
    const modalRef = createXModal(
      {
        comp: () => import('./form.vue'),
        props: {
          id: null
        }
      },
      {
        props: {
          title: 'modal 标题',
          width: '300px'
        }
      }
    );

    const drawerRef = createXDrawer(
      {
        comp: () => import('./form.vue'),
        props: {
          id: null
        }
      },
      {
        props: {
          title: 'drawer 标题',
          width: '66%'
        }
      }
    );

    const openModal = (fullscreen = false) => {
      return async () => {
        modalRef.compOptions.id = 'modal';
        modalRef.options.fullscreen = fullscreen;
        modalRef.present().then((e) => {
          console.log('modal presented:', e);
        });
      };
    };
    const openDrawer = (fullscreen = false) => {
      return async () => {
        drawerRef.compOptions.id = 'drawer';
        drawerRef.options.fullscreen = fullscreen;
        drawerRef.present().then((e) => {
          console.log('drawer presented:', e);
        });
      };
    };

    return { openModal, openDrawer };
  }
});
</script>
