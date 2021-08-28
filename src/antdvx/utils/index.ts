/**
 * utils
 */

import { cloneDeep } from 'lodash-es';
import { isNullOrUndefined, isObject } from '@fatesigner/utils/type-check';

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

/**
 * 将容器滚动到指定位置
 * @param containerEl 容器元素
 * @param left
 * @param top
 * @param duration 间隔时间，默认为 0，即无动画效果
 * @returns {Promise}
 */
export function scrollTo(containerEl: HTMLElement, left: number, top: number, duration = 0): Promise<void> {
  if (isNullOrUndefined(left) && isNullOrUndefined(top)) {
    return Promise.resolve();
  }

  const initialX = containerEl.scrollLeft;
  const initialY = containerEl.scrollTop;

  const baseX = (initialX + left ?? 0) * 0.5;
  const baseY = (initialY + top ?? 0) * 0.5;
  const differenceX = initialX - baseX;
  const differenceY = initialY - baseY;

  const startTime = performance.now();

  return new Promise((resolve) => {
    const _scrollTo = isNullOrUndefined(left)
      ? function (normalizedTime) {
          containerEl.scrollTo(initialX, baseY + differenceY * Math.cos(normalizedTime * Math.PI));
        }
      : isNullOrUndefined(top)
      ? function (normalizedTime) {
          containerEl.scrollTo(baseX + differenceX * Math.cos(normalizedTime * Math.PI), initialY);
        }
      : function (normalizedTime) {
          containerEl.scrollTo(baseX + differenceX * Math.cos(normalizedTime * Math.PI), baseY + differenceY * Math.cos(normalizedTime * Math.PI));
        };

    const step = function () {
      let normalizedTime = (performance.now() - startTime) / duration;
      if (normalizedTime > 1) {
        normalizedTime = 1;
      }

      _scrollTo(normalizedTime);

      if (normalizedTime < 1) {
        requestAnimationFrame(step);
      } else {
        resolve();
      }
    };

    requestAnimationFrame(step);
  });
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