import { ANTDVX_SIZES } from '../../constants';

export type IAsAsyncSectionHandler<TData> = {
  refresh: () => Promise<TData>;
};

export type IAsAsyncSectionProps<TData, TContext> = {
  refreshable?: boolean;
  immediate?: boolean;
  size?: typeof ANTDVX_SIZES[number];
  error?: Error;
  data?: {
    [key in keyof TData]?: TData[key];
  };
  initialized?: boolean;
  initialize: (this: TContext) => Promise<TData>;
};

export type IAsAsyncSectionListeners<TData, TContext> = {
  completed?: (this: TContext, data: TData) => void;
  dataChanged?: (this: TContext, data: TData) => void;
  errorChanged?: (this: TContext, error: Error) => void;
};
