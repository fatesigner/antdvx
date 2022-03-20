/**
 * x-combobox
 */

import { debounce } from '@fatesigner/utils';
import { AutoComplete, Select, SelectOption, Spin } from 'ant-design-vue';
import { PropType, computed, defineComponent, nextTick, onMounted, reactive, ref, watch } from 'vue';
import { isArray, isFunction, isNullOrUndefined, isObject, isString } from '@fatesigner/utils/type-check';

/**
 * 过滤列表项
 */
export type IXComboboxFilter<TModel extends Record<string, any>> = (searchInput: string, option: TModel) => boolean;

/**
 * 异步获取列表项数据
 */
export type IXComboboxOptionsPromise<TModel extends Record<string, any>> = (searchInput: string) => Promise<TModel[]>;

type DataFieldMap<TModel extends Record<string, any>> = (option: TModel) => string;

export interface IXComboboxProps<TModel extends Record<string, any>> {
  /**
   * 指定是否在初始化时绑定数据源，默认为 false
   */
  autoBind?: boolean;

  /**
   * 是否可搜索
   */
  searchable?: boolean;

  /**
   * 是否将选项 item 的值包装到 value 中，会把 Select 的 value 类型从 string 变为 { key: string, label: vNodes, ... } 形式
   */
  labelInValue?: boolean;

  /**
   * 是否可清除
   */
  clearable?: boolean;

  /**
   * 是否可手动输入值，在没有匹配的列表项时，可选择当前输入的内容
   */
  importable?: boolean;

  /**
   * 指定是否服务端过滤，如果为 true，数据源将把筛选实现留给远程服务。默认情况下，数据源将执行客户端过滤。
   */
  serverFilter?: boolean;

  /**
   * 提供数据项主键字段
   */
  dataKeyField?: string | DataFieldMap<TModel>;

  /**
   * 提供数据项值的字段，将根据此字段设置为 value 值，默认为 value
   */
  dataValueField?: string | DataFieldMap<TModel>;

  /**
   * 提供列表项文本内容的数据项字段，将根据此字段过滤数据源，默认为 text
   */
  dataTextField?: string | DataFieldMap<TModel>;

  /**
   * 选中的值
   */
  value?: string | number;

  /**
   * 回填到选择框的 Option 的属性值，默认是 Option 的子元素。比如在子元素需要高亮效果时，此值可以设为 value
   */
  optionLabelProp?: string | number;

  /**
   * 指定用户输入的搜索文本后，触发筛选前的延迟时间（毫秒），默认为 300
   */
  delay?: number;

  /**
   * 过滤列表项
   */
  filter?: IXComboboxFilter<TModel>;

  /**
   * 列表项数据
   */
  options: TModel[];

  /**
   * 列表项数据源 Promise
   */
  optionsLoader?: IXComboboxOptionsPromise<TModel>;
}

/**
 * 获取指定字段的 map 函数
 * @param field
 */
function getDataFieldMap<TModel extends Record<string, any>>(field: string | DataFieldMap<TModel>) {
  let valueFunc;
  if (isFunction(field)) {
    valueFunc = field;
  } else if (isString(field)) {
    valueFunc = (option) => {
      return option[field as string];
    };
  } else {
    valueFunc = (option) => {
      return option;
    };
  }
  return valueFunc;
}

/**
 * 获取 combobox 默认配置
 */
export function getDefaultComboboxProps<TModel extends Record<string, any>>(): IXComboboxProps<TModel> {
  return {
    autoBind: false,
    clearable: false,
    serverFilter: false,
    dataValueField: 'value',
    dataTextField: 'text',
    delay: 300,
    options: []
  };
}

/**
 * 自定义组合框控件
 */
