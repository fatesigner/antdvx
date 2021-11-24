/**
 * x-combobox
 */

import { debounce } from '@fatesigner/utils';
import { Input, Select, SelectOption, Spin } from 'ant-design-vue';
import { isArray, isFunction, isNullOrUndefined, isObject } from '@fatesigner/utils/type-check';
import { PropType, computed, defineComponent, nextTick, onMounted, reactive, ref, watch } from 'vue';
import { createElement } from '@fatesigner/utils/document';

import { focus } from '../../directives';

/**
 * 列表项
 */
export type IXComboboxOptions<TModel extends Record<string, any>> = TModel[];

/**
 * 过滤列表项
 */
export type IXComboboxFilter<TModel extends Record<string, any>> = (searchInput: string, option: TModel) => boolean;

/**
 * 异步获取列表项数据
 */
export type IXComboboxOptionsPromise<TModel extends Record<string, any>> = (searchInput: string) => Promise<TModel[]>;

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
   * 提供数据项值的字段，将根据此字段设置为 value 值，默认为 value
   */
  dataValueField?: string;

  /**
   * 提供列表项文本内容的数据项字段，将根据此字段过滤数据源，默认为 text
   */
  dataTextField?: string;

  /**
   * 选中的值
   */
  value?: string | number;

  /**
   * 指定用户输入的搜索文本后，触发筛选前的延迟时间（毫秒），默认为 300
   */
  delay?: number;

  /**
   * 列表项数据
   */
  options: IXComboboxOptions<TModel>;

  /**
   * 过滤列表项
   */
  filter?: IXComboboxFilter<TModel>;

  /**
   * 需要过滤的字段列表，默认为定义的 dataTextField 字段
   */
  filterFields?: string[];

  loadData?: IXComboboxOptionsPromise<TModel>;
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
    value: undefined,
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
    dataValueField: {
      type: String
    },
    dataTextField: {
      type: String
    },
    multiple: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number, Object, Array],
      default: undefined
    },
    delay: {
      type: Number,
      default: 300
    },
    filter: {
      type: Function as PropType<IXComboboxFilter<any>>
    },
    filterFields: {
      type: Array as PropType<string[]>
    },
    options: {
      type: Array as PropType<IXComboboxOptions<any>>,
      default() {
        return [];
      }
    },
    loadData: {
      type: Function as PropType<IXComboboxOptionsPromise<any>>
    }
  },
  directives: {
    focus
  },
  emits: ['change', 'update:value'],
  setup(props: any, { emit }) {
    // 控制在下一次激活下拉列表后是否需要回填值
    let needBackfill = false;

    const wrapRef = ref<HTMLElement>();
    const inputRef = ref();
    const selectRef = ref();
    const loading = ref(false);
    const searchInput = ref('');

    // 用于界面 options 绑定
    const optionsDisplay = reactive([]);

    const value_ = ref();

    const valueBind = ref();

    // 表现模式
    const mode = computed(() => {
      if (props.multiple) {
        if (props.importable) {
          return 'tags';
        } else {
          return 'multiple';
        }
      }
      return undefined;
    });

    const updateValue = (val: string | any[]) => {
      if (props.labelInValue) {
        if (isNullOrUndefined(props.dataValueField)) {
          console.error('If use labelInValue, please set the dataValueField property');
        } else {
          if (isArray(val)) {
            value_.value = (val as any[])
              .map((x) => {
                const cur = optionsDisplay.find((y) => y[props.dataValueField] === x);
                if (cur) {
                  return cur;
                } else {
                  if (props.importable) {
                    // 回填内容
                    return {
                      [props.dataValueField]: x,
                      [props.dataTextField]: x
                    };
                  }
                  return undefined;
                }
              })
              .filter((x) => !!x);
          } else {
            const cur = optionsDisplay.find((x) => x[props.dataValueField] === val);
            if (cur) {
              value_.value = cur;
            } else {
              if (props.importable) {
                // 回填内容
                value_.value = {
                  [props.dataValueField]: val,
                  [props.dataTextField]: val
                };
              } else {
                value_.value = undefined;
              }
            }
          }
        }
      } else {
        value_.value = val;
      }
    };

    watch(
      () => props.value,
      (val) => {
        if (val !== value_.value) {
          if (isNullOrUndefined(val)) {
            value_.value = undefined;
          } else {
            if (props.labelInValue) {
              if (isNullOrUndefined(props.dataValueField)) {
                console.error('If use labelInValue, please set the dataValueField property');
              } else {
                if (isArray(val)) {
                  valueBind.value = val.map((x) => {
                    if (!isObject(x)) {
                      console.error(`If use labelInValue, please make sure the value is an object, recieve '${x}'`);
                    }
                    return x[props.dataValueField];
                  });
                } else {
                  if (!isObject(val)) {
                    console.error(`If use labelInValue, please make sure the value is an object, recieve '${val}'`);
                  }
                  valueBind.value = val[props.dataValueField];
                }
                updateValue(valueBind.value);
              }
            } else {
              value_.value = valueBind.value = val;
            }
          }
        }
      },
      {
        immediate: true
      }
    );

    watch(value_, (val) => {
      emit('update:value', val);
    });

    //watch(valueBind, updateValue);

    // 加载数据
    const loadData = async (keywords?: string) => {
      if (isFunction(props.loadData)) {
        return props.loadData(keywords).then((res) => {
          props.options.splice(0, props.options.length, ...res);
        });
      }
    };

    // 过滤数据
    const filterData = (keywords: string) => {
      if (keywords) {
        if (props.filter) {
          optionsDisplay.splice(0, optionsDisplay.length, ...props.options.filter((x) => props.filter(keywords, x)));
        } else {
          optionsDisplay.splice(0, optionsDisplay.length, ...props.options.filter((x) => x[props.dataTextField]?.indexOf(keywords) > -1));
        }
      } else {
        optionsDisplay.splice(0, optionsDisplay.length, ...props.options);
      }
    };

    const onChange = (e) => {
      emit('change', e);
    };

    const onSearch = debounce(
      async (keywords?: string) => {
        loading.value = true;

        keywords = keywords?.trim() ?? '';

        if (props.importable) {
          searchInput.value = keywords;
        }

        // 服务端过滤
        if (props.serverFilter || !props.options.length) {
          await loadData(keywords);
        }

        filterData(keywords);

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
        if (isFunction(props.options)) {
          if ((!optionsDisplay.length || optionsDisplay.length !== props.options.length) && !loading.value) {
            onSearch();
          }
        } else {
          if ((!optionsDisplay.length || optionsDisplay.length !== props.options.length) && !loading.value) {
            onSearch();
          }
        }
        // 在搜索框内填入上次输入的值
        if (props.importable && needBackfill) {
          filterData(valueBind.value);
          setTimeout(() => {
            const $input = wrapRef.value.querySelector('input');
            if (props.labelInValue) {
              $input.value = valueBind.value;
            }
          });
        }
      } else {
        if (props.importable) {
          const s = searchInput.value?.trim();
          if (s) {
            needBackfill = true;
            valueBind.value = s;
            if (props.labelInValue) {
              value_.value = s
                ? {
                    [props.dataValueField]: s,
                    [props.dataTextField]: s
                  }
                : undefined;
            } else {
              needBackfill = false;
              value_.value = s || undefined;
            }
          }
        } else {
          // 关闭后，重置搜索框
          searchInput.value = '';
        }
      }
    };

    const onInputFocus = (e) => {};

    const onInputBlur = (e) => {};

    onMounted(() => {
      // 添加自定义 input 搜索框
      /*const $search = wrapRef.value?.querySelector('.ant-select-selection-search');
      if ($search) {
        $searchInput = createElement('<input class="antdvx-combobox-search-input" placeholder="dddddddddddd" />') as HTMLElement;
        $search.appendChild($searchInput);
      }*/

      if (isFunction(props.options)) {
        if (props.autoBind) {
          // 初始化时，自动加载数据
          onSearch();
        }
      } else {
        onSearch();
      }
    });

    return {
      wrapRef,
      inputRef,
      selectRef,
      loading,
      mode,
      searchInput,
      value_,
      valueBind,
      optionsDisplay,
      onSearch,
      onChange,
      onInputFocus,
      onInputBlur,
      onDropdownVisibleChange
    };
  },
  render(ctx) {
    const options = [];
    if (ctx.$slots.option) {
      ctx.optionsDisplay.forEach((option) => {
        options.push(ctx.$slots.option(option));
      });
    } else {
      ctx.optionsDisplay.forEach((option) => {
        options.push(
          <SelectOption
            key={ctx.dataValueField ? option[ctx.dataValueField] : option}
            value={ctx.dataValueField ? option[ctx.dataValueField] : option}
            label={ctx.dataTextField ? option[ctx.dataTextField] : option}
          >
            {ctx.dataTextField ? option[ctx.dataTextField] : option}
          </SelectOption>
        );
      });
    }
    return (
      <div class='antdvx-combobox' {...ctx.$attrs} ref='wrapRef'>
        <Input class='antdvx-combobox-search-input' ref='inputRef' size={ctx.$attrs.size} placeholder={ctx.$attrs.placeholder} />
        <Select
          ref='selectRef'
          class='antdvx-combobox-select'
          showSearch={ctx.searchable}
          size={ctx.$attrs.size}
          mode={ctx.mode}
          allowClear={ctx.clearable}
          filterOption={false}
          optionLabelProp='children'
          v-model={[ctx.valueBind, 'value']}
          onChange={ctx.onChange}
          onSearch={ctx.onSearch}
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
          {options}
        </Select>
      </div>
    );
  }
});
