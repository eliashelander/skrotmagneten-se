import formsPlugin from '@tailwindcss/forms';
import typographyPlugin from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  plugins: [formsPlugin, typographyPlugin],
  theme: {
    extend: {
      screens: {
        '3xl': '1764px',
        '4xl': '2000px',
        '5xl': '2350px',
        '6xl': '2560px',
        '7xl': '2680px',
        '8xl': '2800px',
      },
      zIndex: {
        'z-2': 'z-index: 2',
        'z-3': 'z-index: 3',
        'z-4': 'z-index: 4',
        'z-5': 'z-index: 5',
        'z-6': 'z-index: 6',
        'z-7': 'z-index: 7',
        'z-8': 'z-index: 8',
        'z-9': 'z-index: 9',
      },
    },
  },
};
