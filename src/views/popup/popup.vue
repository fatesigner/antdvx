<template>
  <ScrollView>
    <div class="tw-flex tw-flex-wrap tw-p-2">
      <div class="tw-p-2">
        <XButton outline :handler="openModal()">打开 Modal</XButton>
      </div>
      <div class="tw-p-2">
        <XButton outline :handler="openModal(true)">打开 Modal（全屏）</XButton>
      </div>
      <div class="tw-p-2">
        <XButton outline :handler="openDrawer()">打开 Drawer</XButton>
      </div>
      <div class="tw-p-2">
        <XButton outline :handler="openDrawer(true)">打开 Drawer（全屏）</XButton>
      </div>
    </div>
  </ScrollView>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue';
import { ScrollView, XButton, createXDrawer, createXModal } from 'antdvx';

export default defineComponent({
  components: {
    XButton,
    ScrollView
  },
  setup() {
    const modalRef = createXModal(
      defineAsyncComponent(() => import('./form.vue')),
      {
        id: null,
        onDone(e) {
          if (e) {
            modalRef.dismiss();
          }
        }
      },
      {
        fullscreen: true
      }
    );

    const drawerRef = createXDrawer(
      () => import('./form.vue'),
      {
        id: null,
        onDone(e) {
          if (e) {
            modalRef.dismiss();
          }
        }
      },
      {
        title: 'drawer 标题',
        width: '66%'
      }
    );

    const openModal = (fullscreen = false) => {
      return async () => {
        modalRef.compProps.id = 'modal';
        modalRef.options.fullscreen = fullscreen;
        modalRef.present().then((e) => {
          console.log('modal presented:', e);
        });
      };
    };

    const openDrawer = (fullscreen = false) => {
      return async () => {
        drawerRef.compProps.id = 'drawer';
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
