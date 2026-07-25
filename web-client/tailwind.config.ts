import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'gmp-dark': '#1A1A2E',
        'gmp-dark-secondary': '#16213E',
        'gmp-primary': '#E94560',
        'gmp-card': '#0F3460',
        'gmp-text-secondary': '#A0A0B0',
        'gmp-border': '#2A2A4A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
