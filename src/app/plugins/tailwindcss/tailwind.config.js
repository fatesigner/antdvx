/**
 * tailwind.config
 */

module.exports = {
  purge: ['./src/**/*.{html,vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  prefix: 'tw-',
  theme: {
    extend: {
      fontSize: {
        xxs: '.65rem'
      },
      colors: {
        primary: '#8262ff'
      },
      screens: {
        // min-width
        xs: '360px',
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
