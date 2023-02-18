import { defineComponent, nextTick, onMounted, PropType, ref, watch } from 'vue';
import { scrollTo } from '@fatesigner/utils/document';
import { fromEvent, Subscription } from 'rxjs';

import { i18nMessages } from '../../i18n/messages';
import { IconArrowUpLine } from '../iconfont';
import { Widget, WidgetProps } from '../widget';

export const XBackTop = defineComponent({
  name: 'XBackTop',
  props: {
    ...WidgetProps,
    target: {
      type: Object as PropType<HTMLElement>
    },
    threshold: {
      type: Number as PropType<number>,
      default: 400
    },
    /* throttle: {
      type: [Number, String] as PropType<number>,
      default: 100
    }, */
    duration: {
      type: Number as PropType<number>,
      default: 300
    }
  },
  setup(props) {
    let sub$: Subscription;

    const dragWidgetRef = ref<any>();
    const target_ = ref<HTMLElement>();

    const switchAction = () => {
      if (target_.value) {
        if (target_.value.scrollTop >= props.threshold) {
          dragWidgetRef.value?.present();
        } else {
          dragWidgetRef.value?.dismiss();
        }
      }
    };

    watch(
      () => props.target,
      (val) => {
        if (val) {
          target_.value = val;
        } else {
          console.error('The target is not a correct Html element');
        }
      }
    );

    watch(target_, (val) => {
      // 移除上一个 targe 绑定的事件
      if (sub$) {
        sub$.unsubscribe();
      }

      // 监听指定 target 的滚动事件
      if (val) {
        sub$ = fromEvent(val, 'scroll', { capture: false, passive: false })
          // .pipe(throttleTime(props.throttle))
          .subscribe(() => {
            switchAction();
          });
      }
    });

    onMounted(() => {
      nextTick(() => {
        if (!props.target) {
          // 默认 target 为 parent
          const $parent = dragWidgetRef.value?.$el?.parentElement;
          if ($parent) {
            target_.value = $parent as HTMLElement;
          }
        }
        switchAction();
      });
    });

    return {
      dragWidgetRef,
      target_
    };
  },
  render(ctx) {
    return (
      <Widget
        ref='dragWidgetRef'
        visible={false}
        title={ctx.title || ctx.$t(i18nMessages.antd.backTop.title)}
        right={ctx.right}
        bottom={ctx.bottom}
        dragable={ctx.dragable}
        zIndex={ctx.zIndex}
        onClick={() => {
          if (ctx.target_) {
            if (!ctx.dragWidgetRef.moving) {
              scrollTo(ctx.target_, undefined, 0, ctx.duration ?? 0);
            }
          }
        }}>
        {ctx.$slots?.default ? (
          ctx.$slots.default()
        ) : (
          <div class='antdvx-back-top'>
            <IconArrowUpLine />
          </div>
        )}
      </Widget>
    );
  }
});
