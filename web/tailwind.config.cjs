/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.tsx',
    './index.html'
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090A'
      },
      gridTemplateRows: {
        7: 'repeat(7, minmax(0, 1fr))'
      },
      keyframes: {
        showModal:
        {
          'from': { transform: 'translateY(4px)', opacity: 0 },
          'to': { transform: 'translateY(0)', opacity: 1 }
        },
        closeModal:
        {
          'from': { transform: 'translateY(0)', opacity: 1 },
          'to': { transform: 'translateY(4px)', opacity: 0 },
        }
      },
      animation: {
        showModal: 'showModal 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        closeModal: 'closeModal 400ms cubic-bezier(0.16, 1, 0.3, 1)'
      }
    },
  },
  plugins: [],
}
