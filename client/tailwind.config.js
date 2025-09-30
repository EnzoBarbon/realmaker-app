/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}', './features/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#F8F9FB', // app surface
          card: '#FFFFFF',
        },
        primary: {
          DEFAULT: '#FFB703', // accent (e.g., conversion rate icon)
          600: '#FFA400',
        },
        muted: {
          DEFAULT: '#EDEFF3',
          foreground: '#6B7280',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        info: '#60A5FA',
        brand: '#1E293B', // titles
      },
      borderRadius: {
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,0.06), 0 1px 3px rgba(16,24,40,0.1)',
      },
    },
  },
  plugins: [],
};
