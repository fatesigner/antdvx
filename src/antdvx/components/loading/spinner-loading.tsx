import { PropType, computed, defineComponent } from 'vue';

import { ANTDVX_SIZES } from '../../constants';

import styles from './spinner-loading.module.less';

/**
 * Spinner Loading
 */
export const SpinnerLoading = defineComponent({
  name: 'spinner-loading',
  props: {
    color: String,
    width: Number,
    height: Number,
    size: {
      type: String as PropType<typeof ANTDVX_SIZES[number]>
    }
  },
  setup(props) {
    const styles = computed(() => {
      return {
        width: props.width ? props.width + 'px' : null,
        height: props.height ? props.height + 'px' : null
      };
    });

    return {
      styles
    };
  },
  render(ctx) {
    return <div class={[styles['spinner-loading'], ctx.size ? styles[ctx.size] : null]} style={ctx.styles} />;
  }
});
