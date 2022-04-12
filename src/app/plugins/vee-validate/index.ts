/**
 * vee-validate
 */

import { SchemaOf } from 'yup';
import { clone } from '@fatesigner/utils';
import AllRules from '@vee-validate/rules';
import { ShallowReactive } from '@vue/reactivity';
import { localize, setLocale } from '@vee-validate/i18n';
// import { ErrorMessage, Field, Form } from 'vee-validate';
import { ComputedRef, Ref, shallowReactive, watch } from 'vue';
import { PublicFormContext, ValidationResult, configure, defineRule, useForm } from 'vee-validate';

import { i18n } from '@/app/i18n';

// Custom Rules
import { dateLateValidator } from './rules/date';
import { decimalValidator } from './rules/decimal';
import { passwordValidator } from './rules/password';

import './vee-validate.less';

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
export type GenericValidateFunction = (value: unknown, ctx: FieldContext) => boolean | string | Promise<boolean | string>;

interface FormOptions<TValues extends Record<string, any>> {
  validationSchema?: MaybeRef<Partial<Record<keyof TValues, GenericValidateFunction | string | Record<string, any>>> | SchemaOf<TValues>>;
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

    defineRule('decimal', decimalValidator);
    defineRule('password', passwordValidator);
    defineRule('date_late', dateLateValidator);

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

export interface VeeValidationResult<TValues extends Record<string, unknown> = Record<string, unknown>> {
  valid: boolean;
  results: Partial<Record<keyof TValues, ValidationResult>>;
  errors: Partial<Record<keyof TValues, string>>;
}

export type VeeValidateSubmissionHandler<TValues extends Record<string, unknown>> = (
  values: TValues,
  validationResult: VeeValidationResult<TValues>
) => Promise<void>;

export interface VeeValidateFormContext<TValues extends Record<string, any> = Record<string, any>> {
  context: PublicFormContext<TValues>;
  values: TValues;
  ignoreError?: boolean;
  isSubmitting: boolean;
  validationSchema: Record<keyof TValues, GenericValidateFunction | string | Record<string, any>>;
  onSubmit: VeeValidateSubmissionHandler<TValues>;
  submit: () => Promise<VeeValidationResult<TValues>>;
}

/**
 * 创建 VeeValidate 表单
 * @param opts
 * @param onSubmit
 */
export function createForm<TValues extends Record<string, any> = Record<string, any>>(
  opts: FormOptions<TValues> & {
    /**
     * 忽略错误
     */
    ignoreError?: boolean;
  },
  onSubmit: VeeValidateSubmissionHandler<TValues>
): ShallowReactive<VeeValidateFormContext<TValues>> {
  /* if (opts.validationSchema && isRef(opts.validationSchema) || isReactive(opts.validationSchema)) {
  } */

  /* let validationSchema;
  if (isRef(opts.validationSchema)) {
    validationSchema = opts.validationSchema;
  } else {
    validationSchema = reactive(opts.validationSchema);
  }

  const context = useForm(
    Object.assign(opts, {
      validationSchema
    })
  ); */

  const context = useForm<TValues>(opts as any);

  const form = shallowReactive<VeeValidateFormContext<TValues>>({
    context,
    values: context.values,
    ignoreError: opts.ignoreError,
    isSubmitting: context.isSubmitting.value,
    validationSchema: opts.validationSchema as any,
    onSubmit: onSubmit,
    async submit() {
      const res = await context.validate();
      if (res) {
        if (res.valid) {
          // 跳过错误，直接提交
          form.isSubmitting = true;
          await onSubmit(clone(form.values), res);
        } else {
          await context.submitForm();
          if (form.ignoreError) {
            // 跳过错误，直接提交
            form.isSubmitting = true;
            await onSubmit(clone(form.values), res);
          }
        }
        form.isSubmitting = false;
      }
      // formRef.dispatchEvent(new Event('submit'));
      return res;
    }
  });

  watch(context.isSubmitting, (val) => {
    form.isSubmitting = val;
  });

  return form;
}

/**
 * 手动触发指定表单的提交事件
 * @param formRef
 */
export async function triggerFormSubmit<TValues extends Record<string, any>>(formRef: HTMLElement) {
  formRef.dispatchEvent(new Event('submit'));
}
