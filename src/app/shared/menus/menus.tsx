import { Menu } from 'ant-design-vue';
import { useRoute, useRouter } from 'vue-router';
import { Iconfont, ScrollView, XRouterLink } from '@/antdvx';
import { StructureTree } from '@fatesigner/utils/structure-tree';
import { PropType, computed, defineComponent, inject, onMounted, provide, reactive, ref, watch } from 'vue';
import { IMenu } from '@/antdvx/types';

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
          onTitleClick={(e) => {
            // debugger;
          }}
          onMouseenter={(e) => {
            e.stopPropagation();
          }}
          v-slots={{
            title() {
              /* if (ctx.data.url) {
                return (
                  <XRouterLink
                    to={{ path: ctx.data.url }}
                    v-slots={{
                      default() {
                        return ctx.data.icon ? [<Iconfont name={ctx.data.icon} />, <span>{ctx.data.label}</span>] : '';
                      }
                    }}
                  />
                );
              } else if (ctx.data.name) {
                return (
                  <XRouterLink
                    to={{ name: ctx.data.name }}
                    v-slots={{
                      default() {
                        return ctx.data.icon ? [<Iconfont name={ctx.data.icon} />, <span>{ctx.data.label}</span>] : '';
                      }
                    }}
                  />
                );
              } */
              return (
                <div
                  class='tw-flex tw-items-center'
                  onClick={(e) => {
                    if (!ctx.selectedKeys?.includes(ctx.data.id)) {
                      // e.stopPropagation();
                    }
                    if (ctx.data.url) {
                      ctx.$router.push({ path: ctx.data.url });
                    } else if (ctx.data.name) {
                      ctx.$router.push({ name: ctx.data.name });
                    }
                  }}>
                  {ctx.data.icon ? <Iconfont name={ctx.data.icon} /> : undefined}
                  <span>{ctx.data.label}</span>
                </div>
              );
            }
          }}>
          {ctx.data.children.map((item) => {
            if (item.children) {
              return <NavMenuItem key={item.id} data={item} />;
            } else {
              return (
                <Menu.Item
                  key={item.name || item.id}
                  v-slots={{
                    default() {
                      if (item.url) {
                        return (
                          <XRouterLink
                            to={{ path: item.url }}
                            v-slots={{
                              default() {
                                return item.icon ? [<Iconfont name={item.icon} />, <span>{item.label}</span>] : '';
                              }
                            }}
                          />
                        );
                      } else if (item.name) {
                        return (
                          <XRouterLink
                            to={{ name: item.name }}
                            v-slots={{
                              default() {
                                return item.icon ? [<Iconfont name={item.icon} />, <span>{item.label}</span>] : '';
                              }
                            }}
                          />
                        );
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
            default() {
              if (ctx.data.url) {
                return (
                  <XRouterLink
                    to={{ path: ctx.data.url }}
                    v-slots={{
                      default() {
                        return ctx.data.icon ? [<Iconfont name={ctx.data.icon} />, <span>{ctx.data.label}</span>] : '';
                      }
                    }}
                  />
                );
              } else if (ctx.data.name) {
                return (
                  <XRouterLink
                    to={{ name: ctx.data.name }}
                    v-slots={{
                      default() {
                        return ctx.data.icon ? [<Iconfont name={ctx.data.icon} />, <span>{ctx.data.label}</span>] : '';
                      }
                    }}
                  />
                );
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
  setup() {
    const route = useRoute();

    const scrollViewRef = ref<any>();

    const strutree = new StructureTree<IMenu>({
      idKey: 'id',
      labelKey: 'path',
      childrenKey: 'children'
    });

    const menus = ref<IMenu[]>(
      strutree.filter(require('@/assets/auth/menus.json'), (node: any) => {
        return !node?.auth || node?.auth;
      })
    );

    const openKeys = reactive([]);
    const selectedKeys = ref([]);

    provide('openKeys', openKeys);
    provide('selectedKeys', selectedKeys);

    const getMenuByName = (name: string) => {
      return strutree.find(menus.value, (x) => x.name === name);
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
          const diff = left - scrollViewRef.value.viewRef.offsetWidth / 2;
          const scrollLeft = scrollViewRef.value.viewRef.scrollLeft + diff;
        }
        scrollViewRef.value.scrollTo(left, 0, 300);
      }
    };

    // 跟随页面路由变化，切换菜单选中状态
    watch(
      () => route.fullPath,
      () => {
        const menu = getMenuByName(route.name as string);
        if (menu?.node) {
          selectedKeys.value = [menu.node.id];
          scrollToCenter(menu);
        }
      },
      {
        immediate: true
      }
    );

    onMounted(() => {});

    return {
      scrollViewRef,
      menus,
      openKeys,
      selectedKeys
    };
  },
  render(ctx) {
    return (
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
    );
  }
});
