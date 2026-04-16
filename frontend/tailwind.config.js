/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          900: '#312e81',
        },
        green: {
          500: '#22c55e',
        },
        slate: {
          100: '#f1f5f9',
        }
      }
    },
  },
  plugins: [],
}
