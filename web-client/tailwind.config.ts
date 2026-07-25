import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'gmp-primary': '#FF1D25',
        'gmp-primary-hover': '#E61920',
        'gmp-dark': '#171717',
        'gmp-dark-secondary': '#050505',
        'gmp-card': '#F7F7F7',
        'gmp-card-alt': '#E0E3E7',
        'gmp-text': '#171717',
        'gmp-text-secondary': '#BDBDBD',
        'gmp-accent2': '#262626',
        'gmp-accent4': '#492830',
        'gmp-white-bg': '#FFFFFF',
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'gmp': '10px',
        'gmp-sm': '8px',
        'gmp-tag': '5px',
      },
    },
  },
  plugins: [],
}

export default config
