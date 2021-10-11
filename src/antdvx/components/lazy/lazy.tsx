/**
 * lazy
 */

import { Alert } from 'ant-design-vue';
import { isFunction } from '@fatesigner/utils/type-check';
import { AsyncComponentLoader, Component, ComponentPublicInstance } from '@vue/runtime-core';
import { AsyncComponentOptions, PropType, defineAsyncComponent as defineAsyncComponent_, defineComponent } from 'vue';

import { SpinnerLoading } from '../loading';

interface ILazyComponentOptions {
  width?: number | string;
  height?: number | string;
}

const Error = function (options?: ILazyComponentOptions) {
  return defineComponent({
    name: 'lazy-component-error',
    props: {
      error: Object as PropType<Error>,
      reload: Function
    },
    render(ctx) {
      return (
        <div style={{ width: options?.width, height: options?.height }}>
          <div class='tw-inline-block tw-p-4'>
            <Alert
              type='error'
              show-icon
              v-slots={{
                message: () => ctx.error.message
              }}
            />
          </div>
        </div>
      );
    }
  });
};

const Loading = function (options?: ILazyComponentOptions) {
  return defineComponent({
    name: 'lazy-component-loading',
    render() {
      return (
        <div style={{ width: options?.width, height: options?.height }}>
          <div class='tw-inline-block tw-p-4'>
            <SpinnerLoading class='tw-align-top' size='small' />
          </div>
        </div>
      );
    }
  });
};

/**
 * 定义异步组件
 * @param source
 * @param options
 */
export function defineAsyncComponent<
  T extends Component = {
    new (): ComponentPublicInstance;
  }
>(source: AsyncComponentLoader<T> | AsyncComponentOptions<T>, options?: ILazyComponentOptions): T {
  const opts = {
    delay: 100,
    timeout: 30000,
    errorComponent: Error(options),
    loadingComponent: Loading(options),
    onError(error, retry, fail, attempts) {
      if (attempts <= 1) {
        retry();
      } else {
        fail();
      }
    }
  };

  if (isFunction(source)) {
    return defineAsyncComponent_(
      Object.assign(opts, {
        loader: source as AsyncComponentLoader<T>
      })
    );
  }

  return defineAsyncComponent_(Object.assign(opts, source));
}
