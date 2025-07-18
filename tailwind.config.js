/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'liberian-red': '#C41E3A',
        'liberian-blue': '#002868',
        primary: {
          50: '#fef2f3',
          100: '#fde6e7',
          200: '#fbd0d4',
          300: '#f7aab2',
          400: '#f27a8a',
          500: '#ea546c',
          600: '#d63c5e',
          700: '#C41E3A',
          800: '#a91d3a',
          900: '#921d38',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}