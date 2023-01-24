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
        showPopover:
        {
          'from': { transform: 'translateY(4px)', opacity: 0 },
          'to': { transform: 'translateY(0)', opacity: 1 }
        },
        closePopover:
        {
          'from': { transform: 'translateY(0)', opacity: 1 },
          'to': { transform: 'translateY(4px)', opacity: 0 },
        },
        showModal:
        {
          'from': { transform: 'translate(-50%, -50%) scale(0.8)', opacity: 0 },
          'to': { transform: 'translate(-50%, -50%) scale(1) ', opacity: 1 }
        },
        closeModal:
        {
          'from': { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
          'to': { transform: 'translate(-50%, -50%) scale(0.8)', opacity: 0 },
        }
      },
      animation: {
        showPopover: 'showPopover 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        closePopover: 'closePopover 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        showModal: 'showModal 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        closeModal: 'closeModal 300ms cubic-bezier(0.16, 1, 0.3, 1)'
      }
    },
  },
  plugins: [require('tailwind-scrollbar')],
}
