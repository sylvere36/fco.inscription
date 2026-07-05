'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  formSchema,
  ACCEPTED_IMAGE_TYPES,
  MAX_PHOTO_SIZE,
  type FormValues,
} from '@/lib/validations'
import { PAROISSE_AUTRE } from '@/lib/vicariats'
import { Stepper } from './Stepper'
import { SectionProfil } from './SectionProfil'
import { SectionCommune } from './SectionCommune'
import { SectionEncadreur } from './SectionEncadreur'
import { SectionAmbassadeur } from './SectionAmbassadeur'
import { CheckboxField } from './fields'

const STEP1_FIELDS: (keyof FormValues)[] = [
  'prenom',
  'nom',
  'whatsapp',
  'email',
  'vicariat',
  'paroisse',
  'paroisse_autre',
  'secteur_activite',
  'profession',
  'employeur',
]

const TITRES = [
  { titre: 'Mon profil', soustitre: 'Choisissez votre rôle et ajoutez une photo.' },
  { titre: 'Mes informations', soustitre: 'Vos coordonnées et votre activité.' },
  { titre: 'Mon engagement', soustitre: 'Les détails propres à votre profil.' },
]

function validatePhoto(photo: File | null): string | undefined {
  if (!photo) return 'Une photo de profil est obligatoire.'
  if (!ACCEPTED_IMAGE_TYPES.includes(photo.type))
    return 'Format non supporté. Utilisez JPEG, PNG ou WebP.'
  if (photo.size > MAX_PHOTO_SIZE) return 'La photo dépasse 5 Mo.'
  return undefined
}

const defaultValues = {
  profil: undefined,
  prenom: '',
  nom: '',
  whatsapp: '',
  email: '',
  vicariat: '',
  paroisse: '',
  paroisse_autre: '',
  secteur_activite: '',
  profession: '',
  employeur: '',
  type_produit: undefined,
  description_produit: '',
  capacite_production: undefined,
  besoin_rebranding: false,
  lien_produit: '',
  motivation_ambassadeur: '',
  reseau_estime: undefined,
  disponibilite: undefined,
  canaux_vente: [],
  consent: false,
}

export function FormulaireFCO() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoError, setPhotoError] = useState<string | undefined>()
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    defaultValues: defaultValues as unknown as FormValues,
  })

  const { handleSubmit, trigger, getValues, watch } = methods
  const profil = watch('profil')

  async function goNext() {
    if (step === 0) {
      const okProfil = await trigger('profil')
      const pErr = validatePhoto(photo)
      setPhotoError(pErr)
      if (!okProfil || pErr) return
    } else if (step === 1) {
      const ok = await trigger(STEP1_FIELDS)
      if (!ok) return
    }
    setApiError(null)
    setStep((s) => Math.min(s + 1, 2))
  }

  function goPrev() {
    setApiError(null)
    setStep((s) => Math.max(s - 1, 0))
  }

  async function onValid() {
    const pErr = validatePhoto(photo)
    if (pErr) {
      setPhotoError(pErr)
      setStep(0)
      return
    }

    setSubmitting(true)
    setApiError(null)
    try {
      const v = getValues()
      const fd = new FormData()

      const append = (k: string, val: unknown) => {
        if (val === undefined || val === null) return
        fd.append(k, String(val))
      }

      append('profil', v.profil)
      append('prenom', v.prenom)
      append('nom', v.nom)
      append('whatsapp', v.whatsapp)
      append('email', v.email)
      append('vicariat', v.vicariat)
      // Résolution de la paroisse : « Autre » → valeur saisie librement.
      const paroisseFinale =
        v.paroisse === PAROISSE_AUTRE ? v.paroisse_autre : v.paroisse
      append('paroisse', paroisseFinale)
      append('secteur_activite', v.secteur_activite)
      append('profession', v.profession)
      append('employeur', v.employeur)

      if (v.profil === 'encadreur') {
        append('type_produit', v.type_produit)
        append('description_produit', v.description_produit)
        append('capacite_production', v.capacite_production)
        append('besoin_rebranding', v.besoin_rebranding ? 'true' : 'false')
        append('lien_produit', v.lien_produit)
      }

      if (v.profil === 'ambassadeur') {
        append('motivation_ambassadeur', v.motivation_ambassadeur)
        append('reseau_estime', v.reseau_estime)
        append('disponibilite', v.disponibilite)
        fd.append('canaux_vente', JSON.stringify(v.canaux_vente ?? []))
      }

      append('consent', 'true')
      if (photo) fd.append('photo', photo)

      const res = await fetch('/api/inscription', { method: 'POST', body: fd })
      if (!res.ok) {
        setApiError(
          "Une erreur est survenue lors de l'envoi. Vérifiez vos informations et réessayez.",
        )
        setSubmitting(false)
        return
      }
      router.push('/success')
    } catch {
      setApiError(
        'Impossible de joindre le serveur. Vérifiez votre connexion et réessayez.',
      )
      setSubmitting(false)
    }
  }

  function onInvalid(errors: Record<string, unknown>) {
    const keys = Object.keys(errors)
    if (keys.includes('profil')) setStep(0)
    else if (keys.some((k) => STEP1_FIELDS.includes(k as keyof FormValues)))
      setStep(1)
    else setStep(2)
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onValid, onInvalid)}
        noValidate
        className="rounded-3xl bg-white p-5 shadow-card sm:p-8"
      >
        <div className="mb-6">
          <Stepper current={step} />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-nuit">{TITRES[step].titre}</h2>
          <p className="text-sm text-nuit/60">{TITRES[step].soustitre}</p>
        </div>

        {step === 0 && (
          <SectionProfil
            photo={photo}
            setPhoto={(f) => {
              setPhoto(f)
              setPhotoError(undefined)
            }}
            photoError={photoError}
          />
        )}

        {step === 1 && <SectionCommune />}

        {step === 2 && (
          <div className="space-y-6">
            {profil === 'encadreur' && <SectionEncadreur />}
            {profil === 'ambassadeur' && <SectionAmbassadeur />}
            {!profil && (
              <p className="rounded-xl bg-erreur/10 p-4 text-sm text-erreur">
                Veuillez d'abord choisir un profil à l'étape 1.
              </p>
            )}

            <CheckboxField
              name="consent"
              label="Je certifie que les informations fournies sont exactes et j'accepte que mes données soient utilisées par le FCO dans le cadre de cette initiative."
            />
          </div>
        )}

        {apiError && (
          <p className="mt-6 rounded-xl bg-erreur/10 p-4 text-sm font-medium text-erreur">
            {apiError}
          </p>
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          {step > 0 ? (
            <button
              type="button"
              onClick={goPrev}
              disabled={submitting}
              className="fco-btn-ghost"
            >
              ← Précédent
            </button>
          ) : (
            <span />
          )}

          {step < 2 ? (
            <button type="button" onClick={goNext} className="fco-btn-primary">
              Suivant →
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="fco-btn-primary"
            >
              {submitting ? (
                <>
                  <Spinner /> Envoi en cours…
                </>
              ) : (
                'Soumettre mon inscription'
              )}
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  )
}

function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"
      />
    </svg>
  )
}
