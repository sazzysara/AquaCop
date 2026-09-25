/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          dark: '#0a0f1d',
          navy: '#0f172a',
          surface: '#1e293b',
          border: '#334155',
          gold: '#eab308',
          accent: '#0284c7',
          light: '#f8fafc'
        },
        risk: {
          low: '#22c55e',
          medium: '#eab308',
          high: '#f97316',
          veryhigh: '#ef4444'
        }
      }
    },
  },
  plugins: [],
}
