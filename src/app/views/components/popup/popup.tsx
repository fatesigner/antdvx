import { defineComponent } from 'vue';
import { createXDrawer, createXModal, XButton, XDrawer, XModal } from 'antdvx';
import { timer } from 'rxjs';

import { PageWrapper } from '@/app/shared/page-wrapper';

export default defineComponent({
  setup() {
    const modalRef = createXModal(
      {
        title: 'modal 标题',
        fullscreen: true,
        destroyOnClose: true,
        footer: false
      },
      async () => {
        await timer(2000).toPromise();
        return import('./form.popup').then(({ FormPopup }) => ({ default: FormPopup }));
      },
      {
        model: null,
        onDone() {
          // 保存成功后，关闭弹出层
          modalRef.handler.dismiss();
        }
      }
    );

    const drawerRef = createXDrawer(
      {
        width: '66%',
        title: 'drawer 标题',
        fullscreen: true,
        destroyOnClose: true
      },
      async () => {
        // await timer(2000).toPromise();
        return import('./form.popup').then(({ FormPopup }) => ({ default: FormPopup }));
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
          // console.log('modal presented:', e);
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

    return {
      modalRef,
      drawerRef,
      openModal,
      openDrawer
    };
  },
  render(ctx) {
    return (
      <PageWrapper title='Popup' overflow='scroll'>
        <div class='tw-p-2'>
          <div class='tw-flex tw-flex-wrap tw-bg-white tw-p-4'>
            <div class='tw-p-2'>
              <XButton type='outline' handler={ctx.openModal()}>
                打开 Modal
              </XButton>
            </div>
            <div class='tw-p-2'>
              <XButton type='outline' handler={ctx.openModal(true)}>
                打开 Modal（全屏）
              </XButton>
            </div>
            <div class='tw-p-2'>
              <XButton type='outline' handler={ctx.openDrawer()}>
                打开 Drawer
              </XButton>
            </div>
            <div class='tw-p-2'>
              <XButton type='outline' handler={ctx.openDrawer(false, true)}>
                打开 Drawer（Left）
              </XButton>
            </div>
            <div class='tw-p-2'>
              <XButton type='outline' handler={ctx.openDrawer(true)}>
                打开 Drawer（全屏）
              </XButton>
            </div>
            <div class='tw-p-2'>
              <XButton type='outline' handler={ctx.openDrawer(true, true)}>
                打开 Drawer（全屏、Left）
              </XButton>
            </div>
          </div>
        </div>
        <XModal {...ctx.modalRef} />
        <XDrawer {...ctx.drawerRef} />
      </PageWrapper>
    );
  }
});
