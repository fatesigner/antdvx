import { defineComponent } from 'vue';

import $styles from './footer.module.less';

export const AppFooter = defineComponent({
  name: 'AppFooter',
  props: {
    pure: {
      type: Boolean,
      default: false
    }
  },
  render(ctx) {
    return (
      <footer class={['tw-text-center tw-space-y-1', ctx.pure ? undefined : $styles.footer]}>
        <div class={ctx.pure ? undefined : 'tw-text-xxs tw-text-gray-700'}>Copyright 2021 All Rights Reserved Vue</div>
        <div class={ctx.pure ? undefined : 'tw-text-xxs tw-text-gray-700'}>(Only Edge、Chrome )</div>
      </footer>
    );
  }
});
