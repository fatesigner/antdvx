import { nextTick } from 'vue';

/**
 * 聚焦元素指令 选项
 */
export interface IFocusDirectiveValueType {
  /**
   * 是否聚焦
   */
  focus?: boolean;
  /**
   * 指定选择器
   */
  selectors?: string;
  /**
   * 失去焦点事件
   */
  onBlur?: (e: FocusEvent) => void;
  /**
   * 得到焦点事件
   */
  onFocus?: (e: FocusEvent) => void;
}

function getElement(el: HTMLElement, value: IFocusDirectiveValueType) {
  let $el;

  if (value?.selectors) {
    $el = el.querySelector(value.selectors) as HTMLElement;
  } else {
    $el = el;
  }
  return $el;
}

function handleElement(el: HTMLElement, value: IFocusDirectiveValueType) {
  const $el = getElement(el, value);

  if ($el) {
    $el.onblur = function (e) {
      $el.dataset.focus = false;
      value?.onBlur?.(e);
    };
    $el.onfocus = function (e) {
      value?.onFocus?.(e);
    };
  }

  return $el;
}

/**
 * 聚焦元素, 及聚焦状态事件绑定
 */
export const focus = {
  mounted(el: HTMLElement, binding) {
    const value = binding.value as IFocusDirectiveValueType;
    const $el = handleElement(el, value);

    nextTick(function () {
      if (value?.focus) {
        $el?.focus();
        $el.dataset.focus = true;
      }
    });
  },
  updated(el: HTMLElement, binding) {
    const value = binding.value as IFocusDirectiveValueType;
    const $el = handleElement(el, value);

    if (value?.focus && value.focus.toString() !== $el.dataset.focus) {
      nextTick(function () {
        $el?.focus();
        $el.dataset.focus = true;
      });
    }
  },
  beforeUnmount(el: HTMLElement, binding) {
    const value = binding.value as IFocusDirectiveValueType;
    const $el = handleElement(el, value);

    $el.onblur = null;
    $el.onfocus = null;

    delete $el.dataset['focus'];
  }
};
