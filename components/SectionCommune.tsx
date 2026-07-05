'use client'

import { useFormContext } from 'react-hook-form'
import { VICARIATS, PAROISSE_AUTRE, paroissesPour } from '@/lib/vicariats'
import type { FormValues } from '@/lib/validations'
import { TextField } from './fields'

function ErrorText({ name }: { name: string }) {
  const {
    formState: { errors },
  } = useFormContext()
  const msg = (errors as Record<string, { message?: string }>)[name]?.message
  if (!msg) return null
  return (
    <p className="fco-error" role="alert">
      {msg}
    </p>
  )
}

function ParoisseFields() {
  const { register, watch, formState } = useFormContext<FormValues>()
  const vicariat = watch('vicariat')
  const paroisse = watch('paroisse')
  const paroisses = paroissesPour(vicariat)
  const hasVicariat = Boolean(vicariat)
  const errors = formState.errors as Record<string, { message?: string }>

  return (
    <>
      <div>
        <label htmlFor="paroisse" className="fco-label">
          Paroisse <span className="text-erreur">*</span>
        </label>
        <select
          id="paroisse"
          disabled={!hasVicariat}
          className={`fco-input ${errors.paroisse ? 'fco-input-error' : ''} disabled:cursor-not-allowed disabled:bg-ciel/40`}
          {...register('paroisse')}
        >
          <option value="" disabled>
            {hasVicariat
              ? 'Sélectionner votre paroisse…'
              : "Choisissez d'abord un vicariat"}
          </option>
          {paroisses.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
          {hasVicariat && <option value={PAROISSE_AUTRE}>{PAROISSE_AUTRE}</option>}
        </select>
        <ErrorText name="paroisse" />
      </div>

      {paroisse === PAROISSE_AUTRE && (
        <div className="sm:col-span-2">
          <TextField
            name="paroisse_autre"
            label="Nom de votre paroisse"
            required
            placeholder="Saisissez le nom exact de votre paroisse ou communauté"
          />
        </div>
      )}
    </>
  )
}

export function SectionCommune() {
  const { register, setValue, formState } = useFormContext<FormValues>()
  const errors = formState.errors as Record<string, { message?: string }>

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

          <div>
            <label htmlFor="vicariat" className="fco-label">
              Vicariat <span className="text-erreur">*</span>
            </label>
            <select
              id="vicariat"
              defaultValue=""
              className={`fco-input ${errors.vicariat ? 'fco-input-error' : ''}`}
              {...register('vicariat', {
                // Changer de vicariat réinitialise la paroisse dépendante.
                onChange: () => {
                  setValue('paroisse', '', { shouldValidate: false })
                  setValue('paroisse_autre', '', { shouldValidate: false })
                },
              })}
            >
              <option value="" disabled>
                Sélectionner…
              </option>
              {VICARIATS.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
            <ErrorText name="vicariat" />
          </div>

          <ParoisseFields />
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
