/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        beige2: '#FFF7F3',
        pink: '#E56B93',
        pink2: '#8A0149',
        blue2: '#1A3D83',
        gray: '#666666',
      },
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
      },
      borderRadius: {
        xl: '15px',
      },
    },
  },
  plugins: [],
}

