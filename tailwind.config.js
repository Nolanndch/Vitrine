/** @type {import('tailwindcss').Config} */
// Le design system vit dans src/input.css (CSS natif) ; Tailwind fournit le reset et quelques utilitaires (hidden, sr-only).
module.exports = {
  content: ['./*.html', './en/*.html', './js/*.js'],
  theme: { extend: {} }
}
