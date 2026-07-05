'use client'

import { useFormContext } from 'react-hook-form'
import type { FormValues } from '@/lib/validations'
import { PhotoUpload } from './PhotoUpload'

const OPTIONS: {
  value: 'encadreur' | 'ambassadeur'
  titre: string
  desc: string
  emoji: string
}[] = [
  {
    value: 'encadreur',
    titre: 'Encadreur avec travaux',
    desc: "Je produis déjà quelque chose (artisanat, transformation alimentaire, produit local) et souhaite le mettre en marché via le FCO.",
    emoji: '🧵',
  },
  {
    value: 'ambassadeur',
    titre: 'Ambassadeur',
    desc: 'Je souhaite promouvoir et vendre les produits FCO grâce à mon réseau. Je reçois un code de parrainage et touche 15% de commission.',
    emoji: '📣',
  },
]

export function SectionProfil({
  photo,
  setPhoto,
  photoError,
}: {
  photo: File | null
  setPhoto: (f: File | null) => void
  photoError?: string
}) {
  const { register, watch } = useFormContext<FormValues>()
  const selected = watch('profil')

  return (
    <div className="space-y-6">
      <div>
        <span className="fco-label">
          Je m'inscris en tant que <span className="text-erreur">*</span>
        </span>
        <div className="grid gap-3 sm:grid-cols-2">
          {OPTIONS.map((opt) => {
            const active = selected === opt.value
            return (
              <label
                key={opt.value}
                className={[
                  'flex cursor-pointer flex-col gap-2 rounded-2xl border-2 p-4 transition',
                  active
                    ? 'border-madeb bg-madeb/5 shadow-card'
                    : 'border-nuit/15 bg-white hover:border-madeb/40',
                ].join(' ')}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{opt.emoji}</span>
                  <input
                    type="radio"
                    value={opt.value}
                    className="h-5 w-5 accent-madeb"
                    {...register('profil')}
                  />
                </div>
                <span className="font-semibold text-nuit">{opt.titre}</span>
                <span className="text-sm text-nuit/60">{opt.desc}</span>
              </label>
            )
          })}
        </div>
      </div>

      <PhotoUpload value={photo} onChange={setPhoto} error={photoError} />
    </div>
  )
}
