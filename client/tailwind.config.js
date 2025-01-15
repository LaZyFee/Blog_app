/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F97316',
      },
      fontFamily: {
        serif: ['"Serif Font"', 'serif'],
        monospace: ['"Monospace Font"', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui'),
    function ({ addUtilities }) {
      addUtilities({
        '.text-pre-wrap': {
          whiteSpace: 'pre-wrap',
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
        },
      });
    },
  ],
  daisyui: {
    themes: ["nord", "night"],
  },
};
