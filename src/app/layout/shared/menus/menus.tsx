import { IMenu } from 'antdvx/types';
import { Menu } from 'ant-design-vue';
import { useRoute, useRouter } from 'vue-router';
import { Iconfont, ScrollView, XRouterLink } from 'antdvx';
import { StructureTree } from '@fatesigner/utils/structure-tree';
import { PropType, computed, defineComponent, inject, provide, reactive, ref, watch } from 'vue';

import { sessionService } from '@/app/core/services';

import './menus.less';

const NavMenuItem = defineComponent({
  name: 'NavMenuItem',
  props: {
    data: {
      type: Object as PropType<IMenu>,
      default: () => ({})
    }
  },
  setup(props) {
    const router = useRouter();

    // const collapsed = inject('collapsed');
    const mode = inject('mode');
    const openKeys = inject('openKeys');
    const selectedKeys = inject('selectedKeys');

    const visible = computed(() => {
      return !props?.data?.hidden;
    });

    // 点击菜单
    const clickMenuItem = (item) => {
      router.push({ name: item.name });
    };

    return {
      visible,
      // collapsed,
      mode,
      openKeys,
      selectedKeys,
      clickMenuItem
    };
  },
  render(ctx) {
    return ctx.visible ? (
      ctx.data.children?.length ? (
        <Menu.SubMenu
          key={ctx.data.id}
          popupClassName='nav-menu-popup'
          {...ctx.$attrs}
          v-slots={{
            icon:
              ctx.mode === 'horizontal'
                ? undefined
                : () => {
                    return ctx.data.icon ? <Iconfont name={ctx.data.icon} /> : undefined;
                  },
            title() {
              if (!ctx.data.children?.length && (ctx.data.url || ctx.data.route)) {
                return (
                  <XRouterLink
                    to={ctx.data.url ? { path: ctx.data.url } : { name: ctx.data.route }}
                    v-slots={{
                      default() {
                        return [
                          ctx.mode === 'horizontal' ? ctx.data.icon ? <Iconfont name={ctx.data.icon} /> : undefined : undefined,
                          <span>{ctx.data.label}</span>
                        ];
                      }
                    }}
                  />
                );
              } else {
                return (
                  <div class='tw-flex tw-items-center'>
                    {ctx.mode === 'horizontal' ? ctx.data.icon ? <Iconfont name={ctx.data.icon} /> : undefined : undefined}
                    <span>{ctx.data.label}</span>
                  </div>
                );
              }
            }
          }}>
          {ctx.data.children.map((item) => {
            if (item.children) {
              return <NavMenuItem key={item.id} data={item} />;
            } else {
              return (
                <Menu.Item
                  key={item.id}
                  v-slots={{
                    default() {
                      if (item.url || item.route) {
                        return (
                          <XRouterLink
                            to={item.url ? { path: item.url } : { name: item.route }}
                            v-slots={{
                              default() {
                                return [ctx.data.icon ? <Iconfont name={ctx.data.icon} /> : undefined, <span>{item.label}</span>];
                              }
                            }}
                          />
                        );
                      } else {
                        return [ctx.data.icon ? <Iconfont name={ctx.data.icon} /> : undefined, <span>{item.label}</span>];
                      }
                    }
                  }}
                />
              );
            }
          })}
        </Menu.SubMenu>
      ) : (
        <Menu.Item
          key={ctx.data.id}
          v-slots={{
            icon:
              ctx.mode === 'horizontal'
                ? undefined
                : () => {
                    return ctx.data.icon ? <Iconfont name={ctx.data.icon} /> : undefined;
                  },
            default() {
              if (ctx.data.url || ctx.data.route) {
                return (
                  <XRouterLink
                    to={ctx.data.url ? { path: ctx.data.url } : { name: ctx.data.route }}
                    v-slots={{
                      default() {
                        return [
                          ctx.mode === 'horizontal' ? ctx.data.icon ? <Iconfont name={ctx.data.icon} /> : undefined : undefined,
                          <span>{ctx.data.label}</span>
                        ];
                      }
                    }}
                  />
                );
              } else {
                return [ctx.mode === 'horizontal' ? ctx.data.icon ? <Iconfont name={ctx.data.icon} /> : undefined : undefined, <span>{ctx.data.label}</span>];
              }
            }
          }}
        />
      )
    ) : undefined;
  }
});

/**
 * 导航菜单
 */
