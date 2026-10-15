/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Archivo', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        paper: '#f6f5f1',
        ink: '#121212',
        muted: '#6b6a66',
        line: '#dcd8cf',
        accent: '#2438ff',
        softbg: '#edebe4'
      },
      scale: {
        102: '1.02'
      }
    }
  }
}
