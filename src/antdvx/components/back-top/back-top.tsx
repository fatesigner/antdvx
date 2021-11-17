import { gsap } from 'gsap';
import { Subscription, fromEvent } from 'rxjs';
import { scrollTo } from '@fatesigner/utils/document';
import { PropType, defineComponent, nextTick, onMounted, ref, watch } from 'vue';

import { i18nMessages } from '../../i18n/messages';
import { IconArrowUpLine } from '../iconfont';

export const XBackTop = defineComponent({
  name: 'x-back-top',
  props: {
    target: {
      type: Object as PropType<HTMLElement>
    },
    right: {
      type: [Number, String] as PropType<number | string>,
      default: 60
    },
    bottom: {
      type: [Number, String] as PropType<number | string>,
      default: 20
    },
    threshold: {
      type: Number as PropType<number>,
      default: 400
    },
    /*throttle: {
      type: [Number, String] as PropType<number>,
      default: 100
    },*/
    duration: {
      type: Number as PropType<number>,
      default: 300
    }
  },
  setup(props) {
    let sub$: Subscription;

    const wrapRef = ref<HTMLElement>();
    const target_ = ref<HTMLElement>();
    const visible = ref(false);

    // 显示
    const present = () => {
      if (!visible.value) {
        visible.value = true;
        // 设置初始位置
        gsap
          .set(wrapRef.value, {
            right: props.right,
            bottom: '-100%'
          })
          .then(() => {
            // 过渡移动至 指定的 bottom 位置
            gsap.to(wrapRef.value, {
              duration: 0.3,
              ease: 'power4',
              bottom: props.bottom
            });
          });
      }
    };

    // 隐藏
    const dismiss = () => {
      if (visible.value) {
        visible.value = false;
        gsap.to(wrapRef.value, {
          duration: 0.3,
          ease: 'power4',
          bottom: -wrapRef.value.offsetHeight - 10
        });
      }
    };

    const switchAction = () => {
      if (target_.value) {
        if (target_.value.scrollTop >= props.threshold) {
          console.log('present', target_.value.scrollTop);
          present();
        } else {
          console.log('dismiss', target_.value.scrollTop);
          dismiss();
        }
      } else {
        const $parent = wrapRef.value.offsetParent;
        if ($parent) {
        }
      }
    };

    const onClick = () => {
      if (target_.value) {
        scrollTo(target_.value, undefined, 0, props.duration ?? 0);
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

    watch(target_, (val, valOld) => {
      // 移除上一个 targe 绑定的事件
      if (sub$) {
        sub$.unsubscribe();
      }

      // 监听指定 target 的滚动事件
      if (val) {
        sub$ = fromEvent(val, 'scroll', { capture: false, passive: false })
          //.pipe(throttleTime(props.throttle))
          .subscribe((e) => {
            console.log(e);
            switchAction();
          });
      }
    });

    onMounted(() => {
      nextTick(() => {
        if (!props.target) {
          // 默认 target 为 parent
          const $parent = wrapRef.value.parentElement;
          if ($parent) {
            target_.value = $parent as HTMLElement;
          }
        } else {
          //switchAction();
          present();
        }
      });
    });

    return {
      i18nMessages,
      wrapRef,
      onClick
    };
  },
  render(ctx) {
    return (
      <div class='antdvx-back-top' ref='wrapRef' title={ctx.$t(i18nMessages.antd.backTop.title)} onClick={ctx.onClick}>
        {ctx.$slots?.default ? (
          ctx.$slots.default()
        ) : (
          <div class='antdvx-back-top-shadow'>
            <IconArrowUpLine />
          </div>
        )}
      </div>
    );
  }
});
