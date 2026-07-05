import type { Metadata, Viewport } from 'next'
import { Lexend } from 'next/font/google'
import './globals.css'

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Rejoindre le Fond Cœur d'Or — FCO",
  description:
    "Formulaire d'inscription au Fond Cœur d'Or (FCO), initiative solidaire des encadreurs du MADEB Archidiocèse de Cotonou.",
}

export const viewport: Viewport = {
  themeColor: '#1C2340',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={lexend.variable}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
