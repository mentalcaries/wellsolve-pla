/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#dc2f02',
        'primary-foreground': '#ffffff',
        destructive: '#c52222',
        'destructive-foreground': '#ffffff',
        background: '#fbfcfe',
        foreground: '#0c2a4b',
        muted: '#f1f5f9',
        'muted-foreground': '#5c6370',
        accent: '#e8f4f8',
        'accent-foreground': '#0c2a4b',
        border: '#e4ebf1',
        input: '#d8e1e8',
        ring: '#dc2f02',
      },
      borderRadius: { md: '0.375rem' },
    },
  },
  plugins: [],
};
