/**
 * vee-validate
 */

import AllRules from '@vee-validate/rules';
import { configure, defineRule } from 'vee-validate';
import { localize, setLocale } from '@vee-validate/i18n';
//import { ErrorMessage, Field, Form } from 'vee-validate';

import { i18n } from '@/app/i18n';

import './vee-validate.less';

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
    //app.component('VeeForm', Form);
    //app.component('VeeField', Field);
    //app.component('VeeErrorMessage', ErrorMessage);

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
