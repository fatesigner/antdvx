import { RouterView } from 'vue-router';
import { TransitionSlide } from '@/antdvx';
import { KeepAlive, defineComponent } from 'vue';

/**
 * 空母版页
 */
export const LayoutEmpty = defineComponent({
  name: 'LayoutEmpty',
  render() {
    return (
      <RouterView
        v-slots={{
          default({ Component, route }) {
            const matchedRoute = Component?.type?.name ? route?.matched?.find((x) => x?.components?.default?.name === Component.type.name) ?? route : route;
            return Component ? (
              <TransitionSlide>
                {matchedRoute?.meta?.keepAlive ? (
                  <KeepAlive>
                    <Component key={matchedRoute.fullPath} />
                  </KeepAlive>
                ) : (
                  <Component key={matchedRoute.fullPath} />
                )}
              </TransitionSlide>
            ) : undefined;
          }
        }}
      />
    );
  }
});
