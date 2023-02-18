import { IconCheckLine } from 'antdvx';
import { computed, defineComponent } from 'vue';

import { AppStore } from '@/app/core/store';

/**
 * 个性化设置 弹出框
 */
export const IndividuationDrawer = defineComponent({
  name: 'IndividuationDrawer',
  setup() {
    const themes = [
      {
        name: 'light',
        title: '亮色风格',
        bg: require('./assets/light.svg')
      },
      {
        name: 'dark',
        title: '暗黑风格',
        bg: require('./assets/dark.svg')
      }
    ];

    const theme = computed({
      get: () => AppStore.state.theme,
      set(val) {
        AppStore.setTheme(val);
      }
    });

    const setTheme = (val) => {
      theme.value = val;
    };

    return {
      theme,
      themes,
      setTheme
    };
  },
  render(ctx) {
    return (
      <div class='tw-p-4'>
        <div class='tw-text-sm tw-text-black tw-mb-4'>整体风格设置</div>
        <div class='tw-flex tw-space-x-4'>
          {ctx.themes.map((x) => (
            <div
              class='tw-relative tw-cursor-pointer'
              title={x.name}
              onClick={() => {
                ctx.setTheme(x.name);
              }}>
              <img src={x.bg} alt='' title={x.title} />
              {ctx.theme === x.name ? <IconCheckLine class='tw-absolute tw-right-2 tw-bottom-2' color='danger' scale={1.2} /> : undefined}
            </div>
          ))}
        </div>
      </div>
    );
  }
});