export const NavMenu = defineComponent({
  name: 'NavMenu',
  props: {
    mode: {
      type: String as PropType<'vertical' | 'vertical-right' | 'horizontal' | 'inline'>
    },
    theme: {
      type: String as PropType<'dark' | 'light'>
    }
  },
  setup(props) {
    const route = useRoute();

    const scrollViewRef = ref<any>();

    const strutree = new StructureTree<IMenu>({
      idKey: 'id',
      labelKey: 'path',
      childrenKey: 'children'
    });

    /* const menus = ref<IMenu[]>(
      strutree.filter(require('@/assets/json/menus.json'), (node: any) => {
        return !node?.auth || node?.auth;
      })
    ); */

    const menus = ref<IMenu[]>(sessionService?.user?.role?.menus ?? []);

    // const openKeys = ref(menus.value.flatMap((x) => [x.id, ...(x?.children?.map((x) => x.id) ?? [])]));
    const openKeys = ref([]);
    const selectedKeys = ref([]);

    provide('mode', props.mode);
    provide('openKeys', openKeys);
    provide('selectedKeys', selectedKeys);

    const getMenuByName = (names: string[]) => {
      let name;
      let node: ReturnType<typeof strutree.find>;
      do {
        name = names.pop();
        if (name) {
          node = strutree.find(menus.value, (x) => x.name === name);
          if (node) {
            break;
          }
        }
      } while (name);

      return node;
    };

    // 页面切换后，将菜单滚动至中心位置
    const scrollToCenter = (menu: any) => {
      if (!scrollViewRef.value) {
        return;
      }
      let $activatedMenuItem: HTMLElement;
      if (menu.parentNodes?.length) {
        $activatedMenuItem = document.querySelector(`[data-submenu-id='${menu.parentNodes[0].id}']`);
      } else {
        $activatedMenuItem = document.querySelector(`[data-menu-id='${menu.node.id}']`);
      }
      if ($activatedMenuItem) {
        let left = 0;
        if ($activatedMenuItem.offsetLeft > 10) {
          // 当前 menuItem 中心距视窗左侧的距离
          left = $activatedMenuItem.offsetLeft + $activatedMenuItem.offsetWidth / 2 - scrollViewRef.value.viewRef.offsetWidth / 2;
          // 距容器中心点的距离
          // const diff = left - scrollViewRef.value.viewRef.offsetWidth / 2;
          // const scrollLeft = scrollViewRef.value.viewRef.scrollLeft + diff;
        }
        scrollViewRef.value.scrollTo(left, 0, 300);
      }
    };

    // 跟随页面路由变化，切换菜单选中状态
    watch(
      () => route.fullPath,
      () => {
        const menu = getMenuByName(route.matched.map((x) => x?.name?.toString()));
        if (menu?.node) {
          selectedKeys.value = [menu.node.id];
          openKeys.value = Array.from(new Set([...menus.value.map((x) => x.id), ...menu.parentNodes.map((x) => x.id), ...openKeys.value]));
          scrollToCenter(menu);
        } else {
          openKeys.value = menus.value.map((x) => x.id);
        }
      },
      {
        immediate: true
      }
    );

    watch(
      () => props.mode,
      (val) => {
        if (val === 'horizontal') {
          document.body.classList.add('nav-menu-horizontal');
          document.body.classList.remove('nav-menu-vertical');
        } else {
          document.body.classList.add('nav-menu-vertical');
          document.body.classList.remove('nav-menu-horizontal');
        }
      },
      {
        immediate: true
      }
    );

    return {
      scrollViewRef,
      menus,
      openKeys,
      selectedKeys
    };
  },
  render(ctx) {
    return ctx.mode === 'horizontal' ? (
      <ScrollView scrollX fillX ref='scrollViewRef'>
        <Menu
          class='nav-menu'
          disabledOverflow={true}
          // triggerSubMenuAction='click'
          mode={ctx.mode}
          theme={ctx.theme}
          inlineIndent={0}
          v-models={[
            [ctx.openKeys, 'openKeys'],
            [ctx.selectedKeys, 'selectedKeys']
          ]}>
          {ctx.menus.map((item) => (
            <NavMenuItem data={item} inline-indent={16} />
          ))}
        </Menu>
      </ScrollView>
    ) : (
      <Menu
        class='nav-menu'
        disabledOverflow={true}
        // triggerSubMenuAction='click'
        mode={ctx.mode}
        theme={ctx.theme}
        v-models={[
          [ctx.openKeys, 'openKeys'],
          [ctx.selectedKeys, 'selectedKeys']
        ]}>
        {ctx.menus.map((item) => (
          <NavMenuItem data={item} inline-indent={16} />
        ))}
      </Menu>
    );
  }
});
