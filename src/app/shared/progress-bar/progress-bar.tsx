import { computed, defineComponent } from 'vue';

import { ProgressBarStore } from './store';

import styles from './progress-bar.module.less';

export const ProgressBar = defineComponent({
  name: 'ProgressBar',
  setup() {
    const percent = computed(() => {
      return ProgressBarStore.state.percent;
    });
    const show = computed(() => {
      return ProgressBarStore.state.show;
    });
    const height = computed(() => {
      return ProgressBarStore.state.height;
    });
    const color = computed(() => {
      return ProgressBarStore.state.color;
    });

    return {
      percent,
      show,
      height,
      color
    };
  },
  render(ctx) {
    return (
      <div
        class={styles.progress}
        style={{
          width: ctx.percent + '%',
          height: ctx.height,
          opacity: ctx.show ? 1 : 0,
          'background-color': ctx.color
        }}
      />
    );
  }
});
