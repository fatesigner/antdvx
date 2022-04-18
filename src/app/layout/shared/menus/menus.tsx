import { Menu } from 'ant-design-vue';
import { useRoute, useRouter } from 'vue-router';
import { Iconfont, ScrollView, XRouterLink } from '@/antdvx';
import { IMenu } from '@/antdvx/types';
import { StructureTree } from '@fatesigner/utils/structure-tree';
import { PropType, computed, defineComponent, inject, nextTick, provide, reactive, ref, watch } from 'vue';

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

    const collapsed = inject('collapsed');
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
      collapsed,
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
            title() {
              if (ctx.data.url || ctx.data.route) {
                return (
                  <XRouterLink
                    to={ctx.data.url ? { path: ctx.data.url } : { name: ctx.data.route }}
                    v-slots={{
                      default() {
                        return [ctx.data.icon ? <Iconfont name={ctx.data.icon} /> : undefined, <span>{ctx.data.label}</span>];
                      }
                    }}
                  />
                );
              } else {
                return (
                  <div class='tw-flex tw-items-center'>
                    {ctx.data.icon ? <Iconfont name={ctx.data.icon} /> : undefined}
                    <span>{ctx.data.label}</span>
                  </div>
                );
              }
            }
          }}
        >
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
                                return [item.icon ? <Iconfont name={item.icon} /> : undefined, <span>{item.label}</span>];
                              }
                            }}
                          />
                        );
                      } else {
                        return [item.icon ? <Iconfont name={item.icon} /> : undefined, <span>{item.label}</span>];
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
              if (ctx.data.url || ctx.data.route) {
                return (
                  <XRouterLink
                    to={ctx.data.url ? { path: ctx.data.url } : { name: ctx.data.route }}
                    v-slots={{
                      default() {
                        return [ctx.data.icon ? <Iconfont name={ctx.data.icon} /> : undefined, <span>{ctx.data.label}</span>];
                      }
                    }}
                  />
                );
              } else {
                return [ctx.data.icon ? <Iconfont name={ctx.data.icon} /> : undefined, <span>{ctx.data.label}</span>];
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
      strutree.filter(require('@/assets/auth/menus.json'), (node: any) => {
        return !node?.auth || node?.auth;
      })
    ); */
    const menus = ref<IMenu[]>(sessionService?.user?.role?.menus ?? []);

    const collapsed = inject('collapsed');

    let preOpenKeys = menus.value?.flatMap((x) => [x.id, ...(x?.children?.map((x) => x.id) ?? [])]) ?? [];
    const openKeys = ref([]);
    const selectedKeys = ref([]);

    provide('openKeys', openKeys);
    provide('selectedKeys', selectedKeys);

    const getMenuByName = (name: string) => {
      return strutree.find(menus.value, (x) => x.route === name);
    };

    // 监听菜单收缩状态
    watch(
      () => collapsed,
      (newVal: any) => {
        if (newVal.value) {
          preOpenKeys = openKeys.value.map((x) => x);
          nextTick(() => {
            openKeys.value = [];
            // openKeys.value.splice(0, openKeys.value.length);
          });
        } else {
          nextTick(() => {
            openKeys.value = preOpenKeys;
            // openKeys.value.splice(0, openKeys.value.length, ...preOpenKeys);
          });
        }
      },
      {
        immediate: true
      }
    );

    // 跟随页面路由变化，切换菜单选中状态
    watch(
      () => route.fullPath,
      () => {
        const menu = getMenuByName(route.name as string);
        if (menu?.node) {
          selectedKeys.value = [menu.node.id];
          menu.parentNodes
            .map((x) => x.id)
            .forEach((x) => {
              if (collapsed) {
                if (!preOpenKeys.includes(x)) {
                  preOpenKeys.push(x);
                }
              } else {
                if (!openKeys.value.includes(x)) {
                  openKeys.value.push(x);
                }
              }
            });
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
    return (
      <ScrollView fillY scrollY>
        <Menu
          class='sidebar-menu'
          disabledOverflow={true}
          // triggerSubMenuAction='click'
          mode={ctx.mode}
          theme={ctx.theme}
          inlineIndent={16}
          v-models={[
            [ctx.openKeys, 'openKeys'],
            [ctx.selectedKeys, 'selectedKeys']
          ]}
        >
          {ctx.menus.map((item) => (
            <NavMenuItem data={item} inline-indent={16} />
          ))}
        </Menu>
      </ScrollView>
    );
  }
});
