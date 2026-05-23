import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFB6C1',
        'primary-dark': '#FF9AAC',
        secondary: '#E0F7FA',
        accent: '#FFF9C4',
        background: '#FAFAFA',
        'text-primary': '#424242',
        'text-secondary': '#9E9E9E',
        success: '#81C784',
      },
      borderRadius: {
        'card': '16px',
        'input': '12px',
      },
    },
  },
  plugins: [],
}

export default config
