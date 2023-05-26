/**
 * tailwind.config
 */

module.exports = {
  content: ['./node_modules/antdvx/**/*.{html,vue,js,ts,jsx,tsx}', './src/**/*.{html,vue,js,ts,jsx,tsx}'],
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
        primary: '#004a96',
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
      fontFamily: {
        // 默认中英文字体
        normal: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";`,
        // 用于数字显示的 D-DIN 字体
        'D-DIN': `"D-DIN", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";`
      },
      gridTemplateColumns: {
        // Custom column number
        16: 'repeat(16, minmax(0, 1fr))',
        18: 'repeat(18, minmax(0, 1fr))',
        24: 'repeat(24, minmax(0, 1fr))',
        36: 'repeat(36, minmax(0, 1fr))',
        'auto-fit': 'repeat(auto-fit, minmax(0, 1fr))',
        'auto-fill': 'repeat(auto-fill, minmax(0, 1fr))'
      },
      gridColumn: {
        'span-13': 'span 13 / span 13',
        'span-14': 'span 14 / span 14',
        'span-15': 'span 15 / span 15',
        'span-16': 'span 16 / span 16',
        'span-17': 'span 17 / span 17',
        'span-18': 'span 18 / span 18',
        'span-19': 'span 19 / span 19',
        'span-20': 'span 20 / span 20',
        'span-21': 'span 21 / span 21',
        'span-22': 'span 22 / span 22',
        'span-23': 'span 23 / span 23',
        'span-24': 'span 24 / span 24',
        'span-25': 'span 25 / span 25',
        'span-26': 'span 26 / span 26',
        'span-27': 'span 27 / span 27',
        'span-28': 'span 28 / span 28',
        'span-29': 'span 29 / span 29',
        'span-30': 'span 30 / span 30',
        'span-31': 'span 31 / span 31',
        'span-32': 'span 32 / span 32',
        'span-33': 'span 33 / span 33',
        'span-34': 'span 34 / span 34',
        'span-35': 'span 35 / span 35',
        'span-36': 'span 36 / span 36'
      },
      gridColumnStart: {
        13: '13',
        14: '14',
        15: '15',
        16: '16',
        17: '17',
        18: '18',
        19: '19',
        20: '20',
        21: '21',
        22: '22',
        23: '23',
        24: '24',
        25: '25',
        26: '26',
        27: '27',
        28: '28',
        29: '29',
        30: '30',
        31: '31',
        32: '32',
        33: '33',
        34: '34',
        35: '35',
        36: '36'
      },
      gridColumnEnd: {
        13: '13',
        14: '14',
        15: '15',
        16: '16',
        17: '17',
        18: '18',
        19: '19',
        20: '20',
        21: '21',
        22: '22',
        23: '23',
        24: '24',
        25: '25',
        26: '26',
        27: '27',
        28: '28',
        29: '29',
        30: '30',
        31: '31',
        32: '32',
        33: '33',
        34: '34',
        35: '35',
        36: '36'
      },
      gridTemplateRows: {
        'auto-fit': 'repeat(auto-fit, minmax(0, 1fr))',
        'auto-fill': 'repeat(auto-fill, minmax(0, 1fr))'
      },
      scale: {
        5: '0.05',
        10: '0.10',
        15: '0.15',
        20: '0.20',
        25: '0.25',
        30: '0.30',
        35: '0.35',
        40: '0.40',
        45: '0.45'
      }
    }
  },
  variants: {
    extend: {}
  },
  corePlugins: {
    container: false
  },
  plugins: []
};
