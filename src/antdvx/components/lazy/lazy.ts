/**
 * lazy
 */

import { AsyncComponentOptions, defineAsyncComponent } from 'vue';

import ErrorComponent from './error.vue';
import LoadingComponent from './loading.vue';
import { AsyncComponentLoader } from '@vue/runtime-core';

export function defineLazyComponent<T>(loader: AsyncComponentLoader<T>, options?: AsyncComponentOptions) {
  return defineAsyncComponent({
    delay: 200,
    timeout: 30000,
    errorComponent: ErrorComponent,
    loadingComponent: LoadingComponent,
    ...options,
    loader: loader
  });
}
