import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#e6f7ee',
          100: '#c2ebd3',
          200: '#8fd9b0',
          300: '#5cc78d',
          400: '#2eb56e',
          500: '#00A84F',   // Main brand green
          600: '#009944',
          700: '#007d36',
          800: '#006128',
          900: '#00451c',
        },
        accent: {
          50:  '#e6fbf7',
          400: '#0BC5A4',
          500: '#00B69B',
          600: '#009d84',
          900: '#003d33',
        },
        surface: {
          50:  '#F7F9FC',
          100: '#EEF2F8',
          200: '#E2E8F2',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        'card':  '0 2px 12px 0 rgba(0,0,0,.06)',
        'card-hover': '0 6px 24px 0 rgba(0,0,0,.10)',
        'sidebar': '4px 0 20px 0 rgba(0,0,0,.05)',
        'header': '0 2px 12px 0 rgba(0,168,79,.10)',
      },
      borderRadius: {
        'xl2': '14px',
        '2xl2': '18px',
      }
    },
  },
  plugins: [],
};

export default config;
