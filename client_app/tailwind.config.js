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
        g: '#9F9F9F',
        black: '#000',
      },
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
      },
      borderRadius: {
        xl: '15px',
      },
      screens: {
        xs: '320px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
        'center-lg': '1080px',
        'center-xl': '1350px',
        'full-xl': '1920px',
      },
    },
  },
  plugins: [],
}

