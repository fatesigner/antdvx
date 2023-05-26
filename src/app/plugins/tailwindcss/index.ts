/**
 * enquire
 * 响应式媒体查询配置
 */

import { isString } from '@fatesigner/utils/type-check';
import enquire from 'enquire.js';
import { BehaviorSubject } from 'rxjs';

import tailwindcssConfig from './tailwind.config';

type eventType = 'setup' | 'match' | 'unmatch';
type screenType =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '_xs'
  | '_sm'
  | '_md'
  | '_lg'
  | '_xl'
  | '_2xl'
  | '_3xl'
  | 'xs_sm'
  | 'sm_md'
  | 'md_lg'
  | 'lg_xl'
  | 'xl_2xl'
  | '2xl_3xl';

const subject = new BehaviorSubject<{
  event: eventType;
  screen: screenType;
}>(undefined);

const subjectSetup = new BehaviorSubject<{
  screen: screenType;
}>(undefined);

// 注册媒体查询范围，这里保持和 tailwindcss 的 screens 一致
Object.entries(tailwindcssConfig.theme.screens).forEach(([key, item]: any[]) => {
  let mediaStr;
  if (isString(item)) {
    mediaStr = `screen and (min-width: ${item})`;
  } else {
    mediaStr = `screen and ${[
      item.min ? `(min-width: ${item.min})` : undefined,
      item.max ? `(max-width: ${item.max})` : undefined
    ]
      .filter((x) => !!x)
      .join(' and ')}`;
  }

  enquire.register(mediaStr, {
    setup: function () {
      // Load in content via AJAX (just the once)
      // console.log('enquire setup ', key);
      // console.log('                 ', mediaStr);
      subjectSetup.next({ screen: key });
    },
    match: function () {
      // console.log('enquire match ', key);
      // console.log('                 ', mediaStr);
      subject.next({ event: 'match', screen: key });
    },
    unmatch: function () {
      // console.log('enquire unmatch: ', key);
      // console.log('                 ', mediaStr);
      subject.next({ event: 'unmatch', screen: key });
    }
  });
});

/**
 * 注册媒体查询
 * @param min
 * @param max
 * @param callback
 */
export function enquireRegister(
  min: screenType | string,
  max: screenType | string,
  callback: {
    setup?: () => void;
    match?: () => void;
    unmatch?: () => void;
  }
) {
  if (min && Object.prototype.hasOwnProperty.call(tailwindcssConfig.theme.screens, min)) {
    min = tailwindcssConfig.theme.screens[min];
  }
  if (max && Object.prototype.hasOwnProperty.call(tailwindcssConfig.theme.screens, max)) {
    max = tailwindcssConfig.theme.screens[max];
  }
  const mediaStr = `screen and ${[min ? `(min-width: ${min})` : undefined, max ? `(max-width: ${max})` : undefined]
    .filter((x) => !!x)
    .join(' and ')}`;
  return enquire.register(mediaStr, {
    setup: function () {
      // Load in content via AJAX (just the once)
      // console.log('enquire setup ', key);
      // console.log('                 ', mediaStr);
      callback?.setup?.();
    },
    match: function () {
      // console.log('enquire match ', [min, max]);
      callback?.match?.();
    },
    unmatch: function () {
      // console.log('enquire unmatch: ', [min, max]);
      callback?.unmatch?.();
    }
  });
}

/**
 * 媒体查询 obs
 */
export const enquire$ = subject.asObservable();

export const enquireSetup$ = subject.asObservable();
