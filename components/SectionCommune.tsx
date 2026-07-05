'use client'

import { VICARIATS } from '@/lib/vicariats'
import { SelectField, TextField } from './fields'

export function SectionCommune() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-madeb">
          Informations personnelles
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="prenom" label="Prénom" required />
          <TextField name="nom" label="Nom" required />
          <TextField
            name="whatsapp"
            label="Numéro WhatsApp"
            type="tel"
            inputMode="tel"
            required
            placeholder="+229 01 96 00 00 00"
          />
          <TextField
            name="email"
            label="Email"
            type="email"
            inputMode="email"
            placeholder="Optionnel"
          />
          <SelectField
            name="vicariat"
            label="Vicariat"
            options={VICARIATS}
            required
          />
          <TextField name="paroisse" label="Paroisse" required />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-madeb">
          Informations professionnelles
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            name="secteur_activite"
            label="Secteur d'activité"
            required
            placeholder="Éducation, Commerce, Santé…"
          />
          <TextField
            name="profession"
            label="Profession / Métier"
            required
            placeholder="Intitulé du poste ou du métier"
          />
          <div className="sm:col-span-2">
            <TextField
              name="employeur"
              label="Employeur / Structure"
              placeholder="Optionnel"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
