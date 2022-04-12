/**
 * date
 */

// import dayjs from 'dayjs';

export const dateLateValidator = (value, [target], ctx) => {
  if (value && ctx.form[target]) {
    const targetTime = new Date(ctx.form[target]).getTime();
    if (targetTime) {
      const time = new Date(value).getTime();
      if (time < targetTime) {
        return `The ${ctx.field ?? 'field'} should be later than ${ctx.form[target]}`;
      }
    }
  }
  return true;
};
