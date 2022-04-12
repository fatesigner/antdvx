/**
 * decimal
 */

export const decimalValidator = (value, [decimals = 0], ctx) => {
  if (value === null || value === undefined || value === '') {
    return true;
  }

  const regex = new RegExp(`^\\d+(\\.\\d{0,${decimals ?? ''}})?$`);

  const s = regex.test(value);

  if (s) {
    return true;
  }

  if (decimals === 0) {
    return `The ${ctx.field ?? 'field'} must be an integer`;
  }

  return `The ${ctx.field ?? 'field'} should less than ${decimals} digits`;
};
