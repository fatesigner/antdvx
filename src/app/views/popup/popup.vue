<template>
  <ScrollView fill-y scroll-y>
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
        <XButton outline :handler="openDrawer(false, true)">打开 Drawer（Left）</XButton>
      </div>
      <div class="tw-p-2">
        <XButton outline :handler="openDrawer(true)">打开 Drawer（全屏）</XButton>
      </div>
      <div class="tw-p-2">
        <XButton outline :handler="openDrawer(true, true)">打开 Drawer（全屏、Left）</XButton>
      </div>
    </div>

    <XModal v-bind="modalRef" />
    <XDrawer v-bind="drawerRef" />
  </ScrollView>
</template>

<script lang="ts">
import { timer } from 'rxjs';
import { defineComponent } from 'vue';
import { ScrollView, XButton, XDrawer, XModal, createXDrawer, createXModal } from '@/antdvx';

export default defineComponent({
  components: {
    XButton,
    XDrawer,
    XModal,
    ScrollView
  },
  setup() {
    const modalRef = createXModal(
      {
        title: 'modal 标题',
        fullscreen: true,
        destroyOnClose: true
      },
      async () => {
        await timer(2000).toPromise();
        return import('./form.vue');
      },
      {
        model: null,
        onDone(e) {
          // 保存成功后，关闭弹出层
          modalRef.handler.dismiss();
        }
      }
    );

    const drawerRef = createXDrawer(
      {
        width: '66%',
        title: 'drawer 标题',
        fullscreen: true
      },
      async () => {
        //await timer(2000).toPromise();
        return import('./form.vue');
      },
      {
        model: null,
        onDone(e) {
          // 保存成功后，关闭弹出层
          drawerRef.handler.dismiss();
        }
      }
    );

    const openModal = (fullscreen = false) => {
      return async () => {
        modalRef.options.fullscreen = fullscreen;
        modalRef.handler.present().then((e) => {
          //console.log('modal presented:', e);
        });
      };
    };

    const openDrawer = (fullscreen = false, left = false) => {
      return async () => {
        drawerRef.options.placement = left ? 'left' : 'right';
        drawerRef.options.fullscreen = fullscreen;
        drawerRef.handler.present().then((e) => {
          console.log('drawer presented:', e);
        });
      };
    };

    return { modalRef, drawerRef, openModal, openDrawer };
  }
});
</script>
