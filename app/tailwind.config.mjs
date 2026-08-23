/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Design system §3.1 — Core Palette
        primary: {
          DEFAULT: '#123C36',
          hover: '#0D302B',
          soft: '#E8F0ED',
        },
        secondary: '#F5F0E7',
        accent: {
          DEFAULT: '#C6A56A',
          soft: '#EFE4CF',
        },
        background: '#FAF8F3',
        surface: {
          DEFAULT: '#FFFFFF',
          warm: '#F5F0E7',
        },
        text: {
          DEFAULT: '#171A18',
          secondary: '#343936',
        },
        muted: '#737873',
        border: {
          DEFAULT: '#DDD9D0',
          strong: '#BDB9B0',
        },
        success: '#2F6B50',
        warning: '#9A6B25',
        error: '#A53B3B',

        // Design system §3.2 — Dark sections
        dark: {
          DEFAULT: '#101412',
          surface: '#17201D',
          text: '#F8F5ED',
          muted: '#B9BDB8',
          border: '#34403B',
          accent: '#C6A56A',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', '"Times New Roman"', 'serif'],
        body: ['"Manrope"', 'Inter', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        none: '0px',
      },
      spacing: {
        // Design system §5.3 — Spacing Scale (4px base)
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
        10: '40px',
        12: '48px',
        16: '64px',
        20: '80px',
        24: '96px',
        32: '128px',
        40: '160px',
      },
      maxWidth: {
        container: '1440px',
      },
      fontSize: {
        // Design system §4.2 — Type Scale
        'display-hero': ['clamp(3rem, 7vw, 6.5rem)', { lineHeight: '0.95', letterSpacing: '-0.035em' }],
        'display-sm': ['clamp(2.25rem, 4.5vw, 4.5rem)', { lineHeight: '1.02', letterSpacing: '-0.025em' }],
        'heading-md': ['clamp(1.75rem, 3vw, 2.75rem)', { lineHeight: '1.05' }],
        'heading-sm': ['1.25rem', { lineHeight: '1.2' }],
        'body-lg': ['1.125rem', { lineHeight: '1.65' }],
        'body-md': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'functional-sm': ['0.8125rem', { lineHeight: '1.4', letterSpacing: '0.04em' }],
        'label-caps': ['0.6875rem', { lineHeight: '1.2', letterSpacing: '0.12em' }],
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
