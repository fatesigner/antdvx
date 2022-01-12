/**
 * utils
 */

import { cloneDeep } from 'lodash-es';
import { isObject } from '@fatesigner/utils/type-check';

/**
 * 获取元素内容高度，不包括 padding
 * @param el
 */
export function getContentHeight(el: HTMLElement) {
  const cs = getComputedStyle(el);

  // const paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
  const paddingY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);

  // const borderX = parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
  const borderY = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);

  // elementWidth = element.offsetWidth - paddingX - borderX;
  return el.offsetHeight - paddingY - borderY;
}

// 验证是否外部地址
export function isExternal(path: string) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

// 复制文本
export function copy(text: string) {
  const input = document.createElement('textarea');
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
}

const isMergeObject = function (val) {
  return Object.prototype.toString.call(val) === '[object Object]' || Object.prototype.toString.call(val) === '[object Undefined]';
};

/**
 * 合并对象，遇到数组属性覆盖
 * @param defaultProps 默认值
 * @param props 需要覆盖的对象
 * @param deep 是否深度合并，默认为 false
 * @param assignment 自定义赋值操作，默认为引用或值的传递
 * @constructor
 */
export function mergeProps(
  defaultProps,
  props,
  deep = false,
  assignment = function (target, property, val) {
    target[property] = val;
  }
) {
  if (!props) {
    return defaultProps;
  }
  if (isMergeObject(defaultProps) && isMergeObject(props)) {
    Object.keys(defaultProps).forEach(function (key) {
      if (isMergeObject(props[key])) {
        if (Object.prototype.hasOwnProperty.call(props, key)) {
          mergeProps(defaultProps[key], props[key], deep);
        } else {
          if (isObject(defaultProps[key])) {
            if (deep) {
              // 深度合并
              assignment(props, key, {});
              mergeProps(defaultProps[key], props[key], deep);
            } else {
              assignment(props, key, defaultProps[key]);
            }
          } else if (Array.isArray(defaultProps[key])) {
            // 数组类型，将其克隆后替换
            if (deep) {
              assignment(props, key, cloneDeep(defaultProps[key]));
            } else {
              assignment(props, key, defaultProps[key]);
            }
          } else {
            // 其他非引用类型的值
            assignment(props, key, defaultProps[key]);
          }
        }
      }
    });
  }
  return props;
}

export function waitTransitionend(el: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    const callback = () => {
      resolve();
      el.removeEventListener('transitionend', callback);
    };
    el.addEventListener('transitionend', callback, false);
  });
}

export function getBoundaryPosition(value, min, max): number {
  return Math.min(Math.max(value, min), max);
}

export function getTranslate3dStyle(el: HTMLElement) {
  const results: any[] = getComputedStyle(el, null)
    .getPropertyValue('transform')
    .match(/-?\d+\.?\d*/g);

  if (!results) {
    return [0, 0, 0];
  }

  if (results.length === 6) {
    results.push(0);
    return results.slice(4, 6).map((x) => parseFloat(x));
  } else if (results.length === 16) {
    return results.slice(13, 16).map((x) => parseFloat(x));
  } else {
    return results.map((x) => parseFloat(x));
  }
}

export function getEventTarget(e: Event) {
  return e.target || e.srcElement;
}

export function getEventArgs(e: MouseEvent | TouchEvent) {
  if ((e as TouchEvent).touches) {
    return {
      // TouchEvent does not support offset position
      offsetX: 0,
      offsetY: 0,
      points: Array.from((e as TouchEvent).touches).map(({ clientX, clientY }) => [clientX, clientY])
    };
  } else {
    return {
      offsetX: (e as MouseEvent).offsetX,
      offsetY: (e as MouseEvent).offsetY,
      points: [[(e as MouseEvent).clientX, (e as MouseEvent).clientY]]
    };
  }
}

/**
 * 折叠节点, 以 height 过渡
 * @param el
 * @param callback
 */
export function collapseSection(el: HTMLElement, callback?: (el: HTMLElement) => void) {
  return new Promise<void>((resolve) => {
    if (el && el.offsetHeight) {
      const sectionHeight = el.scrollHeight;

      const elementTransition = el.style.transition;
      el.style.transition = '';

      const listener = function () {
        el.removeEventListener('transitionend', listener);
        if (callback) {
          callback(el);
        }
        resolve();
      };

      el.addEventListener('transitionend', listener, false);

      requestAnimationFrame(function () {
        el.style.height = sectionHeight + 'px';
        el.style.transition = elementTransition;

        requestAnimationFrame(function () {
          el.style.height = 0 + 'px';
        });
      });
    } else {
      resolve();
    }
  });
}

/**
 * 展开节点, 以 height 过渡
 * @param el
 * @param callback
 */
export function expandSection(el: HTMLElement, callback?: (el: HTMLElement) => void) {
  return new Promise<void>((resolve) => {
    if (el && !el.offsetHeight) {
      el.addEventListener('transitionend', function listener() {
        // el.removeEventListener('transitionend', arguments.callee);
        el.removeEventListener('transitionend', listener);
        if (callback) {
          callback(el);
        }
        el.style.height = null;
        resolve();
      });

      const sectionHeight = el.scrollHeight;

      el.style.height = sectionHeight + 'px';
    } else {
      resolve();
    }
  });
}

/**
 * 移动指定集合中的元素位置
 * @param arr
 * @param index
 * @param index2
 */
export function exchangeItem(arr: any[], index: number, index2: number) {
  if (index !== index2) {
    if (index > index2) {
      const temp = index2;
      index2 = index;
      index = temp;
    }
    const item = arr?.[index];
    if (item && arr.length >= index2 - 1) {
      arr.splice(index2 + 1, 0, item);
      arr.splice(index, 1);
    }
  }
}
