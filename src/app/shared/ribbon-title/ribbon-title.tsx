import { ANTDVX_COLORS } from '@/antdvx';
import { PropType, defineComponent, onMounted, ref, watch } from 'vue';

import './ribbon-title.less';

/**
 * 缎带样式标题栏
 */
export const RibbonTitle = defineComponent({
  name: 'RibbonTitle',
  props: {
    color: {
      type: String as PropType<typeof ANTDVX_COLORS[number] | string>,
      default: 'primary'
    },
    position: {
      type: String as PropType<'left' | 'right' | 'both'>
    }
  },
  setup(props) {
    const wrapRef = ref<HTMLElement>();

    const bgColor = ref();

    const updateColor = (val) => {
      if (ANTDVX_COLORS.includes(val as any)) {
        bgColor.value = undefined;
      } else {
        bgColor.value = val;
        if (wrapRef.value) {
          const style = wrapRef.value.style;
          style.setProperty('--color', val);
          style.setProperty('--color2', val);
          style.setProperty('--color3', val);

          const before = window.getComputedStyle(wrapRef.value, ':before');
          const after = window.getComputedStyle(wrapRef.value, ':after');

          if (before) {
            // before.borderTopColor = val;
            // before.borderRightColor = val;
            // before.borderBottomColor = val;
          }

          if (after) {
            // after.borderTopColor = val;
            // after.borderRightColor = val;
            // after.borderLeftColor = val;
          }
        }
      }
    };

    watch(
      () => props.color,
      (val) => {
        updateColor(val);
      }
    );

    onMounted(() => {
      updateColor(props.color);
    });

    return {
      wrapRef,
      bgColor
    };
  },
  render(ctx) {
    return (
      <div class={['ribbon-title', ctx.bgColor ? undefined : 'ribbon-title-' + ctx.color]} ref='wrapRef'>
        <div class='ribbon-title-inner'>{ctx.$slots?.default()}</div>
        <div class='ribbon-shadow' />
        {[
          ctx.position === 'left' || ctx.position === 'both' ? <div class='ribbon-flag-left' /> : '',
          ctx.position === 'right' || ctx.position === 'both' ? <div class='ribbon-flag-right' /> : ''
        ]}
      </div>
    );
  }
});
