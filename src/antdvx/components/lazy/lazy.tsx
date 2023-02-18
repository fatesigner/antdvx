/**
 * lazy
 */

import { AsyncComponentOptions, defineAsyncComponent as defineAsyncComponent_, defineComponent, PropType } from 'vue';
import { isFunction } from '@fatesigner/utils/type-check';
import { AsyncComponentLoader, Component, ComponentPublicInstance } from '@vue/runtime-core';
import { Alert, Spin } from 'ant-design-vue';

interface ILazyComponentOptions {
  width?: number | string;
  height?: number | string;
}

const Error = function (options?: ILazyComponentOptions) {
  return defineComponent({
    name: 'LazyComponentError',
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
    name: 'LazyComponentLoading',
    render() {
      return (
        <div style={{ width: options?.width, height: options?.height }}>
          <div class='tw-inline-block tw-p-4'>
            <Spin class='tw-align-top' />
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