export const XCombobox = defineComponent({
  name: 'x-combobox',
  props: {
    autoBind: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String
    },
    searchable: {
      type: Boolean,
      default: false
    },
    labelInValue: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    importable: {
      type: Boolean,
      default: false
    },
    serverFilter: {
      type: Boolean,
      default: false
    },
    dataKeyField: {
      type: [String, Function] as PropType<string | DataFieldMap<any>>
    },
    dataValueField: {
      type: [String, Function] as PropType<string | DataFieldMap<any>>
    },
    dataTextField: {
      type: [String, Function] as PropType<string | DataFieldMap<any>>
    },
    multiple: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number, Object, Array]
    },
    optionLabelProp: {
      type: String
    },
    delay: {
      type: Number,
      default: 300
    },
    filter: {
      type: Function as PropType<IXComboboxFilter<any>>,
      default: null
    },
    options: {
      type: Array as PropType<any[]>,
      default() {
        return [];
      }
    },
    optionsLoader: {
      type: Function as PropType<IXComboboxOptionsPromise<any>>
    }
  },
  emits: ['change', 'search', 'select', 'update:value'],
  setup(props: any, { emit }) {
    const loading = ref(false);

    // 定义变量保存当前输入框的值
    let searchInput;

    const dataValueMap = computed<DataFieldMap<any>>(() => {
      return getDataFieldMap(props.dataValueField);
    });

    const dataTextMap = computed<DataFieldMap<any>>(() => {
      return getDataFieldMap(props.dataTextField);
    });

    const dataKeyMap = computed<DataFieldMap<any>>(() => {
      if (props.dataKeyField) {
        return getDataFieldMap(props.dataKeyField);
      }
      return dataValueMap.value;
    });

    const value_ = ref();

    const valueBind = ref();

    // 定义集合用于界面显示
    const displayOptions = reactive([]);

    // 表现模式
    const mode = computed(() => {
      if (props.multiple) {
        return 'multiple';
      }
      return undefined;
    });

    // 过滤数据
    const filterData = async () => {
      if (searchInput) {
        if (props.filter) {
          displayOptions.splice(0, displayOptions.length, ...props.options.filter((x) => props.filter(searchInput, x)));
        } else {
          displayOptions.splice(0, displayOptions.length, ...props.options.filter((x) => x[props.dataTextField]?.indexOf(searchInput) > -1));
        }
      } else {
        displayOptions.splice(0, displayOptions.length, ...props.options);
      }
    };

    // 加载数据
    const loadData = async () => {
      if (isFunction(props.optionsLoader)) {
        return props.optionsLoader(searchInput).then((res) => {
          props.options.splice(0, props.options.length, ...res);
          // 执行一次客户端过滤
          if (!props.serverFilter) {
            filterData();
          }
        });
      } else {
        filterData();
      }
    };

    const onChange = (e) => {
      nextTick(() => {
        emit('change', e);
      });
    };

    // 搜索框输入
    const onSearch = debounce(
      async (_searchInput?: string) => {
        loading.value = true;

        searchInput = _searchInput?.trim() ?? '';

        if (props.serverFilter) {
          await loadData();
        } else {
          await filterData();
        }

        loading.value = false;
      },
      props.delay,
      true,
      () => {
        loading.value = true;
      }
    );

    const onDropdownVisibleChange = async (visible: boolean) => {
      if (visible) {
        // 当数据为空时，每次展开后刷新数据
        if (isFunction(props.optionsLoader)) {
          if ((!displayOptions.length || displayOptions.length !== props.options.length) && !loading.value) {
            await loadData();
            await filterData();
          }
        } else {
          if ((!displayOptions.length || displayOptions.length !== props.options.length) && !loading.value) {
            await loadData();
            await filterData();
          }
        }
      }
    };

    const onSelect = (value, option) => {
      emit('select', {
        value,
        option,
        options: props.options
      });
    };

    watch(
      () => props.value,
      (val) => {
        if (val !== value_.value) {
          if (isNullOrUndefined(val)) {
            value_.value = valueBind.value = val;
          } else {
            if (props.importable) {
              value_.value = valueBind.value = val;
            } else {
              if (props.labelInValue) {
                if (isNullOrUndefined(props.dataValueField)) {
                  throw new Error('If use labelInValue, please set the dataValueField property');
                } else {
                  if (isArray(val)) {
                    valueBind.value = val.map((x) => x[props.dataValueField]);
                  } else {
                    valueBind.value = val[props.dataValueField];
                  }
                }
              } else {
                if (isObject(val)) {
                  console.error("Warning: 'value' should in shape of '{ value: string | number, label?: any }' when you set 'labelInValue' to 'true'");
                } else {
                  value_.value = valueBind.value = val;
                }
              }
            }
          }
        }
      },
      {
        immediate: true
      }
    );

    watch(
      () => props.options,
      () => {
        filterData();
      },
      {
        deep: true
      }
    );

    watch(
      () => props.optionsLoader,
      () => {
        loadData();
      }
    );

    watch(value_, (val) => {
      emit('update:value', val);
    });

    watch(valueBind, (val: string | any[]) => {
      if (props.importable || !props.labelInValue) {
        value_.value = val;
      } else {
        if (props.labelInValue) {
          if (isNullOrUndefined(props.dataValueField)) {
            throw new Error('If use labelInValue, please set the dataValueField property');
          } else {
            if (isArray(val)) {
              value_.value = (val as any[])
                .map((x) => {
                  const cur = displayOptions.find((y) => y[props.dataValueField] === x);
                  if (cur) {
                    return cur;
                  } else {
                    return undefined;
                  }
                })
                .filter((x) => !!x);
            } else {
              const cur = displayOptions.find((x) => x[props.dataValueField] === val);
              if (cur) {
                value_.value = cur;
              } else {
                value_.value = undefined;
              }
            }
          }
        } else {
        }
      }
    });

    onMounted(() => {
      if (props.autoBind) {
        // 初始化时，自动加载数据
        loadData();
      } else {
        filterData();
      }
    });

    return {
      loading,
      searchInput,
      mode,
      value_,
      valueBind,
      displayOptions,
      dataKeyMap,
      dataValueMap,
      dataTextMap,
      onSearch,
      onSelect,
      onChange,
      onDropdownVisibleChange
    };
  },
  render(ctx) {
    const renderOptions = [];
    if (!ctx.$slots.options) {
      if (ctx.$slots.option) {
        ctx.displayOptions.forEach((option) => {
          const key = ctx.dataKeyMap(option);
          const value = ctx.dataValueMap(option);
          renderOptions.push(
            <SelectOption key={key} value={value}>
              {ctx.$slots.option(option)}
            </SelectOption>
          );
        });
      } else {
        ctx.displayOptions.forEach((option) => {
          const key = ctx.dataKeyMap(option);
          const value = ctx.dataValueMap(option);
          const text = ctx.dataTextMap(option);
          renderOptions.push(
            <SelectOption key={key} value={value}>
              {text}
            </SelectOption>
          );
        });
      }
    }
    return ctx.importable ? (
      <AutoComplete
        backfill={true}
        allowClear={ctx.$slots?.default ? undefined : ctx.clearable}
        placeholder={ctx.$slots?.default ? undefined : ctx.placeholder}
        v-model={[ctx.valueBind, 'value']}
        optionLabelProp={ctx.optionLabelProp}
        onChange={ctx.onChange}
        onSearch={ctx.searchable ? ctx.onSearch : undefined}
        onSelect={ctx.onSelect}
        v-slots={{
          options() {
            return ctx.$slots?.options?.({ options: ctx.displayOptions }) ?? renderOptions;
          }
        }}
      >
        {ctx.$slots?.default?.()}
      </AutoComplete>
    ) : (
      <Select
        showSearch={ctx.searchable}
        mode={ctx.mode}
        allowClear={ctx.clearable}
        placeholder={ctx.placeholder}
        filterOption={false}
        optionLabelProp={ctx.optionLabelProp}
        v-model={[ctx.valueBind, 'value']}
        onChange={ctx.onChange}
        onSearch={ctx.searchable ? ctx.onSearch : undefined}
        onSelect={ctx.onSelect}
        onDropdownVisibleChange={ctx.onDropdownVisibleChange}
        v-slots={{
          notFoundContent: () =>
            ctx.loading ? (
              <div class='tw-p-2 tw-text-center'>
                <Spin size='small' />
              </div>
            ) : (
              ''
            )
        }}
      >
        {ctx.$slots?.options?.({ options: ctx.displayOptions }) ?? renderOptions}
      </Select>
    );
  }
});
