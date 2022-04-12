import { TransitionCollapse, XButtonRefresh } from '@/antdvx';
import { isFunction, isString } from '@fatesigner/utils/type-check';
import { PropType, computed, defineComponent, nextTick, onMounted, ref } from 'vue';
import { Alert, Checkbox, CheckboxGroup, RadioButton, RadioGroup, Spin } from 'ant-design-vue';

import $styles from './chek-group.module.less';

type DataFieldMap<TModel extends Record<string, any>> = (option: TModel) => string;

type IOptionsPromise<TModel extends Record<string, any>> = () => Promise<TModel[]>;

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
 * 用于平铺的 checkbox group
 */
export const CheckGroup = defineComponent({
  name: 'CheckGroup',
  props: {
    multiple: {
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
    value: {
      type: [String, Number, Object, Array]
    },
    options: {
      type: Array as PropType<any[]>,
      default() {
        return [];
      }
    },
    optionsLoader: {
      type: Function as PropType<IOptionsPromise<any>>
    }
  },
  emits: ['change', 'update:value', 'update:options'],
  setup(props: any, { emit }) {
    const error = ref();
    const loading = ref(false);
    const options_ = ref([]);

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

    const handleChange = (e) => {
      nextTick(() => {
        emit('update:value', e);
        emit('change', e);
      });
    };

    const loadData = async () => {
      if (isFunction(props.optionsLoader)) {
        loading.value = true;
        await props
          .optionsLoader()
          .then((res) => {
            options_.value = res;
            emit('update:options', options_);
          })
          .catch((err) => {
            error.value = err.message;
          });
      } else {
        options_.value = props.options;
      }
      loading.value = false;
    };

    onMounted(() => {
      // 初始化时，自动加载数据
      loadData();
    });

    return {
      error,
      loading,
      dataValueMap,
      dataTextMap,
      dataKeyMap,
      options_,
      handleChange,
      loadData
    };
  },
  render(ctx) {
    const renderOptions = [];
    if (!ctx.$slots.options) {
      if (ctx.$slots.option) {
        ctx.options_.forEach((option) => {
          const key = ctx.dataKeyMap(option);
          const value = ctx.dataValueMap(option);
          if (ctx.multiple) {
            renderOptions.push(
              <Checkbox key={key} disabled={option.readonly} value={value}>
                {ctx.$slots.option(option)}
              </Checkbox>
            );
          } else {
            renderOptions.push(
              <RadioButton key={key} disabled={option.readonly} value={value}>
                {ctx.$slots.option(option)}
              </RadioButton>
            );
          }
        });
      } else {
        ctx.options_.forEach((option) => {
          const key = ctx.dataKeyMap(option);
          const value = ctx.dataValueMap(option);
          const text = ctx.dataTextMap(option);
          if (ctx.multiple) {
            renderOptions.push(
              <Checkbox key={key} disabled={option.readonly} value={value}>
                {text}
              </Checkbox>
            );
          } else {
            renderOptions.push(
              <RadioButton key={key} disabled={option.readonly} value={value}>
                {text}
              </RadioButton>
            );
          }
        });
      }
    }
    return (
      <div class={$styles['check-group']}>
        <TransitionCollapse>
          {ctx.loading ? (
            <Spin />
          ) : ctx.error ? (
            <Alert
              type='error'
              v-slots={{
                description() {
                  return (
                    <div class='tw-flex tw-flex-wrap tw-gap-1'>
                      <div>{ctx.error}</div>
                      <XButtonRefresh onlyIcon type='link' handler={ctx.loadData} />
                    </div>
                  );
                }
              }}
            />
          ) : ctx.multiple ? (
            <CheckboxGroup
              value={ctx.value}
              onChange={(e) => {
                ctx.handleChange(e.target.value);
              }}>
              <div class='tw-flex tw-flex-wrap tw-gap-x-6 tw-gap-y-2'>{ctx.$slots?.options?.({ options: ctx.options_ }) ?? renderOptions}</div>
            </CheckboxGroup>
          ) : (
            <RadioGroup
              value={ctx.value}
              onChange={(e) => {
                ctx.handleChange(e.target.value);
              }}>
              {ctx.$slots?.options?.({ options: ctx.options_ }) ?? renderOptions}
            </RadioGroup>
          )}
        </TransitionCollapse>
      </div>
    );
  }
});
