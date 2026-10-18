/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        odoo: {
          purple: '#714B67', 
          slate: '#334155',  
          olive: '#4B5D33',  
        },
        dark: {
          emerald: '#10B981', 
          blue: '#3B82F6',    
          bg: '#0F172A',      
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}