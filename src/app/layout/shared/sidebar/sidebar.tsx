import { computed, defineComponent, onBeforeUnmount, onMounted, provide, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { addClass, removeClass } from '@fatesigner/utils/document';
import { LayoutSider } from 'ant-design-vue';
import { ScrollView } from 'antdvx';
import { getEventArgs } from 'antdvx/utils';
import { animationFrameScheduler, fromEvent, merge, Subscription } from 'rxjs';
import { filter, map, subscribeOn, switchMap, takeUntil, takeWhile, tap } from 'rxjs/operators';

import { ENV } from '@/app/core/constants';
import { AppStore } from '@/app/core/store';
import { NavMenu } from '@/app/layout/shared/menus';
import { LogoImage } from '@/assets';

import $styles from './sidebar.module.less';

export const Sidebar = defineComponent({
  name: 'Sidebar',
  setup() {
    // 容器宽度
    const minWidth = 220;
    const maxWidth = 360;
    const width = ref(minWidth);
    let drag$: Subscription;

    const wrapRef = ref<any>();
    const headerRef = ref<HTMLElement>();
    const borderRef = ref<HTMLElement>();

    const collapsed = computed({
      get: () => AppStore.state.collapsed,
      set(val) {
        AppStore.setCollapsed(val);
      }
    });

    const theme = computed({
      get: () => AppStore.state.theme,
      set(val) {
        AppStore.setTheme(val);
      }
    });

    provide('collapsed', collapsed);

    const toggleCollapsed = (val?: boolean) => {
      AppStore.setCollapsed(val ?? !collapsed.value);
    };

    const onScroll = (e) => {
      if (e.target.scrollTop > 1) {
        addClass(headerRef.value, $styles.fixed);
      } else {
        removeClass(headerRef.value, $styles.fixed);
      }
    };

    const getDrag$ = (targetEl: HTMLElement) => {
      const dragArgs = {
        initialPos: {
          left: 0
        }
      };
      const mousedown$ = merge(fromEvent(targetEl, 'mousedown'), fromEvent(targetEl, 'touchstart'));
      const mousemove$ = merge(fromEvent(document.body, 'mousemove'), fromEvent(document.body, 'touchmove'));
      const mouseup$ = merge(fromEvent(document.body, 'mouseup'), fromEvent(document.body, 'touchend'));

      return mousedown$
        .pipe(
          filter(() => !collapsed.value),
          tap(() => {
            addClass(wrapRef.value.$el, $styles.notransition);
            dragArgs.initialPos.left = wrapRef.value.$el.offsetWidth;
          }),
          switchMap((start: any) =>
            mousemove$.pipe(
              map((move: any) => {
                move.preventDefault();

                const startArgs = getEventArgs(start);
                const moveArgs = getEventArgs(move);

                return dragArgs.initialPos.left + moveArgs.points[0][0] - startArgs.points[0][0];
              }),
              filter((left) => left <= maxWidth),
              takeWhile((left) => {
                if (left < minWidth) {
                  toggleCollapsed(true);
                  return false;
                } else {
                  return true;
                }
              }),
              takeUntil(
                mouseup$.pipe(
                  tap(() => {
                    width.value = wrapRef.value.$el.offsetWidth;
                    removeClass(wrapRef.value.$el, $styles.notransition);
                  })
                )
              )
            )
          )
        )
        .pipe(subscribeOn(animationFrameScheduler));
    };

    onMounted(() => {
      setTimeout(() => {
        if (borderRef.value) {
          drag$ = getDrag$(borderRef.value).subscribe((left) => {
            wrapRef.value.$el.style.width = left + 'px';
          });
        }
      });
    });

    onBeforeUnmount(() => {
      if (drag$) {
        drag$.unsubscribe();
      }
    });

    return {
      wrapRef,
      headerRef,
      borderRef,
      collapsed,
      width,
      theme,
      toggleCollapsed,
      onScroll
    };
  },
  render(ctx) {
    return (
      <LayoutSider
        ref='wrapRef'
        class={[$styles.wrap, ctx.collapsed ? $styles.collapsed : null]}
        theme={ctx.theme}
        width={ctx.width}
        v-model={[ctx.collapsed, 'collapsed']}>
        <div class='tw-relative tw-flex tw-h-full tw-flex-col'>
          <div class='tw-flex-initial'>
            <div class={$styles.header} ref='headerRef'>
              <RouterLink
                to={{ name: 'Portal' }}
                custom
                v-slots={{
                  default({ href }) {
                    return (
                      <a class={$styles.logo} href={href}>
                        <img src={LogoImage} alt='' title='' />
                      </a>
                    );
                  }
                }}
              />
              <h1 class={$styles.title} title='title' v-show={!ctx.collapsed}>
                {ENV.APP_TITLE}
              </h1>
            </div>
          </div>
          <div class='tw-relative tw-flex-1 tw-overflow-hidden'>
            <NavMenu mode='inline' />
          </div>
          <div class={$styles.border} ref='borderRef'>
            <div class={$styles.septal} />
          </div>
        </div>
      </LayoutSider>
    );
  }
});
