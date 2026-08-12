import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        matcha: {
          50: '#f3fbf4',
          100: '#dff3e2',
          200: '#bde7c3',
          300: '#8fd99a',
          400: '#5cc26f',
          500: '#36a44a',
          600: '#27833a',
          700: '#226933',
          800: '#1f522c',
          900: '#1a4225'
        }
      }
    }
  },
  plugins: []
};

export default config;
