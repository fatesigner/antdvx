/**
 * decimal
 */

import { defineRule } from 'vee-validate';

defineRule('decimal', (value, ...args) => {
  const [decimals = '*', separator = '.'] = args;
  if (value === null || value === undefined || value === '') {
    return false;
  }
  if (Number(decimals) === 0) {
    const s = /^-?\d*$/.test(value);
    if (s) {
      return true;
    }
    return `字段必须是数字，且不超过${decimals}位小数`;
  }
  const regexPart = decimals === '*' ? '+' : `{1,${decimals}}`;
  const regex = new RegExp(`^[-+]?\\d*(\\${separator}\\d${regexPart})?([eE]{1}[-]?\\d+)?$`);

  const s2 = regex.test(value);
  if (s2) {
    return true;
  }
  return `字段必须是数字`;
});
