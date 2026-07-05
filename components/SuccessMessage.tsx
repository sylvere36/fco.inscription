import Link from 'next/link'
import { Logo } from './Logo'

export function SuccessMessage() {
  return (
    <div className="rounded-3xl bg-white p-8 text-center shadow-card">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-succes/10">
        <svg
          className="h-9 w-9 text-succes"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-nuit">
        Votre inscription a bien été reçue !
      </h1>

      <p className="mx-auto mt-3 max-w-md text-nuit/70">
        Le Bureau Diocésain FCO examinera votre dossier et vous contactera par
        WhatsApp. Merci de votre engagement au service du mouvement.
      </p>

      <Link href="/" className="fco-btn-primary mt-8 inline-flex">
        Retour à l'accueil
      </Link>

      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-nuit/50">
        <Logo className="h-5 w-5" />
        <span>Fond Cœur d'Or · « Le sourire toujours »</span>
      </div>
    </div>
  )
}
