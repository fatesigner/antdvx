import { RouterLink, useRouter } from 'vue-router';
import { PropType, computed, defineComponent } from 'vue';

/**
 * 自定义 RouterLink
 */
export const XRouterLink = defineComponent({
  name: 'XRouterLink',
  props: {
    ...(RouterLink as any).props,
    activeClass: String,
    target: {
      type: String as PropType<'_self' | '_blank' | '_parent' | '_top'>
    }
  },
  inheritAttrs: false,
  setup(props) {
    const router = useRouter();

    const activeClass_ = computed(() => {
      return props.activeClass ?? router.options.linkActiveClass;
    });

    const isExternalLink = computed(() => {
      return typeof props.to === 'string' && props.to.startsWith('http');
    });

    return { activeClass_, isExternalLink };
  },
  render(ctx) {
    return [
      ctx.isExternalLink ? (
        <a {...ctx.$attrs} href={ctx.to} target={ctx.target}>
          {ctx.$slots?.default()}
        </a>
      ) : (
        <RouterLink
          {...ctx.$props}
          custom
          v-slots={{
            default({ isActive, href, navigate }) {
              return (
                <a {...ctx.$attrs} href={href} onClick={navigate} class={isActive ? ctx.activeClass_ : undefined} target={ctx.target}>
                  {ctx.$slots?.default({ isActive, href, navigate })}
                </a>
              );
            }
          }}
        />
      )
    ];
  }
});
