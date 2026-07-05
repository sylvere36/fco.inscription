import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Charte graphique FCO — cf. cahier des charges §VII
        madeb: '#2D40D0', // Primaire MADEB — boutons, accents, titres
        or: '#D4AC0D', // Or FCO — accent premium, badges, highlights
        nuit: '#1C2340', // Fond sombre — en-tête, sections importantes
        ciel: '#E8EBFB', // Fond clair — zones de saisie, fonds alternés
        succes: '#1A7A4A', // Messages de confirmation
        erreur: '#C0392B', // Messages d'erreur, validation
      },
      fontFamily: {
        sans: ['var(--font-lexend)', 'DM Sans', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px -6px rgba(28, 35, 64, 0.12)',
      },
    },
  },
  plugins: [],
}

export default config
