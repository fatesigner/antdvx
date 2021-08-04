/**
 * splash-screen
 * 用于单页面应用首屏的 loading 动画
 */

const $el = document.querySelector('#splash-screen .message');

if ($el) {
  $el.innerHTML = document.title;
}
