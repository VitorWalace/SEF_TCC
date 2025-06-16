/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'brand-primary': '#1a237e', // Um azul navy profundo
        'brand-secondary': '#263238', // Cinza escuro para texto
        'brand-accent': '#00796b',    // Verde-azulado (teal) para botões e links
        'brand-accent-hover': '#004d40',
        'brand-light': '#f5f7fa',    // Um cinza muito claro para fundos
      }
    },
  },
  plugins: [],
}
