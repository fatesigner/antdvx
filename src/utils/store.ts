/**
 * store
 */

import { reactive, readonly } from 'vue';
import { DeepReadonly, UnwrapNestedRefs } from '@vue/reactivity';

/**
 * 创建 store
 * @param state
 * @param actionsCreater
 */
export function createStore<State extends Record<string, any>, Actions extends (state: UnwrapNestedRefs<State>) => Record<string, (...args) => any>>(
  state: State,
  actionsCreater: Actions
) {
  const stateReactive = reactive(state);

  const stateReadonly = readonly(stateReactive);

  const actions = actionsCreater(stateReactive);

  return { state: stateReadonly, ...actions } as {
    state: DeepReadonly<UnwrapNestedRefs<UnwrapNestedRefs<State>>>;
  } & ReturnType<Actions>;
}
