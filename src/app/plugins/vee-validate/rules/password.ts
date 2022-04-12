/**
 * password
 */

export const passwordValidator = (value, [params], ctx) => {
  if (value === null || value === undefined || value === '') {
    return true;
  }

  let min = 8;
  let max;

  if (params && Array.isArray(params)) {
    if (params?.length > 0) {
      min = params?.[0];
    }
    if (params?.length > 1) {
      max = params?.[1];
    }
  }

  const regex = new RegExp(
    `^(?=.*[A-Za-z])(?=.*\\d)(?=.*[\`~!@#$%^&*()_+<>?:"{},.\\/\\\\;'[\\]])[A-Za-z\\d\`~!@#$%^&*()_+<>?:"{},.\\/\\\\;'[\\]]{${min},${max || ''}}$`
  );

  const s = regex.test(value);

  if (s) {
    return true;
  }

  if (max) {
    return `The ${
      ctx.field ?? 'field'
    } must contains ${min} to ${max}, also contains uppercase letters, lowercase letters, and special characters, such as %, &, #.`;
  }

  return `The ${
    ctx.field ?? 'field'
  } must contains at least ${min} digits, also contains uppercase letters, lowercase letters, and special characters, such as %, &, #.`;
};
