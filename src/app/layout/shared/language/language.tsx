import { IconGlobalLine } from 'antdvx';
import { computed, defineComponent } from 'vue';
import { Dropdown, Menu, MenuItem } from 'ant-design-vue';

import { Languages } from '@/app/i18n';
import { AppStore } from '@/app/core/store';

import $styles from './language.module.less';

/**
 * 国际化，切换语言
 */
export const NavLanguage = defineComponent({
  name: 'NavLanguage',
  setup() {
    const langs = Languages.arr;

    // Set current lang
    const selectedKeys = computed(() => {
      return [AppStore.state.lang];
    });

    // Get current lang name
    const currentLang = computed(() => {
      return Languages.arr.find((x) => x.value === selectedKeys.value?.[0])?.name;
    });

    // When user click item, update lang
    const langSelected = (item: any) => {
      if (item.key) {
        AppStore.setLang(item.key);
      }
    };

    return {
      langs,
      selectedKeys,
      currentLang,
      langSelected
    };
  },
  render(ctx) {
    return (
      <Dropdown
        v-slots={{
          overlay() {
            return (
              <Menu v-model={[ctx.selectedKeys, 'selectedKeys']} onClick={ctx.langSelected}>
                {ctx.langs.map((item) => (
                  <MenuItem key={item.value}>
                    <div class='tw-flex tw-items-center tw-gap-1'>
                      <span>{item.name}</span>
                      <span>{item.text}</span>
                    </div>
                  </MenuItem>
                ))}
              </Menu>
            );
          }
        }}>
        <div class={$styles.dropdown}>
          <IconGlobalLine class='tw-mr-1' />
          <span class={['tw-text-xs', $styles.text]}>{ctx.currentLang}</span>
        </div>
      </Dropdown>
    );
  }
});
