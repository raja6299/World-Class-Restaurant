import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        aurum: {
          'ivory': '#FAF7F2',
          'cream': '#FDFBF7',
          'beige': '#EFEBE1',
          'champagne': '#E8DCC4',
          'gold': '#C4A77D',
          'olive': '#4A533E',
          'brown': '#3E3128',
          'charcoal': '#2A2A2A',
        },
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'Georgia', 'Times New Roman', 'serif'],
        inter: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        'aurum-sm': '0 2px 8px rgba(45, 45, 45, 0.08)',
        'aurum-md': '0 4px 16px rgba(45, 45, 45, 0.08)',
        'aurum-lg': '0 8px 16px rgba(45, 45, 45, 0.12)',
        'aurum-xl': '0 16px 32px rgba(45, 45, 45, 0.15)',
      },
      borderColor: {
        'aurum-gold': 'rgba(212, 175, 55, 0.2)',
      },
      maxWidth: {
        'aurum': '1400px',
      },
      keyframes: {
        'scroll-dot': {
          '0%, 100%': { transform: 'translateY(0)', opacity: '1' },
          '50%': { transform: 'translateY(8px)', opacity: '0.3' },
        },
        'pulse-subtle': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' },
        },
      },
      animation: {
        'scroll-dot': 'scroll-dot 2s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
