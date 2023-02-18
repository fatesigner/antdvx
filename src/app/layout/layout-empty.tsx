import { RouterView } from 'vue-router';
import { TransitionSlide } from 'antdvx';
import { KeepAlive, defineComponent } from 'vue';
import { getMatchedRoute } from 'antdvx/helpers';

import { NavLanguage } from '@/app/layout/shared/language';

/**
 * 空母版页
 */
export default defineComponent({
  render() {
    return (
      <div class='tw-h-full'>
        <div class='tw-fixed tw-top-4 tw-right-4'>
          <NavLanguage />
        </div>
        <RouterView
          v-slots={{
            default({ Component, route }) {
              const { key, matchedRoute } = getMatchedRoute(Component, route);
              return Component ? (
                <TransitionSlide>
                  {matchedRoute?.meta?.keepAlive ? (
                    <KeepAlive>
                      <Component key={key} />
                    </KeepAlive>
                  ) : (
                    <Component />
                  )}
                </TransitionSlide>
              ) : undefined;
            }
          }}
        />
      </div>
    );
  }
});
