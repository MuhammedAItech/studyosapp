import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#16A34A',
          hover: '#15803D',
          soft: '#DCFCE7',
          tint: '#F0FDF4',
        },
        accent: {
          DEFAULT: '#F59E0B',
          soft: '#FEF3C7',
          tint: '#FFFBEB',
        },
        success: '#16A34A',
        error: '#DC2626',
        warning: '#D97706',
      },
      spacing: {
        1: '8px',
        2: '16px',
        3: '24px',
        4: '32px',
        5: '40px',
        6: '48px',
        8: '64px',
      },
      borderRadius: {
        '2xl': '16px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.04)',
        soft: '0 2px 8px rgba(15, 23, 42, 0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
