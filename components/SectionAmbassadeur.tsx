'use client'

import { CANAUX_VENTE, DISPONIBILITES, RESEAUX_ESTIMES } from '@/lib/options'
import { CheckboxGroup, SelectField, TextareaField } from './fields'

export function SectionAmbassadeur() {
  return (
    <div className="space-y-5">
      <p className="rounded-xl bg-or/10 p-4 text-sm text-nuit/70">
        En tant qu'ambassadeur, vous recevez un{' '}
        <strong>code de parrainage</strong> après validation et touchez{' '}
        <strong>15% de commission</strong> sur les ventes réalisées.
      </p>

      <TextareaField
        name="motivation_ambassadeur"
        label="Motivation"
        required
        rows={5}
        minLength={50}
        placeholder="Pourquoi souhaitez-vous devenir ambassadeur FCO ?"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          name="reseau_estime"
          label="Réseau estimé"
          options={RESEAUX_ESTIMES}
          required
        />
        <SelectField
          name="disponibilite"
          label="Disponibilité"
          options={DISPONIBILITES}
          required
        />
      </div>

      <CheckboxGroup
        name="canaux_vente"
        label="Canaux de vente envisagés"
        options={CANAUX_VENTE}
        hint="Optionnel — cochez tous ceux qui s'appliquent."
      />
    </div>
  )
}
