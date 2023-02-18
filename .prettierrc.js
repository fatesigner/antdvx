module.exports = {
  plugins: [require('prettier-plugin-tailwindcss')],
  tailwindConfig: './tailwind.config.js',
  // 一行的字符数，如果超过将会进行换行，默认为 80
  printWidth: 120,
  indent: 2,
  // 一个 tab 代表几个空格数，默认为 2
  tabWidth: 2,
  // 是否使用 tab 进行缩进，默认为 false，表示用空格进行缩减
  useTabs: false,
  // 字符串是否使用单引号，默认为 false，使用双引号
  singleQuote: true,
  jsxSingleQuote: true,
  // function 关键字前是否添加空格，默认为 false
  spaceBeforeFunctionParen: false,
  // 行位是否使用分号，默认为 true
  semi: true,
  // 是否使用尾逗号，有三个可选值 "<none|es5|all>"
  trailingComma: 'none',
  // 对象大括号直接是否有空格，默认为 true，效果：{ foo: bar }
  bracketSpacing: true,
  // 代码的解析引擎，默认为 babylon，与 babel 一致
  //parser: 'babylon',
  //parser: 'typescript',
  // 结尾是 \n \r \n\r auto
  endOfLine: 'auto'
};
