/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* ─ Stitch PRO design tokens (exact) ─ */
        'primary': '#8c25f4',
        'background-light': '#f7f5f8',
        'background-dark': '#0f0b15',
        'surface-dark': '#1d1924',
        'surface-light': '#2a2433',
        'accent-purple': '#a855f7',
        'accent-green': '#22c55e',
        'accent-blue': '#3b82f6',
        'accent-orange': '#f97316',
      },
      fontFamily: {
        'display': ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'DEFAULT': '0.5rem',
        'lg': '1rem',
        'xl': '1.5rem',
        '2xl': '2rem',
        'full': '9999px',
      },
    },
  },
  plugins: [],
};
