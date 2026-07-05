import { FormulaireFCO } from '@/components/FormulaireFCO'
import { Logo } from '@/components/Logo'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* En-tête sombre */}
      <header className="bg-nuit text-white">
        <div className="mx-auto max-w-2xl px-5 py-8 sm:py-10">
          <div className="mb-4 flex items-center gap-3">
            <Logo />
            <div>
              <p className="text-sm font-semibold tracking-wide text-or">
                FOND CŒUR D'OR
              </p>
              <p className="text-xs text-white/60">
                MADEB · Archidiocèse de Cotonou
              </p>
            </div>
          </div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            Rejoindre le Fond Cœur d'Or
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/70 sm:text-base">
            Une initiative solidaire des encadreurs, pour l'avenir du mouvement.
            Inscrivez-vous comme encadreur avec travaux ou comme ambassadeur.
          </p>
        </div>
      </header>

      {/* Formulaire */}
      <div className="mx-auto max-w-2xl px-5 py-8 sm:py-10">
        <FormulaireFCO />
        <p className="mt-6 text-center text-xs text-nuit/50">
          « Le sourire toujours » · Fond Cœur d'Or
        </p>
      </div>
    </main>
  )
}
