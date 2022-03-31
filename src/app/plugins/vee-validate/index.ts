/**
 * vee-validate
 */

import { SchemaOf } from 'yup';
import AllRules from '@vee-validate/rules';
import { ComputedRef, Ref, reactive } from 'vue';
// import { ErrorMessage, Field, Form } from 'vee-validate';
import { PublicFormContext, SubmissionHandler, configure, defineRule, useForm } from 'vee-validate';
import { localize, setLocale } from '@vee-validate/i18n';

import { i18n } from '@/app/i18n';

import './vee-validate.less';
import { UnwrapNestedRefs } from '@vue/reactivity';

interface FieldContext {
  field: string;
  value: unknown;
  form: Record<string, unknown>;
  rule?: {
    name: string;
    params?: Record<string, unknown> | unknown[];
  };
}
type MaybeRef<T> = Ref<T> | ComputedRef<T> | T;
type GenericValidateFunction = (value: unknown, ctx: FieldContext) => boolean | string | Promise<boolean | string>;
interface FormOptions<TValues extends Record<string, any>> {
  validationSchema?: MaybeRef<Record<keyof TValues, GenericValidateFunction | string | Record<string, any>> | SchemaOf<TValues>>;
  initialValues?: MaybeRef<TValues>;
  initialErrors?: Record<keyof TValues, string | undefined>;
  initialTouched?: Record<keyof TValues, boolean>;
  validateOnMount?: boolean;
}

export const VeeValidate = {
  install(app) {
    Object.keys(AllRules).forEach((rule) => {
      defineRule(rule, AllRules[rule]);
    });

    configure({
      bails: true,
      validateOnBlur: false, // controls if `blur` events should trigger validation with `handleChange` handler
      validateOnChange: true, // controls if `change` events should trigger validation with `handleChange` handler
      validateOnInput: true, // controls if `input` events should trigger validation with `handleChange` handler
      validateOnModelUpdate: true // controls if `update:modelValue` events should trigger validation with `handleChange` handler
    });

    // Register global component
    // app.component('VeeForm', Form);
    // app.component('VeeField', Field);
    // app.component('VeeErrorMessage', ErrorMessage);

    const loadLang = async (lang) => {
      // 导入 language，非中文环境统一使用英文
      if (lang === 'zh-CN') {
        import('@vee-validate/i18n/dist/locale/zh_CN.json').then((res) => {
          configure({
            generateMessage: localize({
              zh_CN: res.default
            })
          });
          setLocale('zh_CN');
        });
      } else {
        import('@vee-validate/i18n/dist/locale/en.json').then((res) => {
          configure({
            generateMessage: localize({
              en: res.default
            })
          });
          setLocale('en');
        });
      }
    };

    // 加载初始语言
    loadLang(i18n._.global.locale);

    // 注册 i18n 勾子，每当切换语言之后，将会执行
    i18n.hooks.afterSet.tapAsync(loadLang);
  }
};

/**
 * 创建 VeeValidate 表单
 * @param opts
 * @param onSubmit
 */
export function createForm<TValues extends Record<string, any> = Record<string, any>>(
  opts: FormOptions<TValues>,
  onSubmit: SubmissionHandler<TValues>
): UnwrapNestedRefs<{ context: PublicFormContext<TValues>; isSubmitting: boolean; onSubmit: (e?: Event) => Promise<void> }> {
  const context = useForm(opts);

  return reactive({
    context,
    isSubmitting: context.isSubmitting,
    onSubmit: context.handleSubmit(onSubmit)
  });
}

/**
 * 手动触发指定表单的提交事件
 * @param formRef
 */
export function triggerFormSubmit(formRef: HTMLElement) {
  formRef.dispatchEvent(new Event('submit'));
}
