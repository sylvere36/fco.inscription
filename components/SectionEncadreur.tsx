'use client'

import { CAPACITES_PRODUCTION, TYPES_PRODUIT } from '@/lib/options'
import {
  CheckboxField,
  SelectField,
  TextField,
  TextareaField,
} from './fields'

export function SectionEncadreur() {
  return (
    <div className="space-y-5">
      <p className="rounded-xl bg-ciel/60 p-4 text-sm text-nuit/70">
        Ces informations concernent les produits que vous souhaitez mettre en
        marché via le FCO. Le FCO assure le rebranding, la mise en marché et la
        distribution.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          name="type_produit"
          label="Type de produit"
          options={TYPES_PRODUIT}
          required
        />
        <SelectField
          name="capacite_production"
          label="Capacité de production"
          options={CAPACITES_PRODUCTION}
          required
        />
      </div>

      <TextareaField
        name="description_produit"
        label="Description du produit"
        required
        rows={5}
        minLength={50}
        placeholder="Que produisez-vous ? Comment ? Avec quels matériaux / ingrédients ?"
      />

      <TextField
        name="lien_produit"
        label="Lien ou photo du produit"
        inputMode="url"
        placeholder="Optionnel — lien vers une page, une photo, un catalogue…"
      />

      <CheckboxField
        name="besoin_rebranding"
        label="J'ai besoin que le FCO crée mon packaging / mon identité de marque (rebranding)."
      />
    </div>
  )
}
