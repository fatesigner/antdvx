import { debounce } from '@fatesigner/utils';
import { AutoComplete, Empty, Select, SelectOption, Spin } from 'ant-design-vue';
import { isArray, isFunction, isNullOrUndefined, isString } from '@fatesigner/utils/type-check';
import { PropType, computed, defineComponent, nextTick, onMounted, reactive, ref, watch } from 'vue';

import { ANTDVX_SIZES } from '../../constants';

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
   * 控件尺寸
   */
  size?: typeof ANTDVX_SIZES[number];

  /**
   * 指定是否在初始化时绑定数据源，默认为 false
   */
  autoBind?: boolean;

  /**
   * 禁用
   */
  disabled?: boolean;

  /**
   * 在每次打开后重新加载数据
   */
  reloadOnOpen?: boolean;

  /**
   * 是否可搜索
   */
  searchable?: boolean;

  /**
   * 是否将选项 item 的值包装到 value 中，会把 Select 的 value 类型从 string 变为 { key: string, label: vNodes, ... } 形式
   */
  // labelInValue?: boolean;

  /**
   * 是否可清除
   */
  clearable?: boolean;

  /**
   * 是否可手动输入值，在没有匹配的列表项时，可选择当前输入的内容
   */
  importable?: boolean;

  dropdownMatchSelectWidth?: boolean;

  dropdownStyle?: any;

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
   * 提供回填到选择框的列表项中数据项字段，默认为 children（combobox 模式下为 value） 即 Option 的子元素。比如在子元素需要高亮效果时，此值可以设为 value
   */
  dataLabelField?: string | DataFieldMap<TModel>;

  /**
   * 提供列表项文本内容的数据项字段，将根据此字段过滤数据源，默认为 text
   */
  dataFilterField?: string | DataFieldMap<TModel>;

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
  name: 'XCombobox',
  props: {
    size: {
      type: String as PropType<typeof ANTDVX_SIZES[number]>,
      default: 'default'
    },
    autoBind: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    reloadOnOpen: {
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
    maxTagCount: {
      type: Number
    },
    maxTagTextLength: {
      type: Number
    },
    maxTagPlaceholder: {
      type: [Object, Function]
    },
    dropdownMatchSelectWidth: {
      type: Boolean,
      default: true
    },
    dropdownStyle: Object,
    dataKeyField: {
      type: [String, Function] as PropType<string | DataFieldMap<any>>
    },
    dataValueField: {
      type: [String, Function] as PropType<string | DataFieldMap<any>>
    },
    dataTextField: {
      type: [String, Function] as PropType<string | DataFieldMap<any>>
    },
    dataLabelField: {
      type: [String, Function] as PropType<string | DataFieldMap<any>>
    },
    dataFilterField: {
      type: String
    },
    multiple: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number, Object, Array]
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

    const dataLabelMap = computed<DataFieldMap<any>>(() => {
      if (props.dataLabelField) {
        return getDataFieldMap(props.dataLabelField);
      }
      return dataTextMap.value;
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
          const _searchInput = searchInput.toLowerCase();
          if (!isNullOrUndefined(props.dataFilterField)) {
            displayOptions.splice(
              0,
              displayOptions.length,
              ...props.options.filter((x) => x?.[props.dataFilterField]?.toString()?.toLowerCase()?.indexOf(_searchInput) > -1)
            );
          } else if (!isNullOrUndefined(props.dataTextField)) {
            displayOptions.splice(
              0,
              displayOptions.length,
              ...props.options.filter((x) => x?.[props.dataTextField]?.toString()?.toLowerCase()?.indexOf(_searchInput) > -1)
            );
          } else {
            displayOptions.splice(0, displayOptions.length, ...props.options.filter((x) => x?.toString()?.toLowerCase()?.indexOf(_searchInput) > -1));
          }
        }
      } else {
        displayOptions.splice(0, displayOptions.length, ...props.options);
      }
    };

    // 加载数据
    const loadData = async () => {
      if (isFunction(props.optionsLoader)) {
        loading.value = true;
        return props
          .optionsLoader(searchInput)
          .then((res) => {
            props.options.splice(0, props.options.length, ...res);
            if (props.serverFilter) {
              displayOptions.splice(0, displayOptions.length, ...props.options);
            } else {
              // 执行一次客户端过滤
              filterData();
            }
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        filterData();
      }
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
          if ((props.reloadOnOpen || ((!displayOptions.length || displayOptions.length !== props.options.length) && !loading.value)) && !loading.value) {
            await loadData();
          }
        } else {
          if ((!displayOptions.length || displayOptions.length !== props.options.length) && !loading.value) {
            await loadData();
          }
        }
      }
    };

    const onChange = (e, option) => {
      nextTick(() => {
        emit('change', ...[e, props.options]);
      });
    };

    const onSelect = (value, option) => {
      nextTick(() => {
        emit('select', ...[value, option, props.options]);
        if (props.searchable && !props.importable) {
          searchInput = '';
        }
      });
    };

    // 设置指定值，触发 onChange 事件
    const setValue = (value) => {
      value_.value = valueBind.value = value;
      emit('change', ...[value_.value, props.options]);
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
              if (isArray(val)) {
                value_.value = valueBind.value = val.map((x) => x);
              } else {
                value_.value = valueBind.value = val;
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

    /* watch(
      () => props.optionsLoader,
      () => {
        loadData();
      }
    ); */

    watch(value_, (val) => {
      nextTick(() => {
        emit('update:value', val);
      });
    });

    watch(valueBind, (val: string | any[]) => {
      value_.value = val;
    });

    onMounted(() => {
      if (props.autoBind && !props.disabled) {
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
      dataLabelMap,
      onSearch,
      onSelect,
      onChange,
      onDropdownVisibleChange,
      setValue
    };
  },
  render(ctx) {
    const renderOptions = [];
    if (!ctx.$slots.options) {
      if (ctx.$slots.option) {
        ctx.displayOptions.forEach((option) => {
          const key = ctx.dataKeyMap(option);
          const value = ctx.dataValueMap(option);
          const label = ctx.dataLabelMap(option);
          renderOptions.push(
            <SelectOption key={key} value={value} title={label}>
              {ctx.$slots.option(option)}
            </SelectOption>
          );
        });
      } else {
        ctx.displayOptions.forEach((option) => {
          const key = ctx.dataKeyMap(option);
          const value = ctx.dataValueMap(option);
          const text = ctx.dataTextMap(option);
          const label = ctx.dataLabelMap(option);
          renderOptions.push(
            <SelectOption key={key} value={value} title={label}>
              {text}
            </SelectOption>
          );
        });
      }
    }
    return ctx.importable ? (
      <AutoComplete
        size={ctx.size}
        backfill={true}
        disabled={ctx.disabled}
        maxTagCount={ctx.maxTagCount}
        maxTagTextLength={ctx.maxTagTextLength}
        maxTagPlaceholder={ctx.maxTagPlaceholder}
        allowClear={ctx.$slots?.default ? undefined : ctx.clearable}
        placeholder={ctx.$slots?.default ? undefined : ctx.placeholder}
        dropdownStyle={ctx.dropdownStyle}
        dropdownMatchSelectWidth={ctx.dropdownMatchSelectWidth}
        optionLabelProp='title'
        v-model={[ctx.valueBind, 'value']}
        onChange={ctx.onChange}
        onSearch={ctx.searchable ? ctx.onSearch : undefined}
        onSelect={ctx.onSelect}
        onDropdownVisibleChange={ctx.onDropdownVisibleChange}
        v-slots={{
          dropdownRender: ctx.$slots?.dropdownRender,
          options() {
            return ctx.$slots?.options?.({ options: ctx.displayOptions }) ?? renderOptions;
          }
        }}
      >
        {ctx.$slots?.default?.()}
      </AutoComplete>
    ) : (
      <Select
        size={ctx.size}
        mode={ctx.mode}
        labelInValue={false}
        allowClear={ctx.clearable}
        optionLabelProp='title'
        optionFilterProp={ctx.dataFilterField}
        placeholder={ctx.placeholder}
        filterOption={false}
        showArrow={true}
        maxTagCount={ctx.maxTagCount}
        maxTagTextLength={ctx.maxTagTextLength}
        maxTagPlaceholder={ctx.maxTagPlaceholder}
        disabled={ctx.disabled}
        showSearch={ctx.searchable}
        dropdownStyle={ctx.dropdownStyle}
        dropdownMatchSelectWidth={ctx.dropdownMatchSelectWidth}
        v-model={[ctx.valueBind, 'value']}
        onChange={ctx.onChange}
        onSearch={ctx.searchable ? ctx.onSearch : undefined}
        onSelect={ctx.onSelect}
        onDropdownVisibleChange={ctx.onDropdownVisibleChange}
        v-slots={{
          dropdownRender: ctx.$slots?.dropdownRender,
          suffixIcon: ctx.$slots?.suffixIcon
            ? () => {
                return ctx.$slots?.suffixIcon?.();
              }
            : undefined,
          notFoundContent: () =>
            ctx.loading ? (
              <div class='tw-p-2 tw-text-center'>
                <Spin size='small' />
              </div>
            ) : !ctx.displayOptions.length ? (
              <Empty class='ant-empty-small' image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : undefined
        }}
      >
        {ctx.loading ? undefined : ctx.$slots?.options?.({ options: ctx.displayOptions }) ?? renderOptions}
      </Select>
    );
  }
});
