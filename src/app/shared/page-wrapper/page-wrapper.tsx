import { defineComponent, nextTick, onMounted, PropType, ref, shallowReactive, unref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { bindPromiseQueue } from '@fatesigner/utils';
import { StructureTree } from '@fatesigner/utils/structure-tree';
import { isFunction, isString } from '@fatesigner/utils/type-check';
import { Breadcrumb, BreadcrumbItem, Empty, Spin } from 'ant-design-vue';
import { IconArrowLeftLine, ScrollView, TransitionZoom, XRouterLink } from 'antdvx';
import { IMenu } from 'antdvx/types';

import { AppFooter } from '@/app/layout/shared/footer';

import './page-wrapper.less';

/**
 * 视图容器
 */
export const PageWrapper = defineComponent({
  name: 'PageWrapper',
  props: {
    title: {
      type: String
    },
    breadcrumb: {
      type: Boolean
    },
    footer: {
      type: Boolean,
      default: false
    },
    bgGray: {
      type: Boolean,
      default: false
    },
    overflow: {
      type: String as PropType<'scroll' | 'hidden'>
    },
    returnable: {
      type: [Boolean, String],
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    empty: {
      type: Boolean,
      default: false
    },
    initialize: {
      type: Function as PropType<() => Promise<any>>
    }
  },
  setup(props, { emit }) {
    const route = useRoute();
    const router = useRouter();

    const data = ref();
    const error = ref();
    const initialized = ref(false);
    const loading_ = ref(false);

    const breadcrumbData = shallowReactive({
      loading: true,
      routes: [],
      current: undefined
    });

    if (props.loading) {
      loading_.value = true;
    }

    watch(
      () => props.loading,
      (val) => {
        if (loading_.value !== val) {
          loading_.value = val;
        }
      }
    );

    const load = bindPromiseQueue(() => {
      return props
        .initialize()
        .then((res: any) => {
          data.value = res;
          error.value = null;
          initialized.value = true;
        })
        .catch((err: Error) => {
          error.value = err.message;
        })
        .finally(() => {
          nextTick(() => {
            emit('initialized', data.value);
          });
        });
    }, true);

    // 根据当前路由获取面包屑集合
    const menus = require('@/assets/json/menus.json');
    const strutree = new StructureTree<IMenu>({
      idKey: 'id',
      labelKey: 'path',
      childrenKey: 'children'
    });

    const getMenuByName = (names: string[]) => {
      let name;
      let node: ReturnType<typeof strutree.find>;
      do {
        name = names.pop();
        if (name) {
          node = strutree.find(menus, (x) => x.name === name);
          if (node) {
            break;
          }
        }
      } while (name);

      return node;
    };

    const loadBreadcrumb = () => {
      const menu = getMenuByName(route.matched.map((x) => x?.name?.toString()));
      if (menu?.node) {
        breadcrumbData.current = menu.node;
        breadcrumbData.routes = unref(menu.parentNodes);
      }
      nextTick(() => {
        breadcrumbData.loading = false;
      });
    };

    // 回到上一页
    const returnToPrevious = () => {
      if (isString(props.returnable)) {
        router.push({ path: props.returnable as string });
      } else if (props.returnable) {
        router.back();
      }
    };

    const reload = async () => {
      loading_.value = true;
      await load();
      loading_.value = false;
    };

    onMounted(() => {
      if (isFunction(props.initialize)) {
        nextTick().then(() => {
          reload();
        });
      }
      if (props.breadcrumb) {
        setTimeout(() => {
          loadBreadcrumb();
        });
      }
    });

    return {
      loading_,
      initialized,
      breadcrumbData,
      returnToPrevious,
      reload
    };
  },
  render(ctx) {
    const container = [
      <TransitionZoom>
        {ctx.loading_ ? (
          <div class='page-wrapper-loading'>
            <Spin size='large' />
          </div>
        ) : undefined}
      </TransitionZoom>,
      <TransitionZoom>
        {!ctx.loading_ && ctx.empty ? (
          <Empty
            class='page-wrapper-empty'
            image={require('@/assets/img/nodata.png')}
            image-style={{ height: '120px' }}
            v-slots={{
              description() {
                return <span class='tw-text-sm tw-text-gray-500'>暂无数据</span>;
              }
            }}>
            {ctx.$slots.empty?.({ initialize: ctx.initialize })}
          </Empty>
        ) : undefined}
      </TransitionZoom>,
      !ctx.initialize || ctx.initialized ? ctx.$slots.default?.() : ctx.$slots.skeleton?.()
    ];

    const hasTop =
      ctx.returnable ||
      ctx.title ||
      ctx.$slots?.title ||
      ctx.breadcrumb ||
      ctx.$slots?.breadcrumb ||
      ctx.$slots?.actions;

    const wrapper = (
      <div
        class={[
          'page-wrapper',
          ctx.overflow === 'hidden' ? 'tw-h-full tw-overflow-hidden' : undefined,
          ctx.bgGray ? 'page-bg-gray' : undefined
        ]}>
        {hasTop || ctx.$slots?.header ? (
          <div class='page-header'>
            {ctx.$slots?.breadcrumb ? (
              <div class='page-breadcrumb'>{ctx.$slots?.breadcrumb()}</div>
            ) : ctx.breadcrumb ? (
              ctx.breadcrumbData.loading ? (
                <div class='page-breadcrumb'>
                  <Spin size='small' />
                </div>
              ) : (
                <div class='page-breadcrumb'>
                  {/* <Breadcrumb
                    routes={ctx.breadcrumbData.routes}
                    v-slots={{
                      itemRender({ route, routes, paths }) {
                        return route.url ? (
                          <XRouterLink to={route.url}>{route.label}</XRouterLink>
                        ) : (
                          <span>{route.label}</span>
                        );
                      }
                    }}
                  /> */}
                  <Breadcrumb>
                    <BreadcrumbItem>
                      <XRouterLink to='/'>Portal</XRouterLink>
                    </BreadcrumbItem>
                    {ctx.breadcrumbData.routes.flatMap((x, i) =>
                      i === ctx.breadcrumbData.routes.length - 1
                        ? [
                            <BreadcrumbItem>
                              {x.url ? <XRouterLink to={x.url}>{x.label}</XRouterLink> : <span>{x.label}</span>}
                            </BreadcrumbItem>,
                            <BreadcrumbItem>
                              <span>{ctx.breadcrumbData.current?.label}</span>
                            </BreadcrumbItem>
                          ]
                        : [
                            <BreadcrumbItem>
                              {x.url ? <XRouterLink to={x.url}>{x.label}</XRouterLink> : <span>{x.label}</span>}
                            </BreadcrumbItem>
                          ]
                    )}
                  </Breadcrumb>
                </div>
              )
            ) : undefined}
            {hasTop ? (
              <div class='page-header-top'>
                {ctx.title || ctx.$slots?.title ? (
                  <div class='page-header-title'>
                    {[
                      ctx.returnable ? (
                        <span class='page-wrapper-back' title='Return to previous page' onClick={ctx.returnToPrevious}>
                          <IconArrowLeftLine />
                        </span>
                      ) : undefined,
                      ctx.$slots.icon?.(),
                      ctx.title ? <span>{ctx.title}</span> : undefined,
                      ctx.$slots.title?.()
                    ]}
                  </div>
                ) : undefined}
                <div class='page-header-actions'>{ctx.$slots.actions?.()}</div>
              </div>
            ) : undefined}
            {ctx.$slots.header?.()}
          </div>
        ) : undefined}
        <div class={['page-container', ctx.overflow === 'hidden' ? 'tw-overflow-hidden' : undefined]}>{container}</div>
        {ctx.footer ? <AppFooter /> : undefined}
      </div>
    );

    return ctx.overflow === 'scroll' ? (
      <ScrollView native fillY scrollY>
        {wrapper}
      </ScrollView>
    ) : (
      wrapper
    );
  }
});
