/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './en/*.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
        dot: ['Doto', '"Space Mono"', 'monospace'],
      },
      colors: {
        paper: '#f2f2f2',
        ink: '#0a0a0a',
        muted: '#555555',
        line: '#d4d4d4',
        accent: '#d71921',
        softbg: '#e9e9e9'
      },
      borderRadius: {
        xl: '1.25rem',
        '2xl': '1.75rem'
      },
      scale: {
        102: '1.02'
      }
    }
  }
}
