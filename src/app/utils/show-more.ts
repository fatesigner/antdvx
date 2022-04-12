/**
 * show-more
 * 动态添加显示更多按钮
 */

import { on } from '@fatesigner/utils/document';

/**
 * 动态添加显示更多按钮
 */
export function initialShowMore(options: {
  wrapSelector?: string;
  targetSelector: string;
  contentSelector: string;
  foldSelector: string;
  unfoldSelector: string;
  maxHeight: number;
  threshold?: number;
}) {
  const threshold = options?.threshold ?? 100;

  let $wrap;
  if (options?.wrapSelector) {
    $wrap = document.querySelector(options?.wrapSelector);
  } else {
    $wrap = document.body;
  }

  on($wrap, 'click', options.foldSelector, (e) => {
    // 点击折叠按钮
    const $target = e.target.closest(options.targetSelector);
    if ($target) {
      $target.style.height = options.maxHeight + 'px';
      ($target.querySelector(options.foldSelector) as HTMLElement).style.display = 'none';
      ($target.querySelector(options.unfoldSelector) as HTMLElement).style.display = 'block';
    }
  });

  on($wrap, 'click', options.unfoldSelector, (e) => {
    // 点击展开
    const $target = e.target.closest(options.targetSelector);
    if ($target) {
      $target.style.height = '';
      ($target.querySelector(options.foldSelector) as HTMLElement).style.display = 'block';
      ($target.querySelector(options.unfoldSelector) as HTMLElement).style.display = 'none';
    }
  });

  return {
    /**
     * 重新渲染
     */
    update() {
      const $targets = $wrap.querySelectorAll(options?.targetSelector);

      Array.from($targets ?? []).forEach(($target: HTMLElement) => {
        if (($target.querySelector(options.contentSelector) as HTMLElement)?.offsetHeight > options.maxHeight + threshold) {
          $target.style.height = options.maxHeight + 'px';
          ($target.querySelector(options.foldSelector) as HTMLElement).style.display = 'none';
          ($target.querySelector(options.unfoldSelector) as HTMLElement).style.display = 'block';
        } else {
          $target.style.height = '';
          ($target.querySelector(options.foldSelector) as HTMLElement).style.display = 'none';
          ($target.querySelector(options.unfoldSelector) as HTMLElement).style.display = 'none';
        }
      });
    }
  };
}
