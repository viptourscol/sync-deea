/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1F4E5F',
        secondary: '#E9EBE6',
        ink: '#131A24',
        'semaforo-green': '#2E7D4F',
        'semaforo-amber': '#B87708',
        'semaforo-red': '#B3261E',
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
        mono: ['monospace'],
      },
    },
  },
  plugins: [],
};
