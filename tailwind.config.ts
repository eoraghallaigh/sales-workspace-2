import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'lexend': ['Lexend Deca', 'Helvetica', 'Arial', 'sans-serif'],
        'source-code': ['Source Code Pro', 'Consolas', 'Monaco', 'Courier New', 'monospace'],
      },
      colors: {
        // Trellis Light Color System - Base Neutral Scale
        'trellis-neutral': {
          100: '#f8f7f6',
          200: '#f5f3f2', 
          300: '#efedeb',
          400: '#e7e5e4',
          500: '#cfcccb',
          600: '#b6b1af',
          700: '#8c8787',
          800: '#676565',
          900: '#4d4c4c',
          1000: '#333333',
          1100: '#292929',
          1200: '#242424',
          1300: '#1f1f1f',
          1400: '#1c1c1c',
          1500: '#171717',
          1600: '#141414',
        },
        
        // Brand Color Scales
        'trellis-red': {
          200: '#fcf5f3',
          300: '#fcece9',
          500: '#fcc5be',
          800: '#ff3842',
          900: '#d9002b',
          1000: '#ac0020',
          1100: '#850016',
          1200: '#63040e',
          1300: '#4a0605',
        },
        'trellis-orange': {
          200: '#fcf5f2',
          300: '#fcece6',
          400: '#fbddd2',
          500: '#fcc6b1',
          600: '#ffa581',
          700: '#ff7d4c',
          800: '#ff4800',
          900: '#c93700',
          1000: '#9f2800',
          1100: '#7b1d00',
          1200: '#591802',
          1300: '#411204',
        },
        'trellis-yellow': {
          200: '#fcf6e6',
          400: '#fbe0a5',
          500: '#fccb57',
          800: '#b67e0e',
          900: '#956309',
          1000: '#784b05',
          1100: '#5e3804',
          1200: '#452805',
          1300: '#331e06',
        },
        'trellis-green': {
          200: '#edf4ef',
          300: '#daefe1',
          400: '#bde7cb',
          500: '#97dbae',
          600: '#6acb8c',
          800: '#119d49',
          900: '#00823a',
          1000: '#006831',
          1100: '#005027',
          1200: '#003c1e',
          1300: '#002d16',
        },
        'trellis-teal': {
          200: '#e0fcfa',
          400: '#b3f0ed',
          600: '#48d1cf',
          800: '#009b9c',
          900: '#007c7d',
          1000: '#006162',
          1100: '#00494b',
          1200: '#033637',
        },
        'trellis-blue': {
          300: '#e1f2fb',
          500: '#acdaf4',
          600: '#8cc4f4',
          800: '#078cfd',
          900: '#016de1',
          1000: '#0050c7',
          1100: '#0035b2',
          1200: '#0c18a0',
        },
        'trellis-purple': {
          200: '#f9f5ff',
          300: '#efeefd',
          500: '#d7cdfc',
          600: '#c4b4f7',
          800: '#9778ec',
          900: '#7d53e9',
          1000: '#6431da',
          1100: '#5113ba',
          1200: '#321986',
          1300: '#25155e',
        },
        'trellis-magenta': {
          300: '#fcebf2',
          400: '#fbdbe9',
          500: '#fcc3dc',
          600: '#ff9fcc',
          800: '#fb31a7',
          900: '#d20688',
          1000: '#a5016a',
          1100: '#800051',
          1200: '#5e043b',
          1400: '#46062B',
        },
        
        // Alpha Colors
        'trellis-alpha-dark': {
          100: 'rgba(20, 20, 20, 0.1)',
          700: 'rgba(20, 20, 20, 0.7)',
          800: 'rgba(20, 20, 20, 0.8)',
          1300: 'rgba(20, 20, 20, 1.0)',
        },
        'trellis-alpha-light': {
          1500: 'rgba(255, 255, 255, 1.0)',
        },
        
        // Base Colors
        'trellis-white': '#ffffff',
        'trellis-black': '#141414',
        'canvas-white': '#ffffff',
        
        // Fixed Semantic Fill Colors - proper naming for bg- classes
        'fill-primary': {
          DEFAULT: 'var(--color-fill-primary-default)',
          hover: 'var(--color-fill-primary-hover)',
          pressed: 'var(--color-fill-primary-pressed)',
          subtle: 'var(--color-fill-primary-subtle)',
          disabled: 'var(--color-fill-primary-disabled)',
        },
        'fill-secondary': {
          DEFAULT: 'var(--color-fill-secondary-default)',
          hover: 'var(--color-fill-secondary-hover)',
          pressed: 'var(--color-fill-secondary-pressed)',
          subtle: 'var(--color-fill-secondary-subtle)',
          disabled: 'var(--color-fill-secondary-disabled)',
        },
        'fill-tertiary': {
          DEFAULT: 'var(--color-fill-tertiary-default)',
          hover: 'var(--color-fill-tertiary-hover)',
          pressed: 'var(--color-fill-tertiary-pressed)',
          disabled: 'var(--color-fill-tertiary-disabled)',
          subtle: 'var(--color-fill-tertiary-subtle)',
          alt: 'var(--color-fill-tertiary-alt)',
        },
        'fill-surface': {
          recessed: 'var(--color-fill-surface-recessed)',
          'recessed-hover': 'var(--color-fill-surface-recessedhover)',
          'recessed-pressed': 'var(--color-fill-surface-recessedpressed)',
          DEFAULT: 'var(--color-fill-surface-default)',
          'default-hover': 'var(--color-fill-surface-defaulthover)',
          'default-pressed': 'var(--color-fill-surface-defaultpressed)',
          raised: 'var(--color-fill-surface-raised)',
          overlay: 'var(--color-fill-surface-overlay)',
        },
        'fill-brand': {
          DEFAULT: 'var(--color-fill-brand-default)',
          hover: 'var(--color-fill-brand-hover)',
          pressed: 'var(--color-fill-brand-pressed)',
          subtle: 'var(--color-fill-brand-subtle)',
        },
        'fill-positive': {
          DEFAULT: 'var(--color-fill-positive-default)',
          hover: 'var(--color-fill-positive-hover)',
          pressed: 'var(--color-fill-positive-pressed)',
          subtle: 'var(--color-fill-positive-subtle)',
          alt: 'var(--color-fill-positive-alt)',
        },
        'fill-caution': {
          DEFAULT: 'var(--color-fill-caution-default)',
          hover: 'var(--color-fill-caution-hover)',
          pressed: 'var(--color-fill-caution-pressed)',
          subtle: 'var(--color-fill-caution-subtle)',
          alt: 'var(--color-fill-caution-alt)',
        },
        'fill-alert': {
          DEFAULT: 'var(--color-fill-alert-default)',
          hover: 'var(--color-fill-alert-hover)',
          pressed: 'var(--color-fill-alert-pressed)',
          subtle: 'var(--color-fill-alert-subtle)',
        },
        'fill-info': {
          DEFAULT: 'var(--color-fill-info-default)',
          hover: 'var(--color-fill-info-hover)',
          pressed: 'var(--color-fill-info-pressed)',
          subtle: 'var(--color-fill-info-subtle)',
        },

        /* ────────────────────────────────
         * shadcn / Lovable palette aliases
         * ──────────────────────────────── */
        foreground:                'var(--color-text-core-default)',
        'muted-foreground':        'var(--color-text-core-subtle)',
        background:                'var(--color-fill-surface-recessed)',

        card: {
          DEFAULT:                 'var(--color-fill-surface-default)',
          foreground:              'var(--color-text-core-default)',
        },

        border:                    'var(--color-border-core-subtle)',
        input:                     'var(--color-border-core-default)',
        ring:                      'var(--color-border-interactive-default)',

        primary: {
          DEFAULT:                 'var(--trellis-color-neutral-1600)',  /* black */
          hover:                   'var(--trellis-color-neutral-1000)',
          pressed:                 'var(--trellis-color-neutral-900)',
          foreground:              'var(--color-fill-surface-default)',
        },
        secondary: {
          DEFAULT:                 'var(--color-fill-secondary-default)',
          foreground:              'var(--color-text-secondary-default)',
        },
        destructive: {
          DEFAULT:                 'var(--color-fill-alert-default)',
          foreground:              'var(--color-text-alert-onfilldefault)',
        },
        muted: {
          DEFAULT:                 'var(--color-fill-surface-recessed)',
          foreground:              'var(--color-text-core-subtle)',
        },
        accent: {
          DEFAULT:                 'var(--trellis-color-neutral-1600)', /* black */
          hover:                   'var(--trellis-color-neutral-1000)',
          pressed:                 'var(--trellis-color-neutral-900)',
          foreground:              'var(--trellis-color-neutral-100)',
        },
        popover: {
          DEFAULT:                 'var(--color-fill-surface-overlay)',
          foreground:              'var(--color-text-core-default)',
        },
        'text-interactive': {
          DEFAULT:                 'var(--color-text-interactive-default)',
          hover:                   'var(--color-text-interactive-defaulthover)',
          pressed:                 'var(--color-text-interactive-defaultpressed)',
        },
        /* ──────────────────────────────── */
      },
      
      borderColor: {
        // Fixed Border Colors - using borderColor to avoid repetition
        'core': {
          DEFAULT: 'var(--color-border-core-default)',
          hover: 'var(--color-border-core-hover)',
          pressed: 'var(--color-border-core-pressed)',
          subtle: 'var(--color-border-core-subtle)',
          disabled: 'var(--color-border-core-disabled)',
          'on-fill': 'var(--color-border-core-onfilldefault)',
        },
        'interactive': {
          DEFAULT: 'var(--color-border-interactive-default)',
          pressed: 'var(--color-border-interactive-pressed)',
        },
        'container': {
          DEFAULT: 'var(--color-border-container-default)',
        },
        'brand': {
          DEFAULT: 'var(--color-border-brand-default)',
        },
        'positive': {
          DEFAULT: 'var(--color-border-positive-default)',
        },
        'caution': {
          DEFAULT: 'var(--color-border-caution-default)',
        },
        'alert': {
          DEFAULT: 'var(--color-border-alert-default)',
        },
        'info': {
          DEFAULT: 'var(--color-border-info-default)',
        },
      },
      
      fontSize: {
        // Display Typography
        'display-100': ['56px', { lineHeight: '72px', letterSpacing: '-0.32px', fontWeight: '500' }],
        'display-200': ['66px', { lineHeight: '76px', letterSpacing: '-0.32px', fontWeight: '500' }],
        'display-300': ['76px', { lineHeight: '88px', letterSpacing: '-0.32px', fontWeight: '500' }],
        'display-400': ['84px', { lineHeight: '96px', letterSpacing: '-0.32px', fontWeight: '500' }],
        'display-500': ['94px', { lineHeight: '100px', letterSpacing: '-0.32px', fontWeight: '500' }],
        
        // Heading Typography
        'heading-25': ['12px', { lineHeight: '18px', fontWeight: '600' }],
        'heading-50': ['14px', { lineHeight: '18px', fontWeight: '600' }],
        'heading-100': ['16px', { lineHeight: '20px', fontWeight: '600' }],
        'heading-200': ['18px', { lineHeight: '24px', fontWeight: '500' }],
        'heading-300': ['20px', { lineHeight: '24px', fontWeight: '600' }],
        'heading-400': ['22px', { lineHeight: '27px', fontWeight: '500' }],
        'heading-500': ['24px', { lineHeight: '29px', fontWeight: '300' }],
        'heading-600': ['32px', { lineHeight: '39px', fontWeight: '700' }],
        'heading-700': ['36px', { lineHeight: '44px', letterSpacing: '-0.16px', fontWeight: '500' }],
        'heading-800': ['42px', { lineHeight: '52px', letterSpacing: '-0.16px', fontWeight: '500' }],
        'heading-900': ['46px', { lineHeight: '56px', letterSpacing: '-0.16px', fontWeight: '500' }],
        'heading-1000': ['55px', { lineHeight: '67px', fontWeight: '700' }],
        
        // Body Typography
        'body-100': ['14px', { lineHeight: '24px', fontWeight: '300' }],
        'body-125': ['14px', { lineHeight: '24px', fontWeight: '600' }],
        'body-200': ['16px', { lineHeight: '24px', fontWeight: '300' }],
        'body-300': ['18px', { lineHeight: '24px', fontWeight: '400' }],
        'body-400': ['20px', { lineHeight: '28px', fontWeight: '400' }],
        'body-500': ['22px', { lineHeight: '28px', fontWeight: '400' }],
        'body-600': ['26px', { lineHeight: '32px', fontWeight: '400' }],
        'body-700': ['28px', { lineHeight: '36px', fontWeight: '400' }],
        
        // Detail Typography
        'detail-100': ['12px', { lineHeight: '14px', fontWeight: '300' }],
        'detail-200': ['12px', { lineHeight: '18px', fontWeight: '300' }],
        
        // Link Typography
        'link-25': ['12px', { lineHeight: '18px', fontWeight: '700' }],
        'link-100': ['14px', { lineHeight: '24px', fontWeight: '700' }],
        'link-200': ['16px', { lineHeight: '24px', fontWeight: '700' }],
        'link-300': ['20px', { lineHeight: '24px', fontWeight: '700' }],
        'link-400': ['22px', { lineHeight: '27px', fontWeight: '700' }],
        'link-500': ['24px', { lineHeight: '29px', fontWeight: '700' }],
        'link-600': ['32px', { lineHeight: '39px', fontWeight: '700' }],
        
        // Code Typography
        'code-100': ['14px', { lineHeight: '24px', fontWeight: '500' }],
        
        // Table Header Typography
        'table-header': ['12px', { lineHeight: '20px', fontWeight: '500' }],
      },
      
      spacing: {
        '0': '0px',
      },
      
      borderRadius: {
        '0': '0px',
        '100': '4px',
        '200': '4px', 
        '300': '8px',
        '400': '16px',
        'full': '999999px',
        'transitional-component': '4px',
        'transitional-container': '8px',
        'transitional-container-alt': '8px',
        'transitional-floating': '16px',
        'transitional-full-0': '999999px',
        'transitional-full-3': '999999px',
        'transitional-full-8': '999999px',
      },
      
      borderWidth: {
        '0': '0px',
        '100': '1px',
        '200': '2px',
        '300': '4px',
        'transitional-1': '1px',
        'transitional-2': '1px',
      },
      
      boxShadow: {
        '100': '0px 1px 8px 0px rgba(20, 20, 20, 0.08)',
        '200': '0px 8px 16px 0px rgba(20, 20, 20, 0.04)',
        '300': '0px 16px 32px 0px rgba(20, 20, 20, 0.08)',
        '400': '0px 24px 48px 0px rgba(20, 20, 20, 0.08)',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        // Display Typography
        '.display-100': { fontFamily: 'Lexend Deca, Helvetica, Arial, sans-serif', fontSize: '56px', lineHeight: '72px', letterSpacing: '-0.32px', fontWeight: '500' },
        '.display-200': { fontFamily: 'Lexend Deca, Helvetica, Arial, sans-serif', fontSize: '66px', lineHeight: '76px', letterSpacing: '-0.32px', fontWeight: '500' },
        '.display-300': { fontFamily: 'Lexend Deca, Helvetica, Arial, sans-serif', fontSize: '76px', lineHeight: '88px', letterSpacing: '-0.32px', fontWeight: '500' },
        '.display-400': { fontFamily: 'Lexend Deca, Helvetica, Arial, sans-serif', fontSize: '84px', lineHeight: '96px', letterSpacing: '-0.32px', fontWeight: '500' },
        '.display-500': { fontFamily: 'Lexend Deca, Helvetica, Arial, sans-serif', fontSize: '94px', lineHeight: '100px', letterSpacing: '-0.32px', fontWeight: '500' },
        
        // Heading Typography
        '.heading-25': { fontFamily: 'Lexend Deca, Helvetica, Arial, sans-serif', fontSize: '12px', lineHeight: '18px', fontWeight: '600' },
        '.heading-50': { fontFamily: 'Lexend Deca, Helvetica, Arial, sans-serif', fontSize: '14px', lineHeight: '18px', fontWeight: '600' },
        '.heading-100': { fontFamily: 'Lexend Deca, Helvetica, Arial, sans-serif', fontSize: '16px', lineHeight: '20px', fontWeight: '600' },
        '.heading-200': { fontFamily: 'Lexend Deca, Helvetica, Arial, sans-serif', fontSize: '18px', lineHeight: '24px', fontWeight: '500' },
        '.heading-300': { fontFamily: 'Lexend Deca, Helvetica, Arial, sans-serif', fontSize: '20px', lineHeight: '24px', fontWeight: '600' },
        '.heading-400': { fontFamily: 'Lexend Deca, Helvetica, Arial, sans-serif', fontSize: '22px', lineHeight: '27px', fontWeight: '500' },
        '.heading-500': { fontFamily: 'Lexend Deca, Helvetica, Arial, sans-serif', fontSize: '24px', lineHeight: '29px', fontWeight: '300' },
        '.heading-600': { fontFamily: 'Lexend Deca, Helvetica, Arial, sans-serif', fontSize: '32px', lineHeight: '39px', fontWeight: '700' },
        '.heading-700': { fontFamily: 'Lexend Deca, Helvetica, Arial, sans-serif', fontSize: '36px', lineHeight: '44px', letterSpacing: '-0.16px', fontWeight: '500' },
        '.heading-800': { fontFamily: 'Lexend Deca, Helvetica, Arial, sans-serif', fontSize: '42px', lineHeight: '52px', letterSpacing: '-0.16px', fontWeight: '500' },
        '.heading-900': { fontFamily: 'Lexend Deca, Helvetica, Arial, sans-serif', fontSize: '46px', lineHeight: '56px', letterSpacing: '-0.16px', fontWeight: '500' },
        '.heading-1000': { fontFamily: 'Lexend Deca, Helvetica, Arial, sans-serif', fontSize: '55px', lineHeight: '67px', fontWeight: '700' },
        
        // Body Typography
        '.body-100': { fontFamily: 'Lexend Deca, Helvetica, Arial, sans-serif', fontSize: '14px', lineHeight: '24px', fontWeight: '300' },
        '.body-125': { fontFamily: 'Lexend Deca, Helvetica, Arial, sans-serif', fontSize: '14px', lineHeight: '24px', fontWeight: '600' },
        '.body-200': { fontFamily: 'Lexend Deca, Helvetica, Arial, sans-serif', fontSize: '16px', lineHeight: '24px', fontWeight: '300' },
        '.body-300': { fontFamily: 'Lexend Deca, Helvetica, Arial, sans-serif', fontSize: '18px', lineHeight: '24px', fontWeight: '400' },
        '.body-400': { fontFamily: 'Lexend Deca, Helvetica, Arial, sans-serif', fontSize: '20px', lineHeight: '28px', fontWeight: '400' },
        '.body-500': { fontFamily: 'Lexend Deca, Helvetica, Arial, sans-serif', fontSize: '22px', lineHeight: '28px', fontWeight: '400' },
        '.body-600': { fontFamily: 'Lexend Deca, Helvetica, Arial, sans-serif', fontSize: '26px', lineHeight: '32px', fontWeight: '400' },
        '.body-700': { fontFamily: 'Lexend Deca, Helvetica, Arial, sans-serif', fontSize: '28px', lineHeight: '36px', fontWeight: '400' },
        
        // Detail Typography
        '.detail-100': { fontFamily: 'Lexend Deca, Helvetica, Arial, sans-serif', fontSize: '12px', lineHeight: '14px', fontWeight: '300' },
        '.detail-200': { fontFamily: 'Lexend Deca, Helvetica, Arial, sans-serif', fontSize: '12px', lineHeight: '18px', fontWeight: '300' },
        
        // Link Typography
        '.link-25': { fontFamily: 'Lexend Deca, Helvetica, Arial, sans-serif', fontSize: '12px', lineHeight: '18px', fontWeight: '700' },
        '.link-100': { fontFamily: 'Lexend Deca, Helvetica, Arial, sans-serif', fontSize: '14px', lineHeight: '24px', fontWeight: '700' },
        '.link-200': { fontFamily: 'Lexend Deca, Helvetica, Arial, sans-serif', fontSize: '16px', lineHeight: '24px', fontWeight: '700' },
        '.link-300': { fontFamily: 'Lexend Deca, Helvetica, Arial, sans-serif', fontSize: '20px', lineHeight: '24px', fontWeight: '700' },
        '.link-400': { fontFamily: 'Lexend Deca, Helvetica, Arial, sans-serif', fontSize: '22px', lineHeight: '27px', fontWeight: '700' },
        '.link-500': { fontFamily: 'Lexend Deca, Helvetica, Arial, sans-serif', fontSize: '24px', lineHeight: '29px', fontWeight: '700' },
        '.link-600': { fontFamily: 'Lexend Deca, Helvetica, Arial, sans-serif', fontSize: '32px', lineHeight: '39px', fontWeight: '700' },
        
        // Code Typography
        '.code-100': { fontFamily: 'Source Code Pro, Consolas, Monaco, Courier New, monospace', fontSize: '14px', lineHeight: '24px', fontWeight: '500' },
        
        // Table Header Typography
        '.table-header': { fontFamily: 'Lexend Deca, Helvetica, Arial, sans-serif', fontSize: '12px', lineHeight: '20px', fontWeight: '500' },
        
        // Legacy Trellis classes (for backwards compatibility)
        '.text-trellis-display-100': { fontFamily: 'Lexend Deca, Helvetica, Arial, sans-serif', fontSize: '56px', lineHeight: '72px', letterSpacing: '-0.32px', fontWeight: '500' },
        '.text-trellis-heading-300': { fontFamily: 'Lexend Deca, Helvetica, Arial, sans-serif', fontSize: '20px', lineHeight: '24px', fontWeight: '600' },
        '.text-trellis-body-200': { fontFamily: 'Lexend Deca, Helvetica, Arial, sans-serif', fontSize: '16px', lineHeight: '24px', fontWeight: '300' },
        
        // Gradients
        '.bg-trellis-gradient-hero': { background: 'linear-gradient(135deg, #FB31A7 0%, #FF4800 35%, #FBDDD2 100%)' },
        '.bg-trellis-gradient-breeze': { background: 'linear-gradient(135deg, #FF3842 0%, #D20688 100%)' },
        '.bg-trellis-gradient-shimmer': { background: 'linear-gradient(135deg, #FBDDD2 0%, #FCC3DC 100%)' },
      })
    }
  ],
}

export default config 