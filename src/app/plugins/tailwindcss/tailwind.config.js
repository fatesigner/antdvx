/**
 * tailwind.config
 */

module.exports = {
  purge: ['./src/**/*.{html,vue,js,ts,jsx,tsx}'],
  content: ['./src/**/*.{html,vue,js,ts,jsx,tsx}'],
  prefix: 'tw-',
  theme: {
    fontSize: {
      xxs: ['0.625rem', { lineHeight: '0.75rem' }],
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }]
    },
    screens: {
      // min-width
      xs: '360px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
      // max-width
      _xs: { max: '359px' },
      // => @media (min-width: 359px) { ... }
      _sm: { max: '639px' },
      // => @media (min-width: 639px) { ... }
      _md: { max: '767px' },
      // => @media (min-width: 767px) { ... }
      _lg: { max: '1023px' },
      // => @media (max-width: 1023px) { ... }
      _xl: { max: '1279px' },
      // => @media (min-width: 1279px) { ... }
      _2xl: { max: '1535px' },
      // => @media (min-width: 1535px) { ... }
      _3xl: { max: '1919px' },
      // => @media (max-width: 1919px) { ... }
      // range
      xs_sm: { min: '360px', max: '639px' },
      // => @media (min-width: 360px) and (max-width: 639px) { ... }
      sm_md: { min: '640px', max: '639px' },
      // => @media (min-width: 640px) and (max-width: 767px) { ... }
      md_lg: { min: '640px', max: '639px' },
      // => @media (min-width: 640px) and (max-width: 767px) { ... }
      lg_xl: { min: '1024px', max: '1279px' },
      // => @media (min-width: 1024px) and (max-width: 1279px) { ... }
      xl_2xl: { min: '1280px', max: '1535px' },
      // => @media (min-width: 1280px) and (max-width: 1535px) { ... }
      '2xl_3xl': { min: '1536px', max: '1919px' }
      // => @media (min-width: 1536px) and (max-width: 1919px) { ... }
    },
    zIndex: {
      auto: 'auto',
      '-5': '-5',
      '-4': '-4',
      '-3': '-3',
      '-2': '-2',
      '-1': '-1',
      0: '0',
      1: '1',
      10: '10',
      20: '20',
      30: '30',
      40: '40',
      50: '50',
      100: '100',
      200: '200',
      500: '500',
      1000: '1000',
      2000: '2000',
      5000: '5000'
    },
    extend: {
      colors: {
        // 主色
        primary: '#002fa7',
        // 辅色
        secondary: '#f67828',
        // 配色
        tertiary: '#8fd9a8',
        // 成功
        success: '#52c41a',
        // 警告
        warning: '#faad14',
        // 危险
        danger: '#f5222d',
        // 七种基础色
        // red: '#ff5733',
        // orange: '#ff9100',
        // yellow: '#ffd600',
        // gree: '#67c23a',
        cyan: '#00acc1'
        // blue: '#1890ff',
        // purple: '#6559cc'
      },
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fit, minmax(0, 1fr))',
        'auto-fill': 'repeat(auto-fill, minmax(0, 1fr))'
      },
      gridTemplateRows: {
        'auto-fit': 'repeat(auto-fit, minmax(0, 1fr))',
        'auto-fill': 'repeat(auto-fill, minmax(0, 1fr))'
      }
    }
  },
  variants: {
    extend: {}
  },
  corePlugins: {
    container: false
  },
  plugins: [require('@tailwindcss/line-clamp')]
};
