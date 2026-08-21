/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#123C36',
          hover: '#0D302B',
          soft: '#E8F0ED',
        },
        secondary: {
          DEFAULT: '#F5F0E7',
        },
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
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
